---
path: "/docs/install-with-kurl/removing-object-storage"
date: "2021-12-17"
weight: 24
linktitle: "Removing Object Storage"
title: "Removing Object Storage Dependencies"
---

As of [v2021.12.20-0](https://kurl.sh/release-notes/v2021.12.20-0), kURL clusters can be installed without add-ons having a peer dependency on object storage.
There is also a migration path for clusters to remove object storage. This eliminates the need for either the Rook or MinIO add-ons.

> **Important**: Velero 1.17.0 and later uses the Kopia uploader and no longer supports the persistent-volume-backed snapshot destinations (**Internal Storage**, **Host Path**, and **Network File System (NFS)**) offered in the Admin Console. On Velero 1.17 and later, Velero backups require an S3-compatible object store, either in-cluster (the MinIO or Rook add-ons) or external. Removing object storage from a cluster that runs Velero 1.17 or later is not supported. Clusters currently using one of these destinations must move Velero back onto an object store to upgrade; see [Upgrading to Velero 1.17 or Later](/docs/install-with-kurl/removing-object-storage#upgrading-to-velero-1-17-or-later).

# New Installations

The following add-ons can be installed with or without object storage:
1. **Registry**: Without an object store in the installer spec, a persistent volume (PV) will be used for storage. So if the Rook or MinIO add-on is installed, the Registry will always be backed by that object store.
1. **Velero**:
   - On Velero versions earlier than 1.17, without object storage in the spec no default BackupStorageLocation is created. If the `disableS3` flag is set to `true` for the KOTS add-on and a ReadWriteMany storage class (Rook CephFS or Longhorn) is available, a PV-backed storage location will be created as the default location using the [Local-Volume-Provider](https://github.com/replicatedhq/local-volume-provider) plugin. If no ReadWriteMany storage class is available, the install completes without a default backup location and KOTS configures Host Path or NFS snapshots after the install completes.
   - On Velero 1.17 and later, the Local-Volume-Provider snapshot destinations are not supported. Installing or upgrading with `kotsadm.disableS3: true` stops the installation with an error. Add the MinIO or Rook add-on, configure an external S3-compatible object store, or use a Velero version earlier than 1.17.
1. **KOTS**: If the `kotsadm.disableS3` flag is set to `true` in the installer, KOTS will be deployed without an object store. This will deploy KOTS as a StatefulSet using a persistent volume (PV) for storage. It will also disable the use of MinIO for hostpath and NFS snapshot storage destinations.

This installer spec is an example of deploying a new cluster without using any object storage.
```yaml
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: no-object-storage
spec:
  kubernetes:
    version: 1.33.x
  containerd:
    version: 1.7.x
  flannel:
    version: 0.20.x
  openebs:
    version: 4.4.x
    isLocalPVEnabled: true
    localPVStorageClassName: local
  registry:
    version: 2.8.x
  velero:
    version: 1.16.x
  kotsadm:
    version: 1.131.x
    disableS3: true
```

# Cluster Migrations

The migration path to remove object storage dependencies and components involves two steps.

## Setting `disableS3` to `true` in the KOTS Add-On

Object storage can be removed from some of the add-ons in the cluster by simply setting the `kotsadm.disableS3` flag in the KOTS addon to `true`.
See the documentation in the [KOTS add-on](/docs/add-ons/kotsadm) for more information on the `disableS3` flag.

When you re-install or upgrade using the updated installer spec (see the [New Installations](/docs/install-with-kurl/removing-object-storage#new-installations) section for a sample), you should expect:
1. **Registry**: The deployment will not change; the registry will continue to use object storage if object storage is still present in the installer spec. To use a PV instead, see [Removing the Existing Provider](/docs/install-with-kurl/removing-object-storage#removing-the-existing-provider). If object storage isn't present in the spec anymore, the `disableS3` flag will trigger a migration from the object store into the PV.
1. **Velero** (Velero earlier than 1.17 only): The `default` storage location will be updated to point to an attached persistent volume using the [Local-Volume-Provider](https://github.com/replicatedhq/local-volume-provider) plugin. A migration will be triggered to copy from the object store into the attached PV. On Velero 1.17 and later this is not supported; see [Upgrading to Velero 1.17 or Later](/docs/install-with-kurl/removing-object-storage#upgrading-to-velero-1-17-or-later).
1. **KOTS**: The KOTS deployment will be scaled down, deleted, and re-deployed as a StatefulSet using a persistent volume (PV) for storage. The use of MinIO for hostpath and NFS snapshot storage destinations will also be disabled. A migration will be triggered to copy from the object store into the attached PV.

## Removing the Existing Provider

To fully remove object storage from the cluster, the current provider must be removed from your installer spec.
In the case of MinIO, it is a straightforward removal of the add-on.
For clusters using the Rook add-on, another CSI such as OpenEBS is required for storage.
Data can be migrated to OpenEBS automatically using existing [CSI Migrations](/docs/install-with-kurl/migrating-csi). 

When you re-install or upgrade using the new updated spec (see the [New Installations](/docs/install-with-kurl/removing-object-storage#new-installations) section for a sample), you should expect:
1. **Registry**: A persistent volume (PV) will be added for storage. In order to trigger a migration from object storage into the attached PV, see [Setting `disableS3` to `true` in the KOTS Add-On](/docs/install-with-kurl/removing-object-storage#setting-disables3-to-true-in-the-kots-add-on).
1. **Velero** (Velero earlier than 1.17 only): Removing object storage from the spec will remove the default **Internal Storage** destination. If you want a PV-backed default storage location instead of not default, see [Setting `disableS3` to `true` in the KOTS Add-On](/docs/install-with-kurl/removing-object-storage#setting-disables3-to-true-in-the-kots-add-on). On Velero 1.17 and later, removing object storage is not supported and the upgrade stops with an error.
1. **KOTS**: KOTS will not deploy successfully if object storage is removed from the installer, unless the `disableS3` flag is set to `true`. For more information on that, see [Setting `disableS3` to `true` in the KOTS Add-On](/docs/install-with-kurl/removing-object-storage#setting-disables3-to-true-in-the-kots-add-on).

## Upgrading to Velero 1.17 or Later

Velero 1.17.0 replaced the restic uploader with Kopia. Kopia cannot read existing restic repositories and does not support the [Local-Volume-Provider](https://github.com/replicatedhq/local-volume-provider) snapshot destinations (**Internal Storage**, **Host Path**, and **Network File System (NFS)**), so a cluster using one of those destinations must move Velero back onto an object store to upgrade.

When you upgrade a cluster that is using an Internal Storage, Host Path, or NFS snapshot destination to Velero 1.17 or later:

- If an in-cluster object store (the MinIO add-on, or a healthy Rook Ceph RGW) is running in the cluster and the kotsadm version in the installer spec is 1.131.6 or later, the installer migrates Velero to the in-cluster object store automatically and then creates an `aws` BackupStorageLocation backed by it. kotsadm 1.131.6 or later is required because older versions of KOTS re-configure Velero back onto the Local Volume Provider even when an object store is present.
- If no in-cluster object store is running, the upgrade stops before making any changes to Velero and prints the snapshot destination in use along with the available options: add the MinIO or Rook add-on to the installer, configure an external S3-compatible object store, or keep Velero at a version earlier than 1.17.
- If the kotsadm version in the installer spec is older than 1.131.6, the upgrade stops before making any changes to Velero and directs you to re-run the installer with kotsadm 1.131.6 or later, or keep Velero at a version earlier than 1.17.

The automated migration is a configuration cutover, not a data migration:

- **Snapshots taken before the upgrade will not be restorable afterwards.** Velero 1.17 and later uses Kopia, which cannot read the existing restic repositories.
- The existing snapshot data is not deleted. The underlying persistent volume's reclaim policy is patched to `Retain` so the data remains on disk, and for Host Path and NFS destinations the data remains at its configured location.
- The YAML of the previous BackupStorageLocation, PVC, and PV is saved on the primary node under `/var/lib/kurl/kustomize/velero/lvp-migration-backup/` in case manual recovery is needed.

The migration prompts for confirmation before making any changes, so take a fresh backup to an external location first if you need the pre-upgrade snapshots. The prompt can be bypassed by running the installer with the `yes` flag; non-interactive runs decline automatically before any change is made. Every step of the migration is idempotent, so a failed run can simply be re-run.

For more information, see the [Velero 1.16 to 1.17 upgrade guide](https://community.replicated.com/t/upgrade-guide-velero-1-16-to-1-17-on-kurl-kots-with-lvp-snapshots/1647) in the Replicated community.
