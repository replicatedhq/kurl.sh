---
path: "/docs/add-ons/minio"
date: "2021-01-28"
linktitle: "Minio Add-On"
weight: 40
title: "Minio Add-On"
addOn: "minio"
---
MinIO is an S3-compatible object storage server.
It runs as a single replica Deployment backed by a PVC.
A secret named `minio-credentials` will also be created in the same namespace with the access key and secret key for using the server.

## Advanced Install Options

```yaml
spec:
  minio:
    version: "latest"
    namespace: "minio"
    hostPath: /mnt/nfs_share
```

flags-table
