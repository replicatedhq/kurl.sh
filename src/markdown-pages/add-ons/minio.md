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
    migrateFromRGW: true
```

flags-table

## Migrate from Rook/Ceph RGW bject Store

There are two options for replacing the RGW object store included with the Rook add-on with Minio.
The first option is to enable automatic migrations in the kURL spec with the `migrateFromRGW` flag, as shown above.
The second option is to use the `migrate-rgw-to-minio` task:

```
curl -L https://k8s.kurl.sh/latest/tasks.sh | sudo bash -s migrate-rgw-to-minio
```

Or for airgap installs:

```
cat tasks.sh | sudo bash -s migrate-rgw-to-minio
```
