---
path: "/docs/introduction/"
date: "2019-10-15"
weight: 0
linktitle: "Overview"
title: "Introduction to kURL"
---

The Kubernetes URL Creator is a framework for creating custom Kubernetes distributions. These distros can then be shared as URLs (to install via `curl` and `bash`) or as downloadable packages (to install in airgapped environments). kURL relies on [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/) to bring up the Kubernetes control plane, but there are a variety of tasks a system administrator must perform both before and after running kubeadm init in order to have a production-ready Kubernetes cluster. kURL is open source, with a growing list of [add-on components](/add-ons) (including Rook, Weave, Contour, Prometheus, and more) which is easily extensible by [contributing additional add-ons](/docs/add-on-author/).

As an alternative to using kubeadm, kURL has beta support for [K3s](/add-ons/k3s) and [RKE2](/add-ons/rke2), Kubernetes distributions from Rancher.

## kURL vs. Standard Distros  
### Production Grade Upstream Kubernetes
At its core, kURL is based on [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/), the cluster management tool built by the core Kubernetes team and owned by sig-cluster-lifecycle. This means it benefits from the latest Kubernetes updates, patches and security hot-fixes as they are shipped by Kubernetes maintainers. kURL is a framework for declaring the layers that exist before and after the services that kubeadm provides.

kURL can also leverage the K3s and RKE2 distributions instead of kubeadm. kURL's support of these distros is currently in beta. Several components are already prepackaged with these distributions—such as for networking, storage, and ingress—but other kURL add-ons can still be included.

### Flexible
Compared to standard Kubernetes distributions, it's worth emphasizing that kURL is actually a flexible Kubernetes distribution creator. Most distributions make decisions about CRI, CNI, Storage, Ingress, etc. out of the box. Comparatively, [kurl.sh](https://kurl.sh) allows you to choose your own providers and versions of these components.

### Extensible
The Kustomized-based, [open source add-on model](https://github.com/replicatedhq/kurl/tree/master/addons) means anyone in the community can contribute additional add-ons via Kustomizations.

### Airgap Enabled
kURL builds and hosts airgap bundles with no additional configuration. Because each add-on specifies its required Docker images in a manifest file, a single `Installer` yaml is all that's required to specify a `tar.gz` bundle that can install a full stack into an airgapped environment.

### Designed for Embedding
kURL is both embeddable and swappable. It's designed to quickly and pragmatically get an application up-and-running in any environment that can provide a modern Linux server, including private cloud, vSphere, and traditional bare metal data centers.

## Getting Started with kURL
There are a few ways to get started with kURL, the most common being [creating a distro](../create-installer/) and then [installing a cluster](../install-with-kurl) from your distro. From there, we'd love to see more [add-ons created](../addon-author) or [core contributions](../community/core-contributions).
