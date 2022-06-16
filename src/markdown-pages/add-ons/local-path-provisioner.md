---
path: "/docs/add-ons/local-path-provisioner"
date: "2022-06-08"
linktitle: "Local Path Provisioner Add-On"
weight: 46
title: "Local Path Provisioner Add-On"
addOn: "localPathProvisioner"
isBeta: true
---

Local Path Provisioner is a minimal PersistentVolumeClaim (PVC) provisioner that uses the Kubernetes Local Persistent Volume feature to expose node-local storage. For more information, see [Local Path Provisioner](https://github.com/rancher/local-path-provisioner/) in the Rancher GitHub organization.

Local Path Provisioner uses the `/opt/local-path-provisioner` directory for storage on all nodes.
This directory must have enough space to hold a complete copy of each PVC on a given node.
To determine how much space is required on the directory, note that each GB of storage used in a PVC requires 1 GB of disk usage.
Because volume capacity limits are not enforced, using a separate volume for this directory is recommended.

## Advanced Install Options

```yaml
spec:
  localPathProvisioner:
    version: 0.0.22
```

## Limitations

The Local Path Provisioner add-on has the following limitations:

- The Local Path Provisioner add-on is Beta. Rancher, the upstream developer, does not consider the Local Path Provisioner project to be stable. For more information, see [Local Path Provisioner](https://github.com/rancher/local-path-provisioner/) in the Rancher GitHub organization.
- Volume capacity limits are not enforced.
- The Local Path Provisioner is incompatible with the [Velero add-on](/docs/add-ons/velero) as [Velero](https://github.com/vmware-tanzu/velero/discussions/3378) does not support hostPath volumes. 
