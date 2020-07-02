---
path: "/docs/add-ons/contour"
date: "2020-05-13"
linktitle: "Contour Add-On"
weight: 32
title: "Contour Add-On"
addOn: "contour"
---

Contour is an Ingress controller for Kubernetes that works by deploying the Envoy proxy as a reverse proxy and load balancer. Contour supports dynamic configuration updates out of the box while maintaining a lightweight profile.

## Advanced Install Options

```yaml
spec:
  contour:
    version: "1.0.1"
    tlsMinimumProtocolVersion: "1.3"
```

flags-table
