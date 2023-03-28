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

kURL will not be moving forward with support of this add-on in kURL and is deprecated starting March 23, 2023.  This add-on will be EOL after September 31st 2023.  This add-on is no longer supported by the upstream maintainers. Existing installs that use this add-on will continue to be best-effort supported until the EOL date.  Please consider using the [Flannel](https://kurl.sh/docs/add-ons/flannel) for your CNI needs moving forward.  We offer a migration path for existing customer installs as described [here](https://kurl.sh/docs/add-ons/flannel#migration-from-weave).

## Summary

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
