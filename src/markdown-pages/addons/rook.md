---
path: "/docs/add-ons/rook"
date: "2020-04-01"
linktitle: "Rook Add-On"
weight: 25
title: "Rook Add-On"
---

The [Rook](https://rook.io/) add-on creates and manages a Ceph cluster along with a storage class for provisioning PVCs.
It also runs the Ceph RGW object store to provide an S3-compatible store in the cluster.

By default the cluster uses the filesystem for storage. Each node in the cluster will have a single OSD backed by a directory in `/opt/replicated/rook`.

## Advanced Install Options

```yaml
spec:
  rook:
    version: latest
    blockDeviceFilter: sd[b-z]
    cephReplicaCount: 24
    isBlockStorageEnabled: true
    storageClassName: "storage"
```

| Flag                    | Usage                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| storageClassName        | The name of the StorageClass that will use Rook to provision PVCs.                                                |
| cephReplicaCount        | Replication factor of ceph pools. The default is to use the number of nodes in the cluster, up to a maximum of 3. |
| isBlockStorageEnabled   | Use block devices instead of the filesystem for storage in the Ceph cluster.                                      |
| blockDeviceFilter       | Only use block devices matching this regex.                                                                       |

## Block Storage

For production clusters, Rook should be configured to use block devices rather than the filesystem.
The following spec enables block storage for the Rook add-on and automatically uses disks matching the regex `/sd[b-z]/`.
Rook will start an OSD for each discovered disk, which could result in multiple OSDs running on a single node.

```yaml
spec:
  rook:
    version: latest
    isBlockStorageEnabled: true
    blockDeviceFilter: sd[b-z]
```

The Rook add-on will wait for a disk before continuing.
If you have attached a disk to your node but the installer is still waiting at the Rook add-on installation step, refer to the [troubleshooting guide](https://rook.io/docs/rook/v1.0/ceph-common-issues.html#osd-pods-are-not-created-on-my-devices) for help with diagnosing and fixing common issues.
