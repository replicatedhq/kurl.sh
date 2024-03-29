---
path: "/docs/create-installer/host-preflights/filesystem-performance"
date: "2022-03-03"
weight: 34
linktitle: "Filesystem Performance"
title: "Filesystem Performance"
---
 
The filesystem performance host preflight check is used to benchmark a filesystem's write latency.

## Filesystem Performance Collector

The `filesystemPerformance` collector benchmarks sequential write latency on a single file.
The optional background IOPS feature attempts to mimic real-world conditions by running read and write workloads prior to and during benchmark execution.

### Parameters

In addition to the [shared collector properties](https://troubleshoot.sh/docs/collect/collectors/#shared-properties), the `filesystemPerformance` collector accepts the following parameters:

#### `timeout`

Specifies the total timeout, including background IOPS setup and warmup if enabled.

#### `directory`

Specifies the directory where the benchmark will create files.

#### `fileSize`

Specifies the size of the file used in the benchmark.
The number of IO operations for the benchmark will be `fileSize` / `operationSizeBytes`.
This accepts valid Kubernetes resource units, such as Mi.

#### `operationSizeBytes`

Specifies the size of each write operation performed while benchmarking.
This does not apply to the background IOPS feature if enabled, since those must be fixed at 4096.

#### `sync`

Specifies whether to call sync on the file after each write. This does not apply to background IOPS task.

#### `datasync`

Specifies whether to call datasync on the file after each write.
This is skipped if `sync` is also true.
It does not apply to background IOPS task.

#### `enableBackgroundIOPS`

Enables the background IOPS feature.

#### `backgroundIOPSWarmupSeconds`

Specifies how long to run the background IOPS read and write workloads prior to starting the benchmarks.

#### `backgroundWriteIOPS`

Specifies the target write IOPS to run while benchmarking.
This is a limit and there is no guarantee it will be reached.
This is the total IOPS for all background write jobs.

#### `backgroundReadIOPS`

Specifies the target read IOPS to run while benchmarking.
This is a limit and there is no guarantee it will be reached.
This is the total IOPS for all background read jobs.

#### `backgroundWriteIOPSJobs`

Specifies the number of threads to use for background write IOPS.
This should be set high enough to reach the target specified in `backgroundWriteIOPS`.
For example, if `backgroundWriteIOPS` is 100 and write latency is 10ms, then a single job would barely be able to reach 100 IOPS, so this should be at least 2.

#### `backgroundReadIOPSJobs`

Specifies the number of threads to use for background read IOPS.
This should be set high enough to reach the target specified in `backgroundReadIOPS`.

## Filesystem Performance Analyzer

The `filesystemPerformance` analyzer supports multiple outcomes by validating the filesystem latency results. For example:

`p99 < 10ms`: The p99 write latency is less than 10ms.<br/>
`p90 > 20ms`: The p90 write latency is greater than 20ms.

## Example

Here is an example of how to use the filesystem performance host preflight check:

```yaml
apiVersion: troubleshoot.sh/v1beta2
kind: HostPreflight
metadata:
  name: filesystem-performance
spec:
  collectors:
    - filesystemPerformance:
        collectorName: Filesystem Latency Two Minute Benchmark
        exclude: '{{kurl and .IsPrimary (not .IsUpgrade) | not }}'
        timeout: 2m
        directory: /var/lib/etcd
        fileSize: 22Mi
        operationSizeBytes: 2300
        datasync: true
        enableBackgroundIOPS: true
        backgroundIOPSWarmupSeconds: 10
        backgroundWriteIOPS: 300
        backgroundWriteIOPSJobs: 6
        backgroundReadIOPS: 50
        backgroundReadIOPSJobs: 1
  analyzers:
    - filesystemPerformance:
        collectorName: Filesystem Latency Two Minute Benchmark
        exclude: '{{kurl and .IsPrimary (not .IsUpgrade) | not }}'
        outcomes:
          - pass:
              when: "p99 < 10ms"
              message: "Write latency is ok (p99 target < 10ms, actual: {{ .P99 }})"
          - warn:
              message: "Write latency is high. p99 target >= 10ms, actual:{{ .String }}"
```
