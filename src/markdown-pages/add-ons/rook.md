---
path: "/docs/add-ons/rook"
date: "2020-04-01"
linktitle: "Rook Add-On"
weight: 44
title: "Rook Add-On"
addOn: "rook"
---

The [Rook](https://rook.io/) add-on creates and manages a Ceph cluster along with a storage class for provisioning PVCs.
It also runs the Ceph RGW object store to provide an S3-compatible store in the cluster.

By default the cluster uses the filesystem for storage. Each node in the cluster will have a single OSD backed by a directory in `/opt/replicated/rook`. Nodes with a Ceph Monitor also utilize `/var/lib/rook`.

**Note**: At minimum, 10GB of disk space should be available to `/var/lib/rook` for the Ceph Monitors and other configs. We recommend a separate partition to prevent a disruption in Ceph's operation as a result of `/var` or the root partition running out of space.

**Note**: All disks used for storage in the cluster should be of similar size. A cluster with large discrepancies in disk size may fail to replicate data to all available nodes.

The [EKCO](/docs/add-ons/ekco) add-on is recommended when installing Rook. EKCO is responsible for performing various operations to maintain the health of a Ceph cluster.

## Advanced Install Options

```yaml
spec:
  rook:
    version: latest
    blockDeviceFilter: sd[b-z]
    cephReplicaCount: 3
    isBlockStorageEnabled: true
    storageClassName: "storage"
    hostpathRequiresPrivileged: false
    bypassUpgradeWarning: false
```

flags-table

## Block Storage

For production clusters, Rook should be configured to use block devices rather than the filesystem.
Enabling block storage is required with version 1.4.3+.
The following spec enables block storage for the Rook add-on and automatically uses disks matching the regex `/sd[b-z]/`.
Rook will start an OSD for each discovered disk, which could result in multiple OSDs running on a single node.
Rook will ignore block devices that already have a filesystem on them.

```yaml
spec:
  rook:
    version: latest
    isBlockStorageEnabled: true
    blockDeviceFilter: sd[b-z]
```

The Rook add-on will wait for a disk before continuing.
If you have attached a disk to your node but the installer is still waiting at the Rook add-on installation step, refer to the [troubleshooting guide](https://rook.io/docs/rook/v1.0/ceph-common-issues.html#osd-pods-are-not-created-on-my-devices) for help with diagnosing and fixing common issues.

## Shared Filesystem

The [Ceph filesystem](https://rook.io/docs/rook/v1.4/ceph-filesystem.html) is supported with version 1.4.3+.
This allows the use of PersistentVolumeClaims with access mode `ReadWriteMany`.
Set the storage class to `rook-cephfs` in the pvc spec to use this feature.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cephfs-pvc
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
  storageClassName: rook-cephfs
```
