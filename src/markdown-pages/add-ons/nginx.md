---
path: "/docs/add-ons/nginx"
date: "2021-10-18"
linktitle: "NGINX Ingress Add-On"
weight: 32
title: "NGINX Ingress Add-On"
addOn: "nginx"
---

NGINX is deployed as an Ingress controller for Kubernetes. The associated ingress class is **NOT** created with the `default` annotation.

This addon only supports the stable Ingress API group, `networking.k8s.io/v1`, available in Kubernetes v1.19 and above. 

## Advanced Install Options

```yaml
spec:
  nginx:
    version: "1.0.4"
    httpPort: 80
    httpsPort: 443
```

flags-table
