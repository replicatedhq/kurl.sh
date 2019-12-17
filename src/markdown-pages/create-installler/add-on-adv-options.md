---
path: "/docs/create-installer/add-on-adv-options"
date: "2019-10-15"
weight: 4
linktitle: "Advanced Options"
title: "Advanced Options"
---

Each add-on can have advanced options that will create a different installer.

```yaml
  apiVersion: "kurl.sh/v1beta1"
  kind: "Installer"
  metadata:
    name: ""
  spec:
    kubernetes:
      version: "latest"
      serviceCIDR: ""
    weave:
      version: "latest"
      IPAllocRange: ""
      encryptNetwork: false
    rook:
      version: "latest"
      storageClass: ""
      cephPoolReplicas: 4
    contour:
      version: "latest"
    docker:
      version: "latest"
      bypassStorageDriverWarnings: true
      hardFailOnLoopback: true
      noCEOnEE: true
    prometheus:
      version: "latest"
    registry:
      version: "latest"
    kotsadm:
      version: "1.6.0"
      applicationSlug: ""
      uiBindPort: ""
```
