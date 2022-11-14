---
path: "/docs/add-ons/rook"
date: "2020-04-01"
linktitle: "Rook"
weight: 53
title: "Rook Add-On"
addOn: "rook"
---

The [Rook](https://rook.io/) add-on creates and manages a Ceph cluster along with a storage class for provisioning PVCs.
It also runs the Ceph RGW object store to provide an S3-compatible store in the cluster.

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

For Rook versions 1.4.3 and later, block storage is required.
For Rook versions earlier than 1.4.3, block storage is recommended in production clusters.

You can enable and disable block storage for Rook with the `isBlockStorageEnabled` field in the kURL spec.
By default, the `isBlockStorageEnabled` field is set to `true` for Rook versions 1.4.3 and later.

When the `isBlockStorageEnabled` field is set to `true`, Rook starts an OSD for each discovered disk.
This can result in multiple OSDs running on a single node.
Rook ignores block devices that already have a filesystem on them.

The following provides an example of a kURL spec with block storage enabled for Rook:

```yaml
spec:
  rook:
    version: latest
    isBlockStorageEnabled: true
    blockDeviceFilter: sd[b-z]
```

In the example above, the `isBlockStorageEnabled` field is set to `true`.
Additionally, `blockDeviceFilter` instructs Rook to use only block devices that match the specified regex.
For more information about the available options, see [Advanced Install Options](#advanced-install-options) above.

The Rook add-on waits for a disk before continuing with installation. If you attached a disk to your node, but the installer is waiting at the Rook add-on installation step, see [OSD pods are not created on my devices](https://rook.io/docs/rook/v1.0/ceph-common-issues.html#osd-pods-are-not-created-on-my-devices) in the Rook documentation for troubleshooting information.

## Filesystem Storage

By default, for Rook versions earlier than 1.4.3, the cluster uses the filesystem for Rook storage.
However, block storage is recommended for Rook in production clusters. For more information, see [Block Storage](#block-storage) above.

When using the filesystem for storage, each node in the cluster has a single OSD backed by a directory in `/opt/replicated/rook`.
Nodes with a Ceph Monitor also use `/var/lib/rook`.

At minimum, 10GB of disk space must be available to `/var/lib/rook` for the Ceph Monitors and other configs.
We recommend a separate partition to prevent a disruption in Ceph's operation as a result of `/var` or the root partition running out of space.

**Note**: All disks used for storage in the cluster should be of similar size. A cluster with large discrepancies in disk size may fail to replicate data to all available nodes.

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

## Upgrades

It is not possible to upgrade multiple minor versions of the Rook add-on at once.
Individual upgrades from one version to the next are required for upgrading multiple minor versions.
For example, to upgrade from `1.4.3` to `1.6.11`, you must first install `1.5.10`, `1.5.11` or `1.5.12`.

If the currently installed Rook version is `1.0.x`, upgrades to both `1.4.9` and `1.5.x` are supported through the main installer.
Alternatively, the upgrade from `1.0.x` to `1.4.9` can be triggered independently with `curl https://k8s.kurl.sh/latest/tasks.sh | sudo bash -s rook_10_to_14`.
This upgrade migrates data off of any hostpath-based OSDs in favor of block device-based OSDs and upgrades through Rook `1.1.9`, `1.2.7` and `1.3.11` before installing `1.4.9` (and then optionally `1.5.x`).
The upstream Rook project introduced a requirement for block storage in versions 1.3.x and later.
In instances without internet access, this requires supplying an additional file when prompted.

## Monitor Rook Ceph

For Rook version 1.9.12 and later, when you install with both the Rook add-on and the Prometheus add-on, kURL enables Ceph metrics collection and creates a Ceph cluster statistics Grafana dashboard.

The Ceph cluster statistics dashboard in Grafana displays metrics that help you monitor the health of the Rook Ceph cluster, including the status of the Ceph object storage daemons (OSDs), the available cluster capacity, the OSD commit and apply latency, and more.

The following shows an example of the Ceph cluster dashboard in Grafana:

![Graphs and metrics on the Ceph Grafana dashboard](/ceph-grafana-dashboard.png)

To access the Ceph cluster dashboard, log in to Grafana in the `monitoring` namespace of the kURL cluster using your Grafana admin credentials.

For more information about installing with the Prometheus add-on and updating the Grafana credentials, see [Prometheus Add-on](/docs/add-ons/prometheus).
