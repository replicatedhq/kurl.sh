---
path: "/docs/create-installer/choosing-a-pv-provisioner"
date: "2022-10-07"
weight: 21
linktitle: "Choosing a PV Provisioner"
title: "Choosing a PV Provisioner"
---

kURL offers both [OpenEBS Local PV](/docs/add-ons/openebs) and [Rook](/docs/add-ons/rook) for dynamic provisioning of PersistentVolumes in a Kubernetes cluster.
Each of these provisioners has benefits and limitations that should be considered depending on the size of the cluster and the characteristics of each workload consuming the volume.

[OpenEBS Local PV](/docs/add-ons/openebs) provides dynamic PV provisioning of [Kubernetes Local Volumes](https://kubernetes.io/docs/concepts/storage/volumes/#local).
A local volume implies that storage is available only from a single node.
As the local volume is accessible only from a single node, local volumes are subject to the availability of the underlying node, and are not suitable for all applications.
If a node becomes unhealthy, then the local volume will also become inaccessible, and a pod using it will not be able to run.
Applications using local volumes must be able to tolerate this reduced availability, as well as potential data loss, depending on the durability characteristics of the underlying disk.
For more information about the OpenEBS, see the [add-on documentation](/docs/add-ons/openebs).

```yaml
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
metadata:
  name: "local"
spec:
  ...
  openebs:
    version: "3.3.x"
    isLocalPVEnabled: true
    localPVStorageClassName: "local"
```

Conversely, [Rook](/docs/add-ons/rook) provides dynamic PV provisioning of distributed [Ceph](https://ceph.io/) storage.
Ceph is a self-healing and self-managing, distributed storage solution.
Rook volumes are accessible from any node in the cluster and are suitable for applications deployed to multi-node clusters that provide their own replication and fault tolerance (e.g. MongoDB or Cassandra), or ones where data loss is not catastrophic (e.g. a cache that can be rebuilt).
Drawbacks to the Rook provisioner include slower volume performance, higher disk utilization as data is replicated across the cluster, higher CPU and memory requirements, and a minimum cluster size of 3 nodes, as well as an additional dedicated block device attached to each node.
In addition to these drawbacks, Ceph adds additional complexity that should be avoided unless necessary for the application requirements.
For more information about Rook, see the [add-on documentation](/docs/add-ons/rook).

```yaml
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
metadata:
  name: "distributed"
spec:
  ...
  rook:
    version: "1.7.x"
    storageClassName: "distributed"
    isSharedFilesystemDisabled: true
```

In addition to providing block storage, Rook provides S3 compatible object storage.
The [MinIO add-on](/docs/add-ons/minio) is offered for applications that need object storage, but prefer to leverage OpenEBS Local PV.

```yaml
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
metadata:
  name: "openebs-with-minio"
spec:
  ...
  openebs:
    version: "3.3.x"
    isLocalPVEnabled: true
    localPVStorageClassName: "local"
  minio:
    version: "2022-09-07T22-25-02Z"
```

It is recommended to evaluate each individual workload's need for data persistence, and choose the provisioner that is most suitable.
In many cases it will be desirable to deploy both provisioners.
In this configuration, Rook will be the default storage provisioner for PersistentVolumeClaims that do not specify a `storageClassName`.

```yaml
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
metadata:
  name: "local-and-distributed"
spec:
  ...
  rook:
    version: "1.7.x"
    storageClassName: "distributed"
    isSharedFilesystemDisabled: true
  openebs:
    version: "3.3.x"
    isLocalPVEnabled: true
    localPVStorageClassName: "local"
```
