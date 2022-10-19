---
path: "/docs/add-ons/flannel"
date: "2022-10-19"
linktitle: "Flannel"
weight: 38
title: "Flannel Add-On"
addOn: "flannel"
---

[Flannel](https://github.com/flannel-io/flannel) implements the Container Network Interface (CNI) to enable pod networking in a Kubernetes cluster.
Flannel runs a small, single binary agent called flanneld in a Pod on each host, and is responsible for allocating a subnet lease to each host out of a larger, preconfigured address space.
Flannel uses the Kubernetes API directly to store the network configuration, the allocated subnets, and any auxiliary data (such as the host's public IP).
Packets are forwarded using VXLAN encapsulation.

## Advanced Install Options

```yaml
spec:
  flannel:
    version: "0.20.0"
    podCIDR: "10.32.0.0/22"
    podCIDRRange: "/22"
```

flags-table

## Custom Pod Subnet

The Pod subnet will default to `10.32.0.0/20` if available.
If not available, the installer will attempt to find an available range with prefix bits 20 in the `10.32.0.0/16` or `10.0.0.0/8` address spaces.
This can be overridden using the `podCIDR` to specify a specific address space, or `podCIDRRange` to specify a different prefix bits.
