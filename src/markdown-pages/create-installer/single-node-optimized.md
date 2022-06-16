---
path: "/docs/create-installer/single-node-optimized"
date: "2022-02-18"
weight: 21
linktitle: "Single-Node Optimized"
title: "Single-Node Optimized"
isBeta: true
---

While kURL is flexible and capable of supporting a variety of different distributions, there is beta support for an installer specification that is optimized for use with single-node installations that are not intended to scale to multiple nodes. Some use cases only require a single node, and this installer specification is optimized for these use cases.

## Installer Specs
 Because this is a beta feature, we have two possible optimized installer specificationss. One uses [K3s](/docs/add-ons/k3s) and the other uses [RKE2](/docs/add-ons/rke2). Additional information on these distributions and their limitations while in beta can be found in the linked documentation.

 Both K3s and RKE2 are Kubernetes distributions from Rancher that are packaged as a single binary. This makes these distributions smaller and simpler to support as compared to Kubernetes (`kubeadm`). In addition, these distributions include several add-ons out of the box. For example, K3s includes the [Local Path Provisioner](https://github.com/rancher/local-path-provisioner) for storage, which is a simpler storage solution that creates `hostPath` based volumes. Likewise, the included networking solutions for K3s and RKE2 (Flannel and Canal, respectively) are simpler and more suited for single-node installations.

### K3s
```yaml
kind: Installer
metadata:
  name: single-node
spec: 
  k3s:
    version: 1.23.3+k3s1
  registry: 
    version: 2.7.x
  kotsadm: 
    version: 1.63.0
    uiBindPort: 30880
    disableS3: true
```

### RKE2
```yaml
kind: Installer
metadata:
  name: single-node
spec: 
  rke2:
    version: 1.22.6+rke2r1
  registry: 
    version: 2.7.x
  kotsadm: 
    version: 1.63.0
    uiBindPort: 30880
    disableS3: true
  openebs:
    version: 1.12.x
    isLocalPVEnabled: true
    localPVStorageClassName: "default"
    isCstorEnabled: false
```
