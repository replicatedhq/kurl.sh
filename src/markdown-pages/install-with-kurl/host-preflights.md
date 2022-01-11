---
path: "/docs/install-with-kurl/host-preflights"
date: "2021-04-05"
weight: 18
linktitle: "Host Preflights"
title: "Host Preflights"
---

The kURL installer runs several host preflight checks to detect problems with the target environment early in the installation process.
Some checks run conditionally depending on whether the installer is performing an upgrade or a join.
Additional checks may be enabled by add-ons included in the installer.
Custom host preflights can also be added to the kURL installer spec. These will run in addition to kURL's default host preflights.
Warnings and errors can be bypassed with the [`preflight-ignore` and `preflight-ignore-warnings` flags](/docs/install-with-kurl/advanced-options).

## Checks Run on All Nodes

The following checks run on all nodes where kURL is installed:

* The installer is running on a 64-bit platform.
* The installer is running on a [supported OS](/docs/install-with-kurl/system-requirements#supported-operating-systems).
* Swap is disabled.
* Docker is not being installed on EL 8.
* Firewalld is disabled.
* SELinux is disabled.
* At least one nameserver is accessible on a non-loopback address.
* TCP ports 10248 and 10250 are available for kubelet.
* TCP port 10257 is available for the kube controller manager.
* TCP port 10259 is available for the kube scheduler.
* At least 4 GiB of memory is available. (Warn when less than 8GiB).
* /var/lib/kubelet has at least 30GiB total space and is less than 80% full. (Warn when more than 60% full).
* The server has at least 2 CPUs. (Warn when less than 4 CPUs).
* The system clock is synchronized and the time zone is set to UTC.

## Initial Primary

These checks run only on new installs on primary nodes:

* TCP port 6443 is available for the Kubernetes API server.
* TCP ports 2379, 2380 and 2381 are available for etcd.
* The load balancer address is propery configured to forward TCP traffic to the node. (This check only runs on the first primary).
* 99th percentile filesystem write latency in the etcd data directory is less than 20ms. (Warn when more than 10ms). [See cloud recommendations](/docs/install-with-kurl/system-requirements#cloud-disk-performance)

## Join

These checks run on all primary and secondary nodes joining an existing cluster:

* Can connect to the Kubernetes API server address

## Add-on host preflights

Some checks run depending on the add-ons enabled in the installer and their configuration:

### Weave

* All existing nodes in the cluster can be reached on TCP port 6783.
* TCP ports 6781, 6782 and 6783 are available on the current host.

### Rook & OpenEBS

* If using block storage, check that at least one block device is available with a minimum size of 10GiB.

### Prometheus

* TCP port 9100 is available for the node exporter.

### Longhorn

* /var/lib/longhorn has at least 50GiB total space and is less than 80% full. (Warn when more than 60% full).

### Docker

* /var/lib/docker has at least 30GiB total space and is less than 80% full. (Warn when more than 60% full).

### Containerd

* Containerd version 1.4.8 or higher is not being installed on Ubuntu 16.04.

### KOTS

* The Replicated API is accessible/reachable (online installs only).

## Adding custom host preflights (Beta)

Additional host preflight checks can be added in the kURL installer spec under `spec.kurl.hostPreflights`. See the [kURL add-on docs](/docs/add-ons/kurl) for an example and additional information. See the [Troubleshoot docs](https://troubleshoot.sh/docs/preflight/introduction/) to learn more about writing Troubleshoot specs.

## Excluding the default built-in host preflights

The default built-in host preflight checks can be excluded by setting the `spec.kurl.excludeBuiltinPreflights` field to `true`. See the [kURL add-on docs](/docs/add-ons/kurl) for additional information.

The relevant YAML for the default built-in host preflight checks can be found in the [kURL](https://github.com/replicatedhq/kURL) repo:

### Generic host preflight checks

The generic host preflight checks can be found [here](https://github.com/replicatedhq/kURL/blob/main/pkg/preflight/assets/host-preflights.yaml).

### Add-on specific host preflight checks

To find the host preflight checks file for a specific version of an addon, the file path structure would be like so:

`https://github.com/replicatedhq/kURL/blob/main/addons/<addon-name>/<addon-version>/host-preflight.yaml`

So for example, for Weave version 2.6.5 the host preflight checks can be found in: https://github.com/replicatedhq/kURL/blob/main/addons/weave/2.6.5/host-preflight.yaml

### Combining multiple host preflight checks

To merge multiple checks together, you can just combine the list of collectors and analyzers for each.
For example, the below YAML combines the host preflight checks for [longhorn v1.2.2](https://github.com/replicatedhq/kURL/blob/main/addons/longhorn/1.2.2/host-preflight.yaml) and [prometheus v0.49.0-17.1.3](https://github.com/replicatedhq/kURL/blob/main/addons/prometheus/0.49.0-17.1.3/host-preflight.yaml):

```yaml
apiVersion: troubleshoot.sh/v1beta2
kind: HostPreflight
metadata:
  name: longhorn-and-prometheus
spec:
  collectors:
    - diskUsage:
        collectorName: "Longhorn Disk Usage"
        path: /var/lib/longhorn
    - tcpPortStatus:
        collectorName: "Node Exporter Metrics Server TCP Port Status"
        port: 9100
        exclude: '{{kurl .IsUpgrade }}'

  analyzers:
    - diskUsage:
        checkName: "Longhorn Disk Usage"
        collectorName: "Longhorn Disk Usage"
        exclude: '{{kurl .IsUpgrade }}' # only run if this is not an upgrade
        outcomes:
          - fail:
              when: "total < 50Gi"
              message: The disk containing directory /var/lib/longhorn has less than 50Gi of total space
          - fail:
              when: "used/total > 80%"
              message: The disk containing directory /var/lib/longhorn is more than 80% full
          - warn:
              when: "used/total > 60%"
              message: The disk containing directory /var/lib/longhorn is more than 60% full
          - pass:
              message: The disk containing directory /var/lib/longhorn has at least 20Gi disk space available and is at least 50Gi in size
    - tcpPortStatus:
        checkName: "Node Exporter Metrics Server TCP Port Status"
        collectorName: "Node Exporter Metrics Server TCP Port Status"
        exclude: '{{kurl .IsUpgrade }}'
        outcomes:
          - fail:
              when: "connection-refused"
              message: Connection to port 9100 was refused. This is likely to be a routing problem since this preflight configures a test server to listen on this port.
          - warn:
              when: "address-in-use"
              message: Another process was already listening on port 9100.
          - fail:
              when: "connection-timeout"
              message: Timed out connecting to port 9100. Check your firewall.
          - fail:
              when: "error"
              message: Unexpected port status
          - pass:
              when: "connected"
              message: Port 9100 is available
          - warn:
              message: Unexpected port status
```
