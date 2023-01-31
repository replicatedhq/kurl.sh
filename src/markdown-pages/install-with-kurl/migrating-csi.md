---
path: "/docs/install-with-kurl/migrating-csi"
date: "2021-06-30"
weight: 23
linktitle: "Migrating CSI"
title: "Migrating to Change kURL CSI Add-Ons"
---

It is crucial to acknowledge that Longhorn has caused several operational issues in the past so its support will be discontinued going forward. If you are currently utilizing Longhorn, it is imperative that you plan for migration to an alternative solution, that can be either OpenEBS or Rook. This table provides a complete and concise overview of the CSI migrations that are currently supported by the Kurl platform.

| From      | To        | Notes                                                                                                                                                                                                 |
|-----------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Longhorn  | OpenEBS   | The support for Longhorn is being discontinued, and therefore, this is the recommended approach for single-node installations                                                                         |
| Longhorn  | Rook      | Single-node installations of Rook are not recommended and therefore this migration is not supported. However, if you are running Kurl in a multi-node setup, this migration is the ideal option.      |
| Rook      | OpenEBS   | Migrating to OpenEBS from Rook is strongly advised for single-node installations or for applications that do not require data replication, as OpenEBS requires significantly fewer hardware resources.|


If your application runs on a single-node setup or does not require data replication, then OpenEBS is the ideal solution as it requires significantly fewer hardware resources. Rook is specifically designed for multi-node clusters where data replication and availability are crucial requirements. However, it should be taken into consideration that Rook demands more resources from your cluster, including the need for a dedicated block device for its exclusive use. Be aware that the Kurl installer has the capability to detect the CSI provisioner that is currently installed and, in case a different one is installed during an upgrade, the data will be seamlessly migrated from the old provisioner to the new one. However, it is crucial to take into consideration that there may be a period of application unavailability during the migration process, therefore, proper planning and scheduling is necessary to minimize the impact to the application. The duration of the unavailability period will vary based on the amount of data that needs to be migrated.

As an example, if the cluster has been installed with the following setup:

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

You can then automatically migrate data _from_ Rook _to_ OpenEBS+Minio with Local PV using the following kURL spec. This requires OpenEBS 3.3.0 or newer. 

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

kURL does the following when you use the specs above to migrate data from Rook:

* Recreates all PVCs that were originally created using Rook onto OpenEBS with the same name and contents. 
* If you are migrating off of Rook from a Kubernetes cluster that has more than two nodes, OpenEBS attempts to create local volumes on the same nodes where the original Rook PVCs were referenced.
* Uninstalls Rook from the cluster.

It's important to keep in mind that this process also applies when migrating from Longhorn to either Rook or OpenEBS. Here's a step-by-step rundown of the process:

1. Your cluster is initially installed with Longhorn.
2. Your applications are using Longhorn volumes.
3. You update your cluster with a Kurl specification that no longer includes Longhorn, but instead features either OpenEBS or Rook.
4. All pods that were previously mounting Longhorn volumes will be temporarily shut down.
5. The migration process will copy all data from Longhorn to the new target storage provisioner (either OpenEBS or Rook).
6. Once the migration is complete, the pods will be restarted.

## Migrating from Longhorn

It is imperative to take into consideration several crucial factors when migrating from Longhorn due to the operational challenges experienced in the past. Make sure to thoroughly read all the information provided below to ensure a seamless migration process.

### Prerequisites

To summarize, before considering migrating your data from Longhorn to Rook or OpenEBS, it is important to take the following factors into account:

- Taking a snapshot or backup of the relevant data before migrating is mandatory.
- Adequate hardware resources are necessary to run both Storage Provisioners simultaneously during migration, failure to do so may result in migration failure (see _Hardware requirements_ section below).
- Scheduling a downtime for the migration is crucial, the duration of the downtime will depend on the amount of data being migrated.
- It is essential to ensure that the version of Kubernetes you are upgrading to supports both Longhorn and OpenEBS or Rook.
- It is highly discouraged to run Rook on a single node cluster, as multi-node configurations are required for optimal performance. If you plan to migrate in a single-node installation then OpenEBS is the recommended provisioner.


### The migration process

Starting from Rook 1.10.8 and OpenEBS 3.3.0, Kurl simplifies the process of migrating data from Longhorn by automating the migration when a cluster running Longhorn is upgraded to a Kurl version that does not include Longhorn and has Rook or OpenEBS set as the storage provisioner.

The data migration process from Longhorn involves several steps to ensure a smooth transition while minimizing disruption to the application. One of these steps includes scaling down all Pods that are currently using Longhorn volumes. This is done to ensure that the data being migrated is not in use and can be safely copied to the new storage system. A PersistentVolumeClaim by PersistentVolumeClaim copy is executed to transfer the data to the new storage provisioner. This process, however, does **involve some level of downtime for the application** as the migration is being executed, which is why it is important to plan accordingly to minimize the impact on the end-users.

