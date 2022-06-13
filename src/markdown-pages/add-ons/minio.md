---
path: "/docs/add-ons/minio"
date: "2021-01-28"
linktitle: "MinIO"
weight: 48
title: "MinIO Add-On"
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

## Migration from Rook

If Rook was previously installed but is no longer specified in the kURL spec and MinIO is specified instead, MinIO will migrate data from Rook's object store to MinIO.

If Longhorn is also specified in the new kURL spec and completes its migration process successfully, Rook will be removed to free up resources.
