---
path: "/docs/install-with-kurl/migrating-csi"
date: "2021-06-30"
weight: 23
linktitle: "Migrating CSI"
title: "Migrating to Change kURL CSI Add-Ons"
---

As of kURL [v2022.10.28-0](https://kurl.sh/release-notes/v2022.10.28-0), MinIO, Longhorn and OpenEBS support migrating data from Rook.
If you need to migrate to a different storage provider than the aforementioned ones, check out [Migrating](/docs/install-with-kurl/migrating)

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

You can then migrate _from_ Rook _to_ Minio and/or Longhorn using the following kURL spec:

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

OpenEBS 3.3.0 and later automatically migrates data from Rook:

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
  openebs:
    version: 3.3.0
    isLocalPVEnabled: true
```

All PVCs created using Rook will be recreated (with the same name and contents) on Longhorn and OpenEBS, all data within the Rook object store will be copied to MinIO, and Rook will be uninstalled from the cluster.
Moreover, if migrating Rook from a Kubernetes cluster that is highly available (more than two
nodes), OpenEBS will attempt to create local volumes on the same nodes where the original Rook PVCs
were referenced from.