It is also important to keep in mind that for the migration to be successful, the cluster must **have adequate resources to run both storage provisioners simultaneously** during the migration process (Longhorn and OpenEBS or Longhorn and Rook). For other specific system requirements, it is recommended to refer to the add-on specific documentation. The **migration will result in a significant increase in storage consumption**, with the cluster using twice as much as during regular use due to duplicate volumes. It is imperative that sufficient disk space (in the Rook dedicated storage device or in the OpenEBS volume) is available in the cluster to handle this increase. Upon completion of the migration, storage consumption will return to normal levels as the previous volumes are deleted.

Another important factor to consider before initiating the migration is ensuring that the Kubernetes version you are upgrading to is compatible with both provisioners. It is crucial to ensure that both provisioners are supported on the specific version of Kubernetes you are using, as running incompatible versions will lead to an error during the migration.

_For a successful migration, it is recommended to ensure that the Longhorn version is at least 1.2.x or 1.3.x before proceeding, and it is known that these versions support Kubernetes up to version 1.24._


### Hardware requirements

It is imperative to note that the requirements listed below must be in addition to the resources already being utilized by the cluster. In other words, the cluster must have the listed resources as spare capacity or available to accommodate Rook or OpenEBS.

#### Rook

The Ceph community strongly advises against running Rook+Ceph in a single node cluster and mandates a minimum of three nodes. The concurrent operation of both Longhorn and Rook during the migration process will increase the overall hardware requirements of the cluster. If the cluster cannot handle this workload, the upgrade will be unsuccessful. For further information on Rook requirements please refer to Kurl’s [Rook](https://kurl.sh/docs/add-ons/rook) documentation. The official [Rook+Ceph documentation](https://docs.ceph.com/en/quincy/start/hardware-recommendations/) is another crucial source for obtaining information on hardware requirements. The dedicated block device attached to each node must have enough space to host all data being stored in Longhorn.

#### OpenEBS

As stated in the [OpenEBS official documentation](https://openebs.io/docs/additional-info/faqs#:~:text=You%20can%20run%20these%20using,nodes%20in%20the%20Kubernetes%20cluster), OpenEBS requires 2G of memory and 2 CPUs, so it is crucial to ensure the cluster has these spare resources available prior to initiating the migration. It is crucial to be aware that OpenEBS and Longhorn both utilize the node's filesystem for data storage, therefore, it is essential to ensure that the filesystem is adequately sized to accommodate twice the amount of data stored by Longhorn.

### Preparation

To ensure a smooth migration process, it is important to take certain steps before starting it. This includes identifying and addressing the most common causes for a migration failure. By doing so, you can minimize the risk of encountering issues during the migration and increase the chances of success.

#### Check Longhorn Volumes health

It is crucial to ensure that the volumes being migrated are in a healthy state before proceeding. The migration won’t proceed if the volumes are not healthy. You can check the status of the volumes using the provided command below. If any volumes are reported as not healthy in the "Robustness" column, it is recommended to address the issue before proceeding with the migration.

```
$ kubectl get volumes.longhorn.io -A
```

In many cases, volume health can be attributed to issues with volume replication. Specifically, when multiple replicas are configured for a volume but not all of them have been scheduled yet. To gain more insight, you can review the individual volumes by inspecting them.

```
$ kubectl get volumes.longhorn.io -n longhorn-system <volume name> -o yaml
```

_During the migration process, when running on a single node cluster, the system will automatically scale down the number of replicas to 1 in all Longhorn volumes as a measure to ensure the volumes are in a healthy state before beginning the data transfer. This is done to minimize the risk of a migration failure._

#### Check Longhorn Nodes health

To ensure a successful migration, it is crucial to verify that all Longhorn nodes are in a healthy state: able to handle scheduled workloads, and not over-provisioned. You can check the status of the Longhorn nodes by running the following command:

```
$ kubectl get nodes.longhorn.io -A
```

If any node is not reported as "Ready" and "Schedulable", you can obtain more information by individually inspecting the node and checking its "Status" property.

```
$ kubectl get nodes.longhorn.io -n longhorn-system <node name> -o yaml
```

### Known issues

It is important to note that migrating to a different storage provisioner, such as Rook and OpenEBS, from Longhorn can come with its own set of challenges and difficulties. We have found that the Longhorn storage provisioner has caused several operational issues in the past, which is why we have chosen to prioritize other options.

#### Pods stuck in Terminating or Creating state

One of the most common problems that may arise during the migration process is Pods getting stuck in the Terminating or Creating state. This can happen when the Pods are trying to be scaled down or up but are not able to do so due to some underlying issue with Longhorn. In this case, it is recommended to restart the Kubelet service on all nodes. This can be done by opening new sessions to the nodes and running the command below to restart the Kubelet service.

```
$ sudo systemctl restart kubelet
```

#### How to restore the original number of Volume replicas

To ensure a smooth migration process, when executed on a single node cluster, all Longhorn volumes are scaled down to 1 replica. This is done to make it easier to identify any issues that may arise during the migration, as scaling up the number of replicas can potentially mask the underlying problem. Despite the migration not being successful, the volumes will remain at 1 replica in order to identify the root cause of the failure. If necessary you can restore the original number of replicas by running the following command:

```
$ kurl longhorn rollback-migration-replicas
```
