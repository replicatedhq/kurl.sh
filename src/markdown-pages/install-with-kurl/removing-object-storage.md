---
path: "/docs/install-with-kurl/removing-object-storage"
date: "2021-12-17"
weight: 23
linktitle: "Removing Object Storage"
title: "Removing Object Storage Dependencies"
---

As of [v2021.12.20-0](https://kurl.sh/release-notes/v2021.12.20-0), kURL clusters can be installed without add-ons having a peer dependency on object storage.
There is also a migration path for clusters to remove object storage. This eliminates the need for either the Rook or MinIO add-ons.

# New Installations

The following add-ons can now be installed with or without object storage:
1. **Registry**: Without an object store in the installer spec, a persistent volume (PV) will be used for storage. So if the Rook or MinIO add-on is installed, the Registry will always be backed by that object store.
1. **Velero**: Without object storage in the spec, no default BackupStorageLocation will be created. If the `disableS3` flag is set to `true` for the KOTS add-on, a PV-backed storage location will be created as the default location using the [Local-Volume-Provider](https://github.com/replicatedhq/local-volume-provider) plugin.
1. **KOTS**: If the `kotsadm.disableS3` flag is set to `true` in the installer, KOTS will be deployed without an object store. This will deploy KOTS as a StatefulSet using a persistent volume (PV) for storage. It will also disable the use of MinIO for hostpath and NFS snapshot storage destinations.

This installer spec is an example of deploying a new cluster without using any object storage.
```yaml
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: no-object-storage
spec:
  kubernetes:
    version: 1.21.x
  containerd:
    version: 1.4.x
  weave:
    version: 2.6.5
  longhorn:
    version: 1.2.x
  registry:
    version: 2.5.7
  velero:
    version: 1.7.x
  kotsadm:
    version: 1.58.x
    disableS3: true
```

# Cluster Migrations

The migration path to remove object storage dependencies and components involves two steps.

## Setting `disableS3` to `true` in the KOTS Add-On

Object storage can be removed from some of the add-ons in the cluster by simply setting the `kotsadm.disableS3` flag in the KOTS addon to `true`.
See the documentation in the [KOTS add-on](/docs/add-ons/kotsadm) for more information on the `disableS3` flag.

When you re-install or upgrade using the updated installer spec (see the [New Installations](/docs/install-with-kurl/removing-object-storage#new-installations) section for a sample), you should expect:
1. **Registry**: The deployment will not change; the registry will continue to use object storage if object storage is still present in the installer spec. To use a PV instead, see [Removing the Existing Provider](/docs/install-with-kurl/removing-object-storage#removing-the-existing-provider). If object storage isn't present in the spec anymore, the `disableS3` flag will trigger a migration from the object store into the PV.
1. **Velero**: The `default` storage location will be updated to point to an attached persistent volume using the [Local-Volume-Provider](https://github.com/replicatedhq/local-volume-provider) plugin. A migration will be triggered to copy from the object store into the attached PV.
1. **KOTS**: The KOTS deployment will be scaled down, deleted, and re-deployed as a StatefulSet using a persistent volume (PV) for storage. The use of MinIO for hostpath and NFS snapshot storage destinations will also be disabled. A migration will be triggered to copy from the object store into the attached PV.

## Removing the Existing Provider

To fully remove object storage from the cluster, the current provider must be removed from your installer spec.
In the case of MinIO, it is a straightforward removal of the add-on.
For clusters using the Rook add-on, another CSI such as Longhorn or OpenEBS is required for storage.
Data can be migrated to Longhorn automatically using existing [CSI Migrations](/docs/install-with-kurl/migrating-csi). If you want to use another storage provider like OpenEBS, read about [migrating with snapshots](/docs/install-with-kurl/migrating).

When you re-install or upgrade using the new updated spec (see the [New Installations](/docs/install-with-kurl/removing-object-storage#new-installations) section for a sample), you should expect:
1. **Registry**: A persistent volume (PV) will be added for storage. In order to trigger a migration from object storage into the attached PV, see [Setting `disableS3` to `true` in the KOTS Add-On](/docs/install-with-kurl/removing-object-storage#setting-disables3-to-true-in-the-kots-add-on).
1. **Velero**: Removing object storage from the spec will remove the default **Internal Storage** destination. If you want a PV-backed default storage location instead of not default, see [Setting `disableS3` to `true` in the KOTS Add-On](/docs/install-with-kurl/removing-object-storage#setting-disables3-to-true-in-the-kots-add-on).
1. **KOTS**: KOTS will not deploy successfully if object storage is removed from the installer, unless the `disableS3` flag is set to `true`. For more information on that, see [Setting `disableS3` to `true` in the KOTS Add-On](/docs/install-with-kurl/removing-object-storage#setting-disables3-to-true-in-the-kots-add-on).
