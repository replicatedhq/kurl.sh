---
path: "/docs/install-with-kurl/what-kurl-does"
date: "2019-12-19"
weight: 2
linktitle: "What kURL Does"
title: "What kURL Does"
---

## Kubeadm Pre-Init

Kurl will perform the following steps on the host prior to delegating to `kubeadm init`.

* Check OS compatibility
* Check Docker compatiblity if pre-installed
* Disable swap
* Check SELinux
* Install Docker
* Install Kubeadm, Kubelet, Kubectl and CNI packages
* Generate Kubeadm config files from flags passed to the script
* Load kernel modules required for running Kube-proxy in IPVS mode
* Configure Docker and Kubernetes to work behind a proxy if detected

## Add-Ons

After `kubeadm init` has brought up the Kubernetes control plane, Kurl will install addons into the cluster.
The available addons are:

* [Weave](https://www.weave.works/oss/net/)
* [Rook](https://rook.io/)
* [Contour](https://projectcontour.io/)
* [Docker Registry](https://docs.docker.com/registry/)
* [Prometheus](https://prometheus.io/)
* [Nodeless](https://www.elotl.co/)
* [Calico](https://www.projectcalico.org/)
* AWS (enables the AWS cloud provider in Kubernetes)
