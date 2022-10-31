---
path: "/docs/install-with-kurl/migrating-csi"
date: "2021-06-30"
weight: 23
linktitle: "Migrating CSI"
title: "Migrating to Change kURL CSI Add-Ons"
---

For kURL [v2022.10.28-0](https://kurl.sh/release-notes/v2022.10.28-0) and later, there is a suported data migration path from the Rook CSI add-on to either OpenEBS with Local PV, or Longhorn and MinIO as the new storage provider. 

For information about how to migrate from Rook to a storage provider other than OpenEBS or Longhorn/MinIO, see [Migrating](/docs/install-with-kurl/migrating).

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

You can then automatically migrate data _from_ Rook _to_ OpenEBS with Local PV using the following kURL spec. This requires OpenEBS 3.3.0 or newer. 

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

_Or_, you can then migrate data _from_ Rook _to_ Minio and Longhorn using the following kURL spec:

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

kURL does the following when you use the specs above to migrate data from Rook:

* Recreates all PVCs that were originally created using Rook onto OpenEBS or Longhorn with the same name and contents. 
* Copies all data within the Rook object store to MinIO, if using MinIO. 
* If you are migrating off of Rook from a Kubernetes cluster that has more than two nodes, OpenEBS attempts to create local volumes on the same nodes where the original Rook PVCs were referenced.
* Uninstalls Rook from the cluster.
