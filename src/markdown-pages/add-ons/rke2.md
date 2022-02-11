---
path: "/docs/add-ons/rke2"
date: "2021-02-11"
linktitle: "RKE2 Add-On (Beta)"
weight: 29
title: "RKE2 Add-On (Beta)"
addOn: "rke2"
---

[RKE2](https://rke2.io/), also known as RKE Government, is a full-conformant Kubernetes distribution from Rancher.

Rather than using the [Kubernetes add-on](/docs/add-ons/kubernetes), which uses kubeadm to install Kubernetes, the RKE2 add-on can be used to install the RKE2 distribution. This distribution includes Kubernetes as well as several add-ons for networking, ingress, and more.

In contrast to K3s, which has deviated from upstream Kubernetes to better support edge deployments, RKE2 maintains closer alignment with upstream Kubernetes.

## Operating System Compatibility
The RKE2 add-on is currently only supported on CentOS 7 or 8.

## Add-On Compatibility
The following are included by default with RKE2:
* Canal (CNI)
* CoreDNS
* Nginx (Ingress)
* Kube-proxy
* [Metrics Server](/docs/add-ons/metrics-server)
* [containerd](/docs/add-ons/containerd) (CRI)

RKE2 has been tested with the following add-ons:
* [KOTS](/docs/add-ons/KOTS)
* [MinIO](/docs/add-ons/minio)
* [OpenEBS](/docs/add-ons/openebs)
* [Velero](/docs/add-ons/velero)
* [Registry](/docs/add-ons/registry)
* [Rook](/docs/add-ons/rook)

## Limitations
Because RKE2 support is currently in beta, there are several limitations. The following are not currently supported.
* Joining additional nodes.
* Upgrading from one version of RKE2 to another.
* Selecting a CRI or CNI provider (since containerd and Canal are already included).
* The NodePort range in RKE2 is 30000-32767, so the `kotsadm.uiBindPort` must be set to something in this range.
* While Rook has been tested, it is not recommended.
