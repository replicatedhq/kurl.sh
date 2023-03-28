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

kURL will not be moving forward with support of this add-on in kURL and is deprecated starting March 23, 2023.  This add-on will be EOL after June 31st 2023.  Existing installs that use this add-on will continue to be best-effort supported until the EOL date.  Please consider using the [Flannel](https://kurl.sh/docs/add-ons/flannel) for your CNI needs moving forward.

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
