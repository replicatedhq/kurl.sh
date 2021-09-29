---
path: "/docs/add-ons/registry"
date: "2020-05-13"
linktitle: "Registry Add-On"
weight: 43
title: "Registry Add-On"
addOn: "registry"
---

[Docker registry](https://github.com/docker/distribution) is an OCI compatible image registry.
This add-on deploys it to the `kurl` namespace.
By default, two pod replicas are deployed.

## Advanced Install Options

```yaml
spec:
  registry:
    version: "2.7.1"
    publishPort: 5000
```

flags-table

## Registry Storage Backends 

When installed as part of a kURL spec that contains an object store (e.g. Rook or Minio), the Registry addon will use that API as a storage backend.
If an object store is not available, a Persistent Volume Claim (PVC) will be used as the storage backend.
Once an object storage backend is selected, future kURL upgrades will not modify this selection.
There is currently no migration path between storage backends.
