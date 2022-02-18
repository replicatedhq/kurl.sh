---
path: "/docs/add-ons/weave"
date: "2020-05-13"
linktitle: "Weave Add-On"
weight: 57
title: "Weave Add-On"
addOn: "weave"
---

Weave Net creates a virtual network that connects containers across multiple hosts and enables their automatic discovery. With Weave Net, portable microservices-based applications consisting of multiple containers can run anywhere: on one host, multiple hosts or even across cloud providers and data centers.

## Advanced Install Options

```yaml
spec:
  weave:
    version: "2.5.2"
    isEncryptionDisabled: true
    podCIDR: "10.10.0.0/16"
    podCidrRange: "/16"
    noMasqLocal: true
```

flags-table
