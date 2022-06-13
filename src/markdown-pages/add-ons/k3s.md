---
path: "/docs/add-ons/k3s"
date: "2021-02-18"
linktitle: "K3s Add-On"
weight: 42
title: "K3s Add-On"
addOn: "k3s"
isBeta: true
---

[K3s](https://k3s.io/) is a lightweight Kubernetes distribution built by Rancher for Internet of Things (IoT) and edge computing.

Rather than using the [Kubernetes add-on](/docs/add-ons/kubernetes), which uses `kubeadm` to install Kubernetes, the K3s add-on can be used to install the K3s distribution. This distribution includes Kubernetes as well as several add-ons for networking, ingress, and more.

There are several reasons to use K3s instead of Kubernetes (`kubeadm`). The main reason is that K3s is simpler than upstream Kubernetes, so it is easier to support. K3s is packaged as a single binary that is less than 50MB. It reduces the dependencies and steps needed to install, run, and update Kubernetes, as compared to `kubeadm`. In addition, K3s has lower [CPU and RAM requirements](https://rancher.com/docs/k3s/latest/en/installation/installation-requirements/#hardware).

By default, K3s uses `sqlite3` as the storage backend instead of etcd.

## Operating System Compatibility
The K3s add-on is currently supported on CentOS and Ubuntu.

## Add-On Compatibility
The following are included by default with K3s:
* Flannel (CNI)
* CoreDNS
* Traefik (Ingress)
* Kube-proxy
* [Metrics Server](/docs/add-ons/metrics-server)
* [containerd](/docs/add-ons/containerd) (CRI)
* Local path provisioner (CSI)

K3s has been tested with the following add-ons:
* [KOTS](/docs/add-ons/kotsadm)
* [MinIO](/docs/add-ons/minio)
* [OpenEBS](/docs/add-ons/openebs)
* [Registry](/docs/add-ons/registry)
* [Rook](/docs/add-ons/rook)

## Limitations
Because K3s support is currently in beta, there are several limitations:
* Joining additional nodes is not supported.
* Upgrading from one version of K3s to another is not supported.
* Selecting a CRI or CNI provider is not supported because containerd and Flannel are already included.
* The NodePort range in K3s is 30000-32767, so `kotsadm.uiBindPort` must be set to something in this range.
* While Rook and OpenEBS have been tested, they are not recommended.
* Due to limitations with Velero and Restic, volumes provisioned using the default Local Path Provisioner (or volumes based on host paths) cannot be snapshotted.
* While K3s has experimental support for SELinux, this cannot currently be enabled through kURL, so SELinux should be disabled on the host.
