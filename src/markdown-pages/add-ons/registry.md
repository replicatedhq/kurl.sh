---
path: "/docs/add-ons/registry"
date: "2020-05-13"
linktitle: "Registry Add-On"
weight: 50
title: "Registry Add-On"
addOn: "registry"
---

[Docker registry](https://github.com/docker/distribution) is an OCI compatible image registry.
This add-on deploys it to the `kurl` namespace.

## Advanced Install Options

```yaml
spec:
  registry:
    version: "2.7.1"
    publishPort: 5000
```

flags-table

## Registry Storage Backends 

When installed as part of a kURL spec that contains an object store (e.g., Rook or MinIO), the Registry add-on will use that API as a storage backend.
If an object store is not available, a persistent volume (PV) will be used as the storage backend.
Migrations are performed on upgrade/re-install from an object store to a PV if both of the following are true:
1. The object store (e.g., Rook or MinIO) is completely removed from the installer spec.
1. The `kotsadm.disableS3` flag is set to `true` in the installer spec.

For object store backends, 2 replicas of the registry service are deployed by default.

For PVC backends, 1 replica will be used with a `ReadWriteOnce` PVC. 
