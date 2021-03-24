---
path: "/docs/add-ons/antrea"
date: "2020-05-13"
linktitle: "Antrea Add-On"
weight: 29
title: "Antrea Add-On"
addOn: "antrea"
---

[Antrea](https://antrea.io/) implements the Container Network Interface (CNI) to enable pod networking in a Kubernetes cluster.
It also functions as a NetworkPolicy controller to optionallly enforce security at the network layer.
Antrea is implemented with Open vSwitch and IPSec.

## Advanced Install Options

```yaml
spec:
  antrea:
    version: "0.13.1"
    isEncryptionDisabled: true
    podCIDR: "10.32.0.0/22"
    podCidrRange: "/22"
```

flags-table
