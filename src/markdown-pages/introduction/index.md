---
path: "/docs/introduction/"
date: "2019-10-15"
weight: 0
linktitle: "Overview"
title: "Introduction to kURL"
---

The Kubernetes URL Creator is a framework for creating custom Kubernetes distributions. These distros can then be shared as URLs (to install via `curl` and `bash`) or as downloadable packages (to install in airgapped environments). Kurl relies on kubeadm to bring up the Kubernetes control plane, but there are a variety of tasks a system administrator must perform both before and after running kubeadm init in order to have a production-ready Kubernetes cluster. kURL is open source, with a growing list of [add-on components](/add-ons) (including Rook, Weave, Contour, Prometheus, and more) which is easily extensible by [contributing additional add-ons](/docs/add-on-author/contributing-an-add-on).

### Before kubeadm
Kubernetes has a few prerequisites that are outside of the scope of the kubeadm installer. For example, Docker (or another container runtime) must be present before running kubeadm. The kURL installer provides a declarative way to package a Docker installation (again, for both online and airgapped environments) along with advanced Docker Engine configuration options.

### After kubeadm
Once kubeadm gets the cluster running, it’s not ready for an application yet. A cluster will need networking, storage and more. These services are provided by other other open source components, including a lot of the CNCF ecosystem. In a kURL installation manifest, you can specify the additional add-ons that are installed after kubectl starts the cluster. For example, you can include Calico for a CNI plugin, Rook for distributed storage, Prometheus for monitoring and Fluentd for log aggregation. In addition to specifying the add-ons and versions, most add-ons include advanced options that allow you to specify the initial configuration.
