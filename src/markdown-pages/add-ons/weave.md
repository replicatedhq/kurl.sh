---
path: "/docs/add-ons/weave"
date: "2020-05-13"
linktitle: "Weave"
weight: 59
title: "Weave Add-On"
addOn: "weave"
isDeprecated: true
---

## Deprecation Notice

### This add-on is deprecated.

As of March 27, 2023, the Weave add-on is deprecated. The Weave add-on might be removed from kURL after September 31st, 2023. Existing installations that use the Weave add-on are supported during this deprecation window. We recommend that you remove the Weave add-on on or before September 31, 2023 and instead use the [Flannel](https://kurl.sh/docs/add-ons/flannel) add-on. For more information about how to migrate from Weave, see [Migration from Weave](https://kurl.sh/docs/add-ons/flannel#migration-from-weave).

## Summary

Weave Net creates a virtual network that connects containers across multiple hosts and enables their automatic discovery. With Weave Net, portable microservices-based applications consisting of multiple containers can run anywhere: on one host, multiple hosts or even across cloud providers and data centers.

_**Warning**_: The use of symbolic links in conjunction with the Weave Addon could potentially cause inconsistencies, potentially hindering Weave's ability to establish reliable connections. This might result in operational errors or malfunctions. To minimize network connectivity issues, it is generally recommended to avoid symbolic links in Weave's network-related configurations.

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

## System Requirements

The following additional ports must be open between nodes for multi-node clusters:

#### Primary Nodes:

| Protocol | Direction | Port Range | Purpose                 | Used By |
| -------  | --------- | ---------- | ----------------------- | ------- |
| TCP      | Inbound   | 6783       | Weave Net control       | All     |
| UDP      | Inbound   | 6783-6784  | Weave Net data          | All     |

#### Secondary Nodes:

| Protocol | Direction | Port Range | Purpose                 | Used By |
| -------  | --------- | ---------- | ----------------------- | ------- |
| TCP      | Inbound   | 6783       | Weave Net control       | All     |
| UDP      | Inbound   | 6783-6784  | Weave Net data          | All     |
