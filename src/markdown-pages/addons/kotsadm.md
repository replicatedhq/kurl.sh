---
path: "/docs/add-ons/kotsadm"
date: "2020-04-23"
linktitle: "Kotsadm Add-On"
weight: 25
title: "Kotsadm Add-On"
---

The [kotsadm add-on](https://kots.io/kotsadm/installing/installing-a-kots-app/) installs an admin console for managing KOTS apps.

This add-on requires an S3-Compatible object store be available in the cluster.
Both the rook and the minio add-ons satisfy the object store requirement.

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

| Flag                  | Usage                                                                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| applicationSlug       | The slug shown on the app settings page of vendor web.                                                                                                                 |
| uiBindPort            | This is the port where the kots admin panel can be interacted with via browser.                                                                                        |
| hostname              | The hostname that the admin console will be exposed on.                                                                                                                |
| applicationNamespaces | An additional namespace that should be pre-created during the install (For applications that install to other namespaces outside of the one where kotsadm is running). |

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
  registry:
    version: latest
  kotsadm: 
    version: latest
```

## Online Example with Minio

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
