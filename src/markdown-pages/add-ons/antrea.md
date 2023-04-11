---
path: "/docs/add-ons/antrea"
date: "2020-05-13"
linktitle: "Antrea"
weight: 30
title: "Antrea Add-On"
addOn: "antrea"
isDeprecated: true
---

## Deprecation Notice

### This add-on is deprecated.

As of March 27, 2023, the Antrea add-on is deprecated. The Antrea add-on might be removed from kURL after June 31st, 2023. Existing installations that use the Antrea add-on are supported during this deprecation window. We recommend that you remove the Antrea add-on on or before June 31st, 2023 and instead use the [Flannel](https://kurl.sh/docs/add-ons/flannel) add-on.

## Summary

[Antrea](https://antrea.io/) implements the Container Network Interface (CNI) to enable pod networking in a Kubernetes cluster.
It also functions as a NetworkPolicy controller to optionally enforce security at the network layer.
Antrea is implemented with Open vSwitch and IPSec.

By default, Antrea [encrypts traffic](https://antrea.io/docs/v1.4.0/docs/traffic-encryption/) between nodes. 
kURL does not install the necessary kernel modules to enable traffic encryption.
An installer is blocked if encryption is enabled and the host does not have the required `wireguard` module installed.
If you do not want to install `wireguard` manually, you can disable encryption by setting `isEncryptionDisabled` to `true`. 

## Advanced Install Options

```yaml
spec:
  antrea:
    version: "1.4.0"
    isEncryptionDisabled: true
    podCIDR: "10.32.0.0/22"
    podCidrRange: "/22"
```

flags-table
