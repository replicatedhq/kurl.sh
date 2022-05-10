---
path: "/docs/add-ons/metrics-server"
date: "2020-11-02"
linktitle: "Metrics Server Add-On"
weight: 47
title: "Metrics Server Add-On"
addOn: "metricsServer"
---
[Metrics server](https://github.com/kubernetes-sigs/metrics-server) collects node and pod metrics from kubelets.
It provides a metrics API that enables pod autoscaling features in a Kubernetes cluster.

## Advanced Install Options

```yaml
spec:
  metricsServer:
    version: 0.3.7
```

flags-table
