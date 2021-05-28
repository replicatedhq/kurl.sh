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
