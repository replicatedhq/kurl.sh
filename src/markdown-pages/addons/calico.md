---
path: "/docs/add-ons/calico"
date: "2020-05-13"
linktitle: "Calico Add-On"
weight: 27
title: "Calico Add-On"
addOn: "calico"
---
Calico is a CNI plugin and network policy manager.
It uses BGP to enable Pod networking without an overlay.
This add-on runs as a DaemonSet and is configured to use the Kubernetes control plane for storage rather than required a separate etcd database.

## Advanced Install Options

```yaml
spec:
  calico:
    version: "3.9.1"
```

flags-table