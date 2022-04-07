---
path: "/docs/add-ons/kubernetes"
date: "2021-02-18"
linktitle: "Kubernetes (kubeadm) Add-On"
weight: 43
title: "Kubernetes (kubeadm) Add-On"
addOn: "kubernetes"
---

[Kubernetes](https://kubernetes.io/) is installed using [`kubeadm`](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/), the cluster management tool built by the core Kubernetes team and owned by `sig-cluster-lifecycle`.
`kubeadm` brings up the Kubernetes control plane before other add-ons are applied.

In addition to supporting Kubernetes using `kubeadm`, kURL can install [RKE2](/docs/add-ons/rke2) and [K3s](/docs/add-ons/k3s).
Support for both of these distributions is in beta. For more information about limitations and instructions, see the respective add-on pages.

## Advanced Install Options

flags-table

### Kube Reserved

CPU, memory, and disk resources are reserved for Kubernetes system daemons when the `kubeReserved` flag is set to `true`. 

Allocatable resources are calculated using the following equation:    
`ALLOCATABLE = CAPACITY - RESERVED - EVICTION-THRESHOLD`

For memory resources, kURL reserves the following:
* 255 MiB of memory for machines with less than 1 GiB of memory
* 25% of the first 4 GiB of memory
* 20% of the next 4 GiB of memory (up to 8 GiB)
* 10% of the next 8 GiB of memory (up to 16 GiB)
* 6% of the next 112 GiB of memory (up to 128 GiB)
* 2% of any memory above 128 GiB

For CPU resources, kURL reserves the following:
* 6% of the first core
* 1% of the next core (up to 2 cores)
* 0.5% of the next 2 cores (up to 4 cores)
* 0.25% of any cores above 4 cores

For ephemeral storage, kURL reserves 1Gi.

kURL uses the CPU and memory ranges from [GKE cluster architecture](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture#node_allocatable).
