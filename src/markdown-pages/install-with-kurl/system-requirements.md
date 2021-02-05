---
path: "/docs/install-with-kurl/system-requirements"
date: "2019-12-19"
weight: 16
linktitle: "System Requirements"
title: "System Requirements"
---

## Supported Operating Systems

* Ubuntu 16.04 (Kernel version >= 4.15)
* Ubuntu 18.04 (Recommended)
* Ubuntu 20.04 (Docker version >= 19.03.10)
* CentOS 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.1, 8.2, 8.3 (CentOS 8.x requires Containerd)
* RHEL 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.1, 8.2, 8.3 (RHEL 8.x requires Containerd)
* Amazon Linux 2

## Minimum System Requirements

* 4 CPUs or equivalent per machine
* 8 GB of RAM per machine
* 30 GB of Disk Space per machine
* TCP ports 6443 and 6783 open between cluster nodes
* UDP ports 6783 and 6784 open between cluster nodes

## kURL Dependencies Directory

kURL will install additional dependencies in the directory /var/lib/kurl/.
These dependencies include utilities as well as system packages and container images.
This directory must be writeable by the kURL installer and must have sufficient disk space (5 GB).
This directory can be overridden with the flag `kurl-install-directory`.
For more information see [kURL Advanced Install Options](/docs/install-with-kurl/advanced-options).
