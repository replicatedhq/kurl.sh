---
path: "/docs/add-ons/longhorn"
date: "2021-03-12"
linktitle: "Longhorn"
weight: 46
title: "Longhorn Add-On"
addOn: "longhorn"
isDeprecated: true
---

## Deprecation Notice

### This add-on is deprecated.

As of March 27, 2023, the Longhorn add-on is deprecated. The Longhorn add-on might be removed from kURL after September 31st, 2023. Existing installations that use the Longhorn add-on are supported during this deprecation window. We recommend that you migrate from the Longhorn add-on to either the [OpenEBS](https://kurl.sh/docs/add-ons/openebs) or [Rook](https://kurl.sh/docs/add-ons/rook) add-on on or before September 31st, 2023. For more information about migrating from Longhorn, see [Migrating to Change CSI Add-On](https://kurl.sh/docs/install-with-kurl/migrating-csi).


## Summary

[Longhorn](https://longhorn.io/) is a CNCF Sandbox Project originally developed by Rancher labs as a “lightweight, reliable and easy-to-use distributed block storage system for Kubernetes”. Longhorn uses a microservice-based architecture to create a pod for every Custom Resource in the Longhorn ecosystem: Volumes, Replicas, a control plane, a data plane, etc.

Longhorn uses the `/var/lib/longhorn` directory for storage on all nodes. For disk requirements, see [Add-on Directory Disk Space Requirements](/docs/install-with-kurl/system-requirements/#add-on-directory-disk-space-requirements).

For production installs, an SSD should be mounted at `/var/lib/longhorn`.

## Host Package Requirements

The following host packages are required for Red Hat Enterprise Linux 9 and Rocky Linux 9:

- iscsi-initiator-utils
- nfs-utils

## Advanced Install Options

```yaml
spec:
  longhorn:
    storageOverProvisioningPercentage: 200
    uiBindPort: 30880
    uiReplicaCount: 0
    version: latest
```

flags-table

## Longhorn UI

The Longhorn UI deployment does not run by default because it is an unauthenticated application.
It can be enabled by setting the replica count to `1` in the longhorn spec.
This will make the UI available on port `30880` on all nodes in the cluster.

```yaml
spec:
  longhorn:
    version: latest
    uiReplicaCount: 1
```

To enable the UI without re-running the installer, use the command `kubectl -n longhorn-system scale deployment longhorn-ui --replicas=1`.

## Upgrades

It is not possible to upgrade multiple minor versions of the Longhorn add-on at once.
Individual upgrades from one version to the next are required for upgrading multiple minor versions.
For example, to upgrade from `1.1.2` to `1.3.1`, you must first install `1.2.2` or `1.2.4`.

## Migration from Rook

If Rook was previously installed but is no longer specified in the kURL spec and Longhorn 1.1.2+ is specified instead, Longhorn will migrate data from Rook PVCs to Longhorn.
This will involve stopping all pods mounting Rook PVCs while the migration takes place.

If MinIO is also specified in the new kURL spec and completes its migration process successfully, Rook will be removed to free up resources.
