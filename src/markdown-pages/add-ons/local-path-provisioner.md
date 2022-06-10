---
path: "/docs/add-ons/local-path-provisioner"
date: "2022-06-08"
linktitle: "Local Path Provisioner Add-On (Beta)"
weight: 46
title: "Local Path Provisioner Add-On (Beta)"
addOn: "localPathProvisioner"
---

[Local Path Provisioner](https://github.com/rancher/local-path-provisioner/) is a minimal PVC provisioner that exposes node-local storage.

Local Path Provisioner uses the `/opt/local-path-provisioner` directory for storage on all nodes.
This directory should have enough space to hold a complete copy of every PersistentVolumeClaim that will be on a given node.
Every GB of storage used within a PVC will result in a GB of disk usage.
As volume capacity limits are not enforced, using a separate volume for this directory is recommended.

## Advanced Install Options

```yaml
spec:
  localPathProvisioner:
    version: 0.0.22
```

## Limitations
Because this project is not yet considered stable by [Rancher](https://github.com/rancher/local-path-provisioner), the upstream developer, it cannot be considered stable here.
Volume capacity limits are not enforced.
