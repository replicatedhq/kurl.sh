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

Rook versions 1.4.3 and later require a dedicated block device attached to each node in the cluster.
The block device must be unformatted and dedicated for use by Rook only.
The device cannot be used for other purposes, such as being part of a Raid configuration.
If the device is used for purposes other than Rook, then the installer fails, indicating that it cannot find an available block device for Rook.

For Rook versions earlier than 1.4.3, a dedicated block device is recommended in production clusters.

For disk requirements, see [Add-on Directory Disk Space Requirements](/docs/install-with-kurl/system-requirements/#add-on-directory-disk-space-requirements).

You can enable and disable block storage for Rook versions earlier than 1.4.3 with the `isBlockStorageEnabled` field in the kURL spec.

When the `isBlockStorageEnabled` field is set to `true`, or when using Rook versions 1.4.3 and later, Rook starts an OSD for each discovered disk.
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

The Rook add-on waits for the dedicated disk that you attached to your node before continuing with installation.
If you attached a disk to your node, but the installer is waiting at the Rook add-on installation step, see [OSD pods are not created on my devices](https://rook.io/docs/rook/v1.0/ceph-common-issues.html#osd-pods-are-not-created-on-my-devices) in the Rook documentation for troubleshooting information.

## Filesystem Storage

By default, for Rook versions earlier than 1.4.3, the cluster uses the filesystem for Rook storage.
However, block storage is recommended for Rook in production clusters.
For more information, see [Block Storage](#block-storage) above.

When using the filesystem for storage, each node in the cluster has a single OSD backed by a directory in `/opt/replicated/rook`.
Nodes with a Ceph Monitor also use `/var/lib/rook`.

Sufficient disk space must be available to `/var/lib/rook` for the Ceph Monitors and other configs. For disk requirements, see [Add-on Directory Disk Space Requirements](/docs/install-with-kurl/system-requirements/#add-on-directory-disk-space-requirements). 

We recommend a separate partition to prevent a disruption in Ceph's operation as a result of `/var` or the root partition running out of space.

**Note**: All disks used for storage in the cluster should be of similar size.
A cluster with large discrepancies in disk size may fail to replicate data to all available nodes.

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

## System Requirements

The following additional ports must be open between nodes for multi-node clusters:

| Protocol | Direction | Port Range | Purpose                 | Used By |
| -------  | --------- | ---------- | ----------------------- | ------- |
| TCP      | Inbound   | 9090       | CSI RBD Plugin Metrics  | All     |

## Upgrades

It is now possible to upgrade multiple minor versions of the Rook add-on at once.
This upgrade process will step through minor versions one at a time.
For example, upgrades from Rook 1.0.x to 1.5.x will step through Rook versions 1.1.9, 1.2.7, 1.3.11 and 1.4.9 before installing 1.5.x.
Upgrades without internet access may prompt the end-user to download supplemental packages.

Alternatively, a Rook upgrade can be triggered independently using the `rook-upgrade` task.
This task requires the argument `to-version=[major]-[minor]`.

For example:
```bash
curl https://k8s.kurl.sh/latest/tasks.sh | sudo bash -s rook-upgrade to-version=1.10
```

Rook upgrades from 1.0.x migrate data off of any hostpath-based OSDs in favor of block device-based OSDs.
The upstream Rook project introduced a requirement for block storage in versions 1.3.x and later.

## Monitor Rook Ceph

For Rook version 1.9.12 and later, when you install with both the Rook add-on and the Prometheus add-on, kURL enables Ceph metrics collection and creates a Ceph cluster statistics Grafana dashboard.

The Ceph cluster statistics dashboard in Grafana displays metrics that help you monitor the health of the Rook Ceph cluster, including the status of the Ceph object storage daemons (OSDs), the available cluster capacity, the OSD commit and apply latency, and more.

The following shows an example of the Ceph cluster dashboard in Grafana:

![Graphs and metrics on the Ceph Grafana dashboard](/ceph-grafana-dashboard.png)

To access the Ceph cluster dashboard, log in to Grafana in the `monitoring` namespace of the kURL cluster using your Grafana admin credentials.

For more information about installing with the Prometheus add-on and updating the Grafana credentials, see [Prometheus Add-on](/docs/add-ons/prometheus).
