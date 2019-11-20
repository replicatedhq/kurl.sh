---
path: "/docs/introduction"
date: "2019-10-15"
weight: 0
linktitle: "Introduction"
title: "Introduction to KURL"
---

The Kubernetes URL Creator is a framework for customizing Kubernetes distributions to share as URLs (to install via `curl` and `bash`) or as downloadable packages (to install in airgapped environments). KURL is open source, with a growing list of [add-on components](/add-ons) (including Rook, Weave, Contour, Prometheus, and more) which is easily extensible by [contributing additional add-ons](/docs/add-on-author/contributing-an-add-on).

The generated URLs use a hash to identify a specific set of components and versions, but it's also possible to [create and manage custom Kubernetes URLs](https://kots.io/vendor/embedded-kubernetes/embedded-kubernetes/) with the [Replicated vendor dashboard](https://vendor.replicated.com).
