---
path: "/docs/introduction/what-kurl-does"
date: "2019-12-19"
weight: 2
linktitle: "What kURL Does"
title: "What kURL Does"
---
## kURL and kubeadm
The [kubeadm tool](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/) is a subproject of the [sig-cluster-lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle) that provides best-practices for creating Kubernetes clusters. The project states:

> Likewise, installing various nice-to-have add-ons, like the Kubernetes Dashboard, monitoring solutions, and cloud-specific add-ons, is not in scope. Instead, we expect higher-level and more tailored tooling to be built on top of kubeadm, and ideally, using kubeadm as the basis of all deployments will make it easier to create conformant clusters.

kURL aims to be the higher-level tool for combining kubeadm with add-ons.

## Kubeadm Pre-Init
Kubernetes has a few prerequisites that are outside of the scope of the kubeadm installer. For example, Docker (or another container runtime) must be present before running kubeadm. The kURL installer provides a declarative way to package a Docker installation (again, for both online and airgapped environments) along with advanced Docker Engine configuration options.

kURL will perform the following steps on the host prior to delegating to `kubeadm init`.

* Check OS compatibility
* Check Docker compatibility if pre-installed
* Disable swap
* Check SELinux
* Install Docker
* Install Kubeadm, Kubelet, Kubectl and CNI packages
* Generate Kubeadm config files from flags passed to the script
* Load kernel modules required for running Kube-proxy in IPVS mode
* Configure Docker and Kubernetes to work behind a proxy if detected

## After kubeadm (Adding Add-Ons)
Once kubeadm gets the cluster running, it’s not ready for an application yet. A cluster will need networking, storage and more. These services are provided by other other open source components, including a lot of the CNCF ecosystem. In a kURL installation manifest, you can specify the additional add-ons that are installed after kubectl starts the cluster. For example, you can include Calico for a CNI plugin, Rook for distributed storage, Prometheus for monitoring and Fluentd for log aggregation. In addition to specifying the add-ons and versions, most add-ons include advanced options that allow you to specify the initial configuration.

After `kubeadm init` has brought up the Kubernetes control plane, kURL will install add-ons into the cluster.
The available add-ons are:

* [Weave](https://www.weave.works/oss/net/)
* [Rook](https://rook.io/)
* [Contour](https://projectcontour.io/)
* [Docker Registry](https://docs.docker.com/registry/)
* [Prometheus](https://prometheus.io/)
* [Nodeless](https://www.elotl.co/)
* [Calico](https://www.projectcalico.org/)
* [Velero](https://velero.io/)
* [EKCO](https://github.com/replicatedhq/ekco)
* [OpenEBS](https://openebs.io/)
* [MinIO](https://min.io/)
* [NGINX Ingress](https://kubernetes.github.io/ingress-nginx/)

