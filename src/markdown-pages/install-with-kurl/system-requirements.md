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

#### Primary Nodes:

| Protocol | Direction | Port Range | Purpose                 | Used By |
| -------  | --------- | ---------- | ----------------------- | ------- |
| TCP      | Inbound   | 6443       | Kubernetes API server   | All     |
| TCP      | Inbound   | 2379-2380  | etcd server client API  | Primary |
| TCP      | Inbound   | 10250      | kubelet API             | Primary |
| TCP      | Inbound   | 6783       | Weave Net control       | All     |
| UDP      | Inbound   | 6783-6784  | Weave Net data          | All     |

#### Secondary Nodes:

| Protocol | Direction | Port Range | Purpose                 | Used By |
| -------  | --------- | ---------- | ----------------------- | ------- |
| TCP      | Inbound   | 10250      | kubelet API             | Primary |
| TCP      | Inbound   | 6783       | Weave Net control       | All     |
| UDP      | Inbound   | 6783-6784  | Weave Net data          | All     |

These ports are required for [Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#control-plane-node-s) and [Weave Net](https://www.weave.works/docs/net/latest/faq/#ports).

## High Availability Requirements

In addition to the networking requirements described in the previous section, operating a cluster with high availability adds additional constraints.

### Control Plane HA

To operate the Kubernetes control plane in HA mode, it is recommended to have a minimum of 3 master nodes. 
In the event that one of these nodes becomes unavailable, the remaining two will still be able to function with an etcd quorom. 
As the cluster scales, dedicating these master nodes to control-plane only workloads using the `noSchedule` taint should be considered.
This will affect the number of nodes that need to be provisioned.

### Worker Node HA

The number of required worker nodes is primarily a function of the desired application availability and throughput.
By default, master nodes in kURL also run application workloads. 
At least 2 nodes should be used for data durability for applications that use persistent storage (i.e. databases) deployed in-cluster.

### Load Balancers

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f5f8fc'}}}%%
graph TB
    A(TCP Load Balancer)
    A -->|Port 6443| B[Master Node]
    A -->|Port 6443| C[Master Node]
    A -->|Port 6443| D[Master Node]
```

Highly available cluster setups require a load balancer to route requests to healthy nodes. 
The following requirements need to be met for load balancers used on the control plane (master nodes):
1. The load balancer must be able to route TCP traffic, as opposed to Layer 7/HTTP traffic.
1. The load balancer must support hairpinning, i.e. nodes referring to eachother through the load balancer IP.
    * **Note**: On AWS, only internet-facing Network Load Balancers (NLBs) and internal AWS NLBs **using IP targets** (not Instance targets) support this.<br /><br />
1. Load balancer health checks should be configured using TCP probes of port 6443 on each master node.
1. The load balancer should target each master node on port 6443.
1. In accordance with the above firewall rules, port 6443 should be open on each master node.

The IP or DNS name and port of the load balancer should be provided as an argument to kURL during the HA setup. 
See [Highly Available K8s](/docs/install-with-kurl/#highly-available-k8s-ha) for more install information.

Load balancer requirements for application workloads vary depending on workload.
