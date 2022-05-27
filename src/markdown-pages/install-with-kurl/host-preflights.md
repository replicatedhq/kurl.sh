---
path: "/docs/install-with-kurl/host-preflights"
date: "2021-04-05"
weight: 12
linktitle: "Host Preflights"
title: "Host Preflights"
---

The kURL installer runs host preflight checks to detect problems with the target environment early in the installation process.
A variety of different types of host preflights can be run to check for various conditions.
These checks can also run conditionally, depending on whether the installer is performing an upgrade or a join, whether it's an air gap installation, and so on.

The installer has default host preflight checks that run to ensure that certain conditions are met (such as supported operating systems, disk usage, and so on).
The default host preflight checks are designed and maintained to help ensure the successful installation and ongoing health of the cluster.
The default preflight checks are also customizable. New host preflight checks can be added to run in addition to the defaults, or the default checks can be disabled to allow for a new set of host preflight checks to run instead.
For more information, see [customizing host preflight checks](/docs/create-installer/host-preflights).

Host prelight failures block the installation from continuing and exit with a non-zero return code.
This behavior can be changed as follows:
* For a more conservative approach, the [`host-preflight-enforce-warnings` flag](/docs/install-with-kurl/advanced-options) can be used to block the installation on warnings.
* The [`exclude-builtin-host-preflights` flag](/docs/install-with-kurl/advanced-options) can be used to skip the default host preflight checks and run only the custom checks.

## Default Host Preflights

The following sections detail the default host preflight checks.

### All Nodes

#### Installations and Upgrades

The following checks run on all nodes during installations and upgrades:

* The installer is running on a 64-bit platform.
* The installer is running on a [supported OS](/docs/install-with-kurl/system-requirements#supported-operating-systems).
* The server has at least 2 CPUs. (Warns when there are less than 4 CPUs.)
* At least 4 GiB of memory is available. (Warns when there is less than 8GiB.)
* Swap is disabled.
* Firewalld is disabled.
* SELinux is disabled.
* At least one nameserver is accessible on a non-loopback address.
* /var/lib/kubelet has at least 30GiB total space and is less than 80% full. (Warns when less than 10GiB available or when it is more than 60% full.)
* The system clock is synchronized and the time zone is set to UTC.

#### Installations Only

The following checks run on all nodes during installations only:

* TCP ports 10248 and 10250 are available for kubelet.
* TCP port 10257 is available for the kube controller manager.
* TCP port 10259 is available for the kube scheduler.

### Primary Nodes

These checks run only on primary nodes during new installations:

* TCP port 6443 is available for the Kubernetes API server.
* TCP ports 2379, 2380 and 2381 are available for etcd.
* The load balancer address is properly configured to forward TCP traffic to the node. (This check only runs during HA installs on first primary node.)
* Warn when 99th percentile filesystem write latency in the etcd data directory is greater than or equal to 10ms. For more information, see [cloud recommendations](/docs/install-with-kurl/system-requirements#cloud-disk-performance).

### Joining Nodes

These checks run on all primary and secondary nodes joining an existing cluster:

* Can connect to the Kubernetes API server address

### Add-on Host Preflight Checks

Some checks only run when certain add-ons are enabled or configured in a certain way in the installer:

#### Weave

These checks only run on installations with Weave:

* All existing nodes in the cluster can be reached on TCP port 6783.
* TCP ports 6781, 6782 and 6783 are available on the current host.

#### Rook

These checks only run on installations with Rook:

* If using block storage, checks that at least one block device is available with a minimum size of 10GiB.
* If using Rook version 1.0.4 or 1.0.4-14.2.21, checks that /opt/replicated/rook has at least 10GiB and is less than 80% full. (Warns when less than 25GiB is available.)

#### OpenEBS

This check only runs on installations with OpenEBS when cStor is enabled:

* If using block storage, checks that at least one block device is available with a minimum size of 10GiB.

#### Prometheus

This check only runs on installs with Prometheus:

* TCP port 9100 is available for the node exporter.

#### Longhorn

This check only runs on installations with Longhorn:

* /var/lib/longhorn has at least 50GiB total space and is less than 80% full. (Warns when it is more than 60% full.)

#### Docker

These checks only run on installations with Docker:

* Docker is not being installed on EL 8.
* /var/lib/docker has at least 30GiB total space and is less than 80% full. (Warns when less than 10GiB is available or when it is more than 60% full.)

#### Containerd

This check runs on installations and upgrades with Containerd:

* Containerd version 1.4.8 or higher is not being installed on Ubuntu 16.04.

#### KOTS

This check runs on online (not air gap) installations and upgrades with KOTS:

* The Replicated API is accessible/reachable.
