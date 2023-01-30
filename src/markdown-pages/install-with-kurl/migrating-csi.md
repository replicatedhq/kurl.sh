---
path: "/docs/install-with-kurl/migrating-csi"
date: "2021-06-30"
weight: 23
linktitle: "Migrating CSI"
title: "Migrating to Change kURL CSI Add-Ons"
---

For kURL [v2022.10.28-0](https://kurl.sh/release-notes/v2022.10.28-0) and later, there is a supported data migration path from the Rook CSI add-on to either OpenEBS with Local PV, or Longhorn and MinIO as the new storage provider. 

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
  flannel:
    version: 0.20.2
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
  flannel:
    version: 0.20.2
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
  flannel:
    version: 0.20.2
  openebs:
    version: 3.3.0
    isLocalPVEnabled: true
    localPVStorageClassName: default
  minio:
    version: 2020-01-25T02-50-51Z
```

kURL does the following when you use the specs above to migrate data from Rook:

* Recreates all PVCs that were originally created using Rook onto OpenEBS or Longhorn with the same name and contents. 
* Copies all data within the Rook object store to MinIO, if using MinIO. 
* If you are migrating off of Rook from a Kubernetes cluster that has more than two nodes, OpenEBS attempts to create local volumes on the same nodes where the original Rook PVCs were referenced.
* Uninstalls Rook from the cluster.


## Migrating from Longhorn to OpenEBS

### Prerequisites

To summarize, before considering migrating your data from Longhorn to OpenEBS, it is important to take the following factors into account:

- Taking a snapshot or backup of the relevant data before migrating is mandatory.
- Adequate hardware resources are necessary to run both Storage Provisioners simultaneously during migration, failure to do so may result in migration failure (see _Hardware requirements_ section below).
- Scheduling a downtime for the migration is crucial, the duration of the downtime will depend on the amount of data being migrated.
- It is essential to ensure that the version of Kubernetes you are upgrading to supports both Longhorn and OpenEBS.

### The migration process

Starting from OpenEBS 3.3.0, Kurl simplifies the process of migrating data from Longhorn by automating the migration when a cluster running Longhorn is upgraded to a Kurl version that does not include Longhorn and has OpenEBS set as the storage provisioner.
The data migration process from Longhorn to OpenEBS involves several steps to ensure a smooth transition while minimizing disruption to the application. One of these steps includes scaling down all Pods that are currently using Longhorn volumes. This is done to ensure that the data being migrated is not in use and can be safely copied to the new storage system. A PersistentVolumeClaim by PersistentVolumeClaim copy is executed in the background to transfer the data to the new storage system. This process, however, **does involve some level of downtime** for the application as the migration is being executed, which is why it is important to plan accordingly to minimize the impact on the end-users.

If you are operating Longhorn in a multi-node cluster, it is recommended to refer to the Rook documentation as Rook is the recommended storage provisioner for most multi-node clusters. OpenEBS, on the other hand, is recommended for single node installations.

It is also important to keep in mind that for the migration to be successful, the cluster must **have adequate resources** to run both storage provisioners simultaneously during the migration process. For specific system requirements, it is recommended to refer to the add-on specific documentation. The **migration will result in a significant increase in storage consumption**, with the cluster using twice as much as during regular use due to duplicate volumes. It is imperative that sufficient disk space is available in the cluster to handle this increase. Upon completion of the migration, storage consumption will return to normal levels as the previous volumes are deleted.

Another important factor to consider before initiating the migration is ensuring that the Kubernetes version you are upgrading to is compatible with both provisioners (Longhorn and OpenEBS, in this case). It is crucial to ensure that both provisioners are supported on the specific version of Kubernetes you are using, as running incompatible versions will lead to an error during the migration.

For a successful migration, it is recommended to ensure that the Longhorn version is at least 1.2.x or 1.3.x before proceeding


### Hardware requirements

During the migration process, the cluster will run both Longhorn and OpenEBS simultaneously. If the cluster cannot handle this workload, the upgrade will be unsuccessful. As stated in the [OpenEBS official documentation](https://openebs.io/docs/additional-info/faqs#:~:text=You%20can%20run%20these%20using,nodes%20in%20the%20Kubernetes%20cluster.), OpenEBS requires 2G of memory and 2 CPUs, so it is crucial to ensure the cluster has these resources available prior to initiating the migration.

### Preparation

To ensure a smooth migration process, it is important to take certain steps before starting it. This includes identifying and addressing the most common causes for a migration failure. By doing so, you can minimize the risk of encountering issues during the migration and increase the chances of success.

#### Check Longhorn Volumes health

It is crucial to ensure that the volumes being migrated are in a healthy state before proceeding. The migration won’t proceed if the volumes are not healthy. You can check the status of the volumes using the provided command below. If any volumes are reported as not healthy in the "Robustness" column, it is recommended to address the issue before proceeding with the migration.

```
$ kubectl get volumes.longhorn.io -A
```

In many cases, volume health can be attributed to issues with volume replication. Specifically, when multiple replicas are configured for a volume but not all of them have been scheduled yet. To gain more insight, you can review the individual volumes by editing them.

```
$ kubectl edit volumes.longhorn.io -n longhorn-system <volume name>
```

_During the migration process, when running on a single node cluster, the system will automatically scale down the number of replicas to 1 in all Longhorn volumes as a measure to ensure the volumes are in a healthy state before beginning the data transfer. This is done to minimize the risk of a migration failure._

#### Check Longhorn Nodes health

To ensure a successful migration, it is crucial to verify that all Longhorn nodes are in a healthy state: able to handle scheduled workloads, and not over-provisioned. You can check the status of the Longhorn nodes by running the following command:

```
$ kubectl get nodes.longhorn.io -A
```

If any node is not reported as "Ready" and "Schedulable", you can obtain more information by individually editing the node and checking its "Status" property.

### Known issues

It is important to note that migrating to a different storage provisioner, such as OpenEBS and Rook, from Longhorn can come with its own set of challenges and difficulties. We have found that the Longhorn storage provisioner has caused several operational issues in the past, which is why we have chosen to prioritize other options.

#### Pods stuck in Terminating or Creating state

One of the most common problems that may arise during the migration process is Pods getting stuck in the Terminating or Creating state. This can happen when the Pods are trying to be scaled down or up but are not able to do so due to some underlying issue. In this case, it is recommended to restart the Kubelet service on all nodes. This can be done by opening new sessions to the nodes and running the command below to restart the Kubelet service.

```
$ sudo systemctl restart kubelet
```

#### Restore original number of Volume replicas

To ensure a smooth migration process, when executed on a single node cluster, all Longhorn volumes are scaled down to 1 replica. This is done to make it easier to identify any issues that may arise during the migration, as scaling up the number of replicas can potentially mask the underlying problem. Despite the migration not being successful, the volumes will remain at 1 replica in order to identify the root cause of the failure. If necessary you can restore the original number of replicas by running the following command:

```
$ sudo kurl longhorn rollback-migration-replicas
```
