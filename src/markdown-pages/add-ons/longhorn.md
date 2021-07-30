---
path: "/docs/add-ons/longhorn"
date: "2021-03-12"
linktitle: "Longhorn Add-On"
weight: 44
title: "Longhorn Add-On"
addOn: "longhorn"
---

[Longhorn](https://longhorn.io/) is a CNCF Sandbox Project originally developed by Rancher labs as a “lightweight, reliable and easy-to-use distributed block storage system for Kubernetes”. Longhorn uses a microservice-based architecture to create a pod for every Custom Resource in the Longhorn ecosystem: Volumes, Replicas, a control plane, a data plane, etc.

Longhorn uses the `/var/lib/longhorn` directory for storage on all nodes.
This directory should have enough space to hold a complete copy of every PersistentVolumeClaim that will be in the cluster.
For production installs, an SSD should be mounted at `/var/lib/longhorn`.

## Advanced Install Options

```yaml
spec:
  longhorn:
    version: latest
    uiBindPort: 30880
    uiReplicaCount: 0
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

## Migration from Rook

If Rook was previously installed but no longer specified in the kURL spec, Longhorn 1.1.2+ will migrate data from Rook PVCs to Longhorn.
This will involve stopping all pods mounting Rook PVCs while the migration takes place.

If Minio is also installed and completes its migration process, Rook will be removed to free up resources.
