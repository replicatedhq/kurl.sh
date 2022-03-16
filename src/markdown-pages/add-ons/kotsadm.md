---
path: "/docs/add-ons/kotsadm"
date: "2020-04-23"
linktitle: "KOTS Add-On"
weight: 42
title: "KOTS Add-On"
addOn: "kotsadm"
---

The [KOTS add-on](https://docs.replicated.com/enterprise/installing-overview) installs an admin console for managing KOTS apps.

By default, this add-on requires an S3-compatible object store be available in the cluster.
Both the Rook and the MinIO add-ons satisfy the object store requirement.
To deploy KOTS without an object store, set the `disableS3` flag in the installer to `true`. 
This will install KOTS as a StatefulSet using a persistent volume (PV) for storage.

## Advanced Install Options

```yaml
spec:
  kotsadm: 
    version: "latest"
    applicationSlug: "slug"
    uiBindPort: 8800
    hostname: "hostname"
    applicationNamespace: "kots"
    disableS3: true
```

flags-table

## Effects of the `disableS3` Flag

Object storage is used by the KOTS add-on in the following ways:
1. Directly, as a way for the admin console to store support bundles and previous versions of your application.
1. Directly, when hostpath or NFS snapshot storage locations are set in the admin console. The admin console will dynamically create a MinIO instance and attach it to the specified source.
1. Indirectly, as part of the Registry add-on, to store container images in air gap deployments.
1. Indirectly, as part of the Velero add-on, to store snapshots in the cluster using the **Internal Storage** option.

When the `disableS3` flag is set to `true`, the admin console will switch to use a PV for all of the direct operations mentioned above. Necessary migrations will be performed.
It will also have the following effects outside of the KOTS add-on:
1. For new installs, the Registry add-on behavior will not change. It will use an object store if it is available, and otherwise it will use a PV. For upgrades or re-installs, a migration of the registry contents will only be performed from an object store to a PV if the object store is also removed from the installer spec.
1. For new installs, the Velero add-on will use a PV instead of object storage for storing snapshots to the **Internal Storage** location. For upgrades or re-installs, snapshots stored to the **Internal Storage** location will be migrated from the object store to a PV.

**Note:** The flag must be set to perform migrations.

## Airgap Example

For installing KOTS apps in airgap mode, the registry add-on must also be included.

```
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
spec:
  kubernetes:
    version: latest
  containerd: 
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
  containerd: 
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

## Example without Object Storage

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
  longhorn:
    version: latest
  registry:
    version: latest
  kotsadm: 
    version: latest
    disableS3: true
```
