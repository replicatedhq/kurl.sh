---
path: "/docs/install-with-kurl/preflights"
date: "2021-04-05"
weight: 18
linktitle: "Preflights"
title: "Preflights"
---

The kURL installer runs several preflight checks to detect problems with the target environment early in the installation process.
Some checks run conditionally depending on whether the installer is performing an upgrade or a join.
Additional checks may be enabled by add-ons included in the installer.
Warnings and errors can be bypassed with the [preflight-ignore and preflight-ignore-warnings flags](/docs/install-with-kurl/advanced-options).

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

## Add-on preflights

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

