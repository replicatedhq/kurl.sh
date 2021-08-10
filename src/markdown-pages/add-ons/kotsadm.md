---
path: "/docs/add-ons/kots"
date: "2020-04-23"
linktitle: "KOTS Add-On"
weight: 38
title: "KOTS Add-On"
addOn: "kotsadm"
---

The [KOTS add-on](https://kots.io/kotsadm/installing/installing-a-kots-app/) installs an admin console for managing KOTS apps.

This add-on requires an S3-Compatible object store be available in the cluster.
Both the Rook and the MinIO add-ons satisfy the object store requirement.

## Advanced Install Options

```yaml
spec:
  kotsadm: 
    version: "latest"
    applicationSlug: "slug"
    uiBindPort: 8800
    hostname: "hostname"
    applicationNamespace: "kots"
```

flags-table

## Airgap Example

For installing KOTS apps in airgap mode, the registry add-on must also be included.

```
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
spec:
  kubernetes:
    version: latest
  docker: 
    version: latest
  weave:
    version: latest
  rook:
    version: latest
  ekco:
    version: latest
  registry:
    version: latest
  kotsadm: 
    version: latest
```

## Online Example with MinIO

```
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
spec:
  kubernetes:
    version: latest
  docker: 
    version: latest
  weave:
    version: latest
  openebs:
    version: latest
    isLocalPVEnabled: true
    localPVStorageClassName: default
  minio:
    version: latest
  registry:
    version: latest
  kotsadm: 
    version: latest
```
