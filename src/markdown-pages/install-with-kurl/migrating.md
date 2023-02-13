---
path: "/docs/install-with-kurl/migrating"
date: "2021-06-30"
weight: 22
linktitle: "Migrating"
title: "Migrating to Change kURL Add-Ons"
---

Changing the CRI, CSI, or CNI provider on a kURL install is possible by migrating a [KOTS](https://kots.io/) application to a new cluster.

If you're looking to make the move from one CSI provisioner (Longhorn, OpenEBS, or Rook) to another, be sure to consult the [Migrating CSI](/docs/install-with-kurl/migrating-csi) page.

## Requirements

* The KOTS application must be configured to support [full snapshots](https://kots.io/kotsadm/snapshots/overview/#full-snapshots-recommended).
* Velero must be configured to use an external snapshot destination accessible to both the old and new clusters, such as S3.
* Both the old and new clusters must have the same airgap status. Migrating from airgap to online clusters or vice versa is not supported.
* The velero add-on version must be at least 1.5.1.
* The KOTS add-on version must be at least 1.45.0 in order for the KOTS Admin Console certificate to be migrated.
* If the application makes direct use of an object store add-on such as Rook or MinIO, it must use [backup](https://velero.io/docs/v1.6/backup-hooks/) and [restore](https://velero.io/docs/v1.6/restore-hooks/) hooks to migrate buckets with required data from the old to the new cluster. Only the kotsadm and docker-registry buckets will be migrated automatically. [See here for an example of how the registry add-on uses hooks to migrate its bucket](https://github.com/replicatedhq/kURL/blob/v2021.06.30-0/addons/registry/2.7.1/tmpl-configmap-velero.yaml).
* For airgapped installs, both the old and new clusters must have the same versions of the KOTS and registry add-ons.

## Non-Requirements

* Old and new clusters do not need to have the same number of nodes.
* Old and new clusters do not need to have the same HA status.
* Old and new clusters do not need the same versions of add-ons except as noted above.
* Old and new clusters do not need to be on the same operating system.
* Old and new clusters do not need to use the same proxy settings. The proxy settings from the new cluster will be applied to KOTS when it is restored. Any application pods that use [proxy template functions](https://kots.io/reference/template-functions/static-context/#httpproxy) will need to be redeployed after restore.

## Procedure

1. Use [KOTS Snapshots](https://kots.io/kotsadm/snapshots/overview/) to take a full snapshot on the old cluster with an external object store provider, such as S3.
1. [Install a new cluster](https://kurl.sh/docs/install-with-kurl/) with a new spec.
1. On the new cluster, use the KOTS CLI to [configure Velero](https://kots.io/kots-cli/velero/) to use the same snapshot destination as the old cluster.
1. Wait until the `velero backup get` command on the new cluster shows the backup taken on the old cluster.
1. Run `kubectl kots restore --from-backup instance-<name>` on the new cluster.

## Example Old and New Specs

In the new spec, the Kubernetes version has been upgraded to 1.21, Longhorn has been replaced with OpenEBS, Weave has been replaced with Flannel, and docker has been replaced with containerd.

### Old

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
  longhorn:
    version: 1.3.1
  minio:
    version: 2020-01-25T02-50-51Z
  registry:
    version: 2.7.1
  kotsadm:
    version: 1.45.0
  velero:
    version: 1.6.1
```

### New

```
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: new
spec:
  kubernetes:
    version: 1.21.14
  containerd:
    version: 1.6.15
  flannel:
    version: 0.20.2
  minio:
    version: 2023-01-25T00-19-54Z
  openebs:
    version: 3.3.0
    isLocalPVEnabled: true
    localPVStorageClassName: default
  registry:
    version: 2.8.1
  kotsadm:
    version: 1.93.0
  velero:
    version: 1.9.5
```
