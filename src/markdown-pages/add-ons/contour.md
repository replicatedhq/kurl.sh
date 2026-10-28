---
path: "/docs/add-ons/contour"
date: "2021-01-20"
linktitle: "Contour"
weight: 35
title: "Contour Add-On"
addOn: "contour"
---

Contour is an Ingress controller for Kubernetes that works by deploying the Envoy proxy as a reverse proxy and load balancer. Contour supports dynamic configuration updates out of the box while maintaining a lightweight profile.

## Compatibility

* Contour 1.15.1 and earlier are not compatible with Kubernetes 1.22 or later.
* Contour 1.16.0 and later require Kubernetes 1.19 or later.

## Advanced Install Options

```yaml
spec:
  contour:
    version: "1.11.0"
    tlsMinimumProtocolVersion: "1.3"
    httpPort: 80
    httpsPort: 443
```

flags-table
