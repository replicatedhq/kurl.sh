---
path: "/docs/add-ons/sonobuoy"
date: "2021-04-09"
linktitle: "Sonobuoy"
weight: 55
title: "Sonobuoy Add-On"
addOn: "Sonobuoy"
---

[Sonobuoy](https://github.com/vmware-tanzu/sonobuoy) is a diagnostic tool that makes it easier to understand the state of a Kubernetes cluster by running a set of plugins (including Kubernetes conformance tests) in an accessible and non-destructive manner.
It is a customizable, extendable, and cluster-agnostic way to generate clear, informative reports about your cluster.

This makes Sonobuoy assets available in the cluster, but does not run conformance tests.
The `sonobuoy` binary will be installed in the directory `/usr/local/bin`.

## Limitations

This add-on does not work if Kubernetes 1.27.x and Prometheus is installed as `sonobuoy` will panic with the error: `panic: runtime error: invalid memory address or nil pointer dereference`. This problem is being [addressed](https://github.com/vmware-tanzu/sonobuoy/pull/1909) in the upstream Sonobuoy project.

## Advanced Install Options

```yaml
spec:
  sonobuoy:
    version: "0.50.0"
```
