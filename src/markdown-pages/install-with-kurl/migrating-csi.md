---
path: "/docs/install-with-kurl/migrating-csi"
date: "2021-06-30"
weight: 23
linktitle: "Migrating CSI"
title: "Migrating to Change kURL CSI Add-Ons"
---

As of kURL [v2021.07.30-0](https://kurl.sh/release-notes/v2021.07.30-0), MinIO and Longhorn support migrating data from Rook.
If you need to migrate to a different storage provider than Longhorn, check out [Migrating](/docs/install-with-kurl/migrating)

When initially installing the following kURL spec:

```
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: old
spec:
  kubernetes:
    version: 1.19.12
  docker:
    version: 20.10.5
  weave:
    version: 2.6.5
  rook:
    version: 1.0.4
```

and then upgrading to:

```
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: new
spec:
  kubernetes:
    version: 1.19.12
  docker:
    version: 20.10.5
  weave:
    version: 2.6.5
  longhorn:
    version: 1.1.2
  minio:
    version: 2020-01-25T02-50-51Z
```

All PVCs created using Rook will be recreated (with the same name and contents) on Longhorn, all data within the Rook object store will be copied to MinIO, and Rook will be uninstalled from the cluster.
