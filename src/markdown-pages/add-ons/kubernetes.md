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


flags-table
