---
path: "/docs/create-installer/host-preflights/filesystem-performance"
date: "2022-02-17"
weight: 29
linktitle: "Filesystem Performance"
title: "Filesystem Performance"
---
 
The filesystem performance host preflight check is used to .

## Filesystem Performance Collector

The `filesystemPerformance` collector will collect information about .

### Parameters

In addition to the [shared collector properties](https://troubleshoot.sh/docs/collect/collectors/#shared-properties), the `filesystemPerformance` collector accepts the following parameters:

#### `timeout`



#### `directory`



#### `fileSize`



#### `operationSizeBytes`



#### `datasync`



#### `enableBackgroundIOPS`



#### `backgroundIOPSWarmupSeconds`



#### `backgroundWriteIOPS`



#### `backgroundReadIOPS`



#### `backgroundReadIOPSJobs`



## Filesystem Performance Analyzer

The `filesystemPerformance` analyzer supports multiple outcomes by validating . For example:

`p99 < 10ms`: The p99 write latency is less than 10ms.

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
