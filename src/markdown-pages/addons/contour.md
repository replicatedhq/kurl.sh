---
path: "/docs/add-ons/contour"
date: "2020-05-13"
linktitle: "Contour Add-On"
weight: 31
title: "Contour Add-On"
addOn: "contour"
---

Contour is an Ingress controller for Kubernetes that works by deploying the Envoy proxy as a reverse proxy and load balancer. Contour supports dynamic configuration updates out of the box while maintaining a lightweight profile.

## Advanced Install Options

```yaml
spec:
  contour:
    version: "0.14.0"
```

flags-table