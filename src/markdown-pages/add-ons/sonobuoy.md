---
path: "/docs/add-ons/sonobuoy"
date: "2021-04-09"
linktitle: "Sonobuoy Add-On"
weight: 49
title: "Sonobuoy Add-On"
addOn: "Sonobuoy"
---

[Sonobuoy](https://github.com/vmware-tanzu/sonobuoy) is a diagnostic tool that makes it easier to understand the state of a Kubernetes cluster by running a set of plugins (including Kubernetes conformance tests) in an accessible and non-destructive manner. It is a customizable, extendable, and cluster-agnostic way to generate clear, informative reports about your cluster.

This makes Sonobuoy assets available in the cluster, but does not run conformance tests. The `sonobuoy` binary will be installed in the directory `/usr/local/bin`.

## Advanced Install Options

```yaml
spec:
  sonobuoy:
    version: "0.50.0"
```
