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
* TCP ports 2379, 2380, 6443, 6783, 10250, 10251 and 10252 open between cluster nodes
* UDP ports 6783 and 6784 open between cluster nodes

## kURL Dependencies Directory

kURL will install additional dependencies in the directory /var/lib/kurl/.
These dependencies include utilities as well as system packages and container images.
This directory must be writeable by the kURL installer and must have sufficient disk space (5 GB).
This directory can be overridden with the flag `kurl-install-directory`.
For more information see [kURL Advanced Install Options](/docs/install-with-kurl/advanced-options).
## Networking Requirements
### Firewall Openings for Online Installations

The following domains need to accessible from servers performing online kURL installs. 
IP addresses for these services can be found in [replicatedhq/ips](https://github.com/replicatedhq/ips/blob/master/ip_addresses.json).

| Host          | Description                                                                                                                                                                                                                                                                                      |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| amazonaws.com | tar.gz packages are downloaded from Amazon S3 during embedded cluster installations. The IP ranges to allowlist for accessing these can be scraped dynamically from the [AWS IP Address](https://docs.aws.amazon.com/general/latest/gr/aws-ip-ranges.html#aws-ip-download) Ranges documentation. |
| k8s.kurl.sh   | Kubernetes cluster installation scripts and artifacts are served from [kurl.sh](https://kurl.sh). Bash scripts and binary executables are served from kurl.sh. This domain is owned by Replicated, Inc which is headquartered in Los Angeles, CA.                                                |

No outbound internet access is required for airgapped installations.
### Host Firewall Rules

The kURL install script will prompt to disable firewalld. 
Note that firewall rules can affect communications between containers on the **same** machine, so it is recommended to disable these rules entirely for Kubernetes.
Firewall rules can be added after or preserved during an install, but because installation parameters like pod and service CIDRS can vary based on local networking conditions, there is no general guidance available on default requirements. 
See [Advanced Options](/docs/install-with-kurl/advanced-options) for installer flags that can preserve these rules.

The following ports must be open between nodes for multi-node clusters:
* TCP ports 2379, 2380, 6443, 6783, 10250, 10251 and 10252
* UDP ports 6783 and 6784

These ports are required for the [Kubernetes control plane](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#control-plane-node-s) and [Weave](https://www.weave.works/docs/net/latest/faq/#ports).
