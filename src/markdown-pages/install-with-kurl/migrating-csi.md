---
path: "/docs/install-with-kurl/migrating-csi"
date: "2021-06-30"
weight: 23
linktitle: "Migrating CSI"
title: "Migrating to Change CSI Add-On"
---

This topic describes how to change the Container Storage Interface (CSI) provisioner add-on in your kURL cluster. It includes information about how to use the kURL installer to automatically migrate data to the new provisioner during upgrade. It also includes prerequisites that you must complete before attempting to change CSI add-ons to reduce the risk of errors during data migration.

* [Supported CSI Migrations](#supported-csi-migrations)
* [About Changing the CSI Add-on](#about-changing-the-csi-add-on)
* [Prerequisites](#prerequisites)
  * [General Prerequisites](#general-prerequisites)
  * [Longhorn Prerequisites](#longhorn-prerequisites)
* [Change the CSI Add-on in a Cluster](#change-the-csi-add-on-in-a-cluster)
* [Troubleshoot Longhorn Data Migration](#troubleshoot-longhorn-data-migration)  

## Supported CSI Migrations

_**Important**_: kURL does not support Longhorn. If you are currently using Longhorn, you must migrate data from Longhorn to either OpenEBS or Rook.

This table describes the CSI add-on migration paths that kURL supports:

| From      | To        | Notes                                                                                                                                                                                                                  |
|-----------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Longhorn  | OpenEBS 3.3.0 and later  | Migrating from Longhorn to OpenEBS 3.3.0 or later is recommended for single-node installations. |
| Longhorn  | Rook 1.10.8 and later | Migrating from Longhorn to Rook 1.10.8 or later is recommended for clusters with three or more nodes where data replication and availability are requirements. Compared to OpenEBS, Rook requires more resources from your cluster, including a dedicated block device. Single-node installations of Rook are not recommended. Migrating from Longhorn to Rook is not supported for single-node clusters.  |
| Rook      | OpenEBS 3.3.0 and later  | Migrating from Rook to OpenEBS 3.3.0 or later is strongly recommended for single-node installations, or for applications that do not require data replication. Compared to Rook, OpenEBS requires significantly fewer hardware resources from your cluster. |

For more information about how to choose between Rook or OpenEBS, see [Choosing a PV Provisioner](/docs/create-installer/choosing-a-pv-provisioner).

## About Changing the CSI Add-on

You can change the CSI provisioner that your kURL cluster uses by updating the CSI add-on in your kURL specification file. Then, when you upgrade a kURL cluster using the new specification, the kURL installer detects the change that you made to the CSI add-on and begins automatically migrating data from the current provisioner to the new one.

kURL supports data migration when you change your CSI provisioner from Rook to OpenEBS, or when you change from Longhorn to Rook or OpenEBS.

The following describes the automatic data migration process when you change the CSI provisioner add-on, where _source_ is the CSI provisioner currently installed in the cluster and _target_ is the desired CSI provisioner:

1. kURL installer temporarily shuts down all pods mounting volumes backed by the _source_ provisioner. This is done to ensure that the data being migrated is not in use and can be safely copied to the new storage system. 

1. kURL recreates all PVCs provided by the _source_ provisioner using the _target_ provisioner as backing storage. Data is then copied from the source PVC to the destination PVC.

1. If you are migrating from Rook or Longhorn to OpenEBS in a cluster that has more than two nodes, then the kURL installer attempts to create local OpenEBS volumes on the same nodes where the original Rook or Longhorn volumes were referenced.

1. When the data migration is complete, the pods are restarted using the new PVCs.

1. kURL uninstalls the _source_ provisioner from the cluster.

## Prerequisites

This section includes prerequisites that you must complete before changing the CSI provisioner in your kURL cluster. These prerequisites help you identify and address the most common causes for a data migration failure so that you can reduce the risk of issues.

### General Prerequisites

Before you attempt to change the CSI provisioner in your cluster, complete the following prerequisites:

- Take a snapshot or backup of the relevant data. This helps ensure you can recover your data if the data migration fails.

- Schedule downtime for the migration. During the automated migration process, there is often a period of time where the application is unavailable. The duration of this downtime depends on the amount of data to migrate. Proper planning and scheduling is necessary to minimize the impact of downtime.  

- Verify that the version of Kubernetes you are upgrading to supports both the current CSI provisioner and the new provisioner that you want to use. Running incompatible versions causes an error during data migration.

- Ensure that your cluster has adequate hardware resources to run both the current and the new CSI provisioner simultaneously. Your cluster must be able to run both provisioners simultaneously. During the data migration process, the cluster uses twice as much storage capacity as usual due to duplicate volumes. So, the Rook dedicated storage device or the OpenEBS volume must have sufficient disk space available to handle this increase.

  After kURL completes the data migration, storage consumption in the cluster returns to normal because the volumes from the previous CSI provisioner are deleted.

  To ensure that your cluster has adequate resources, review the following for requirements specific to Rook or OpenEBS: 
  - **Rook Ceph**: See [Rook Add-on](/add-ons/rook) in the kURL documentation and [Hardware Recommendations](https://docs.ceph.com/en/quincy/start/hardware-recommendations/) in the Ceph documentation.
  - **OpenEBS**: See [OpenEBS Add-on](/add-ons/openebs) in the kURL documentation and [What are the minimum requirements and supported container orchestrators?](https://openebs.io/docs/faqs/general#what-are-the-minimum-requirements-and-supported-container-orchestrators) in the OpenEBS documentation.

- If you are migrating from Longhorn, complete the additional [Longhorn Prerequisites](#longhorn-prerequisites) below.

### Longhorn Prerequisites

If you are migrating from Longhorn to a different CSI provisioner, you must complete the following prerequisites in addition to the [General Prerequisites](#general-prerequisites) above:

- Ensure that the version of Longhorn installed in your cluster is 1.2.0 or later or 1.3.0 or later. Longhorn versions 1.2.x and 1.3.x support Kubernetes versions 1.24 and earlier.

- Confirm that the Longhorn volumes are in a healthy state. Run the following command to check the status of the volumes:

    ```
    kubectl get volumes.longhorn.io -A
    ```

    If any volumes are reported as not healthy in the `Robustness` column in the ouput of this command, resolve the issue before proceeding.

    To learn more about volume health, you can also inspect each volume individually:

    ```
    kubectl get volumes.longhorn.io -n longhorn-system <volume name> -o yaml
    ```

    In many cases, volume health is caused by issues with volume replication. Specifically, when multiple replicas are configured for a volume but not all have been scheduled. 

    _**Note**_: During the data migration process in single-node clusters, the system automatically scales down the number of replicas to 1 in all Longhorn volumes to ensure the volumes are in a healthy state before beginning the data transfer. This is done to minimize the risk of a migration failure.

- Confirm that Longhorn nodes are in a healthy state. The nodes must be healthy to ensure they are not over-provisioned and can handle scheduled workloads. Run the following command to check the status of the Longhorn nodes:

    ```
    kubectl get nodes.longhorn.io -A
    ```

    If any node is not reported as "Ready" and "Schedulable" in the output of this command, resolve the issue before proceeding.
    
    To learn more, you can also inspect each node individually and view its "Status" property:

    ```
    kubectl get nodes.longhorn.io -n longhorn-system <node name> -o yaml
    ```

- (OpenEBS Only) Before you migrate from Longhorn to OpenEBS:
   - Ensure the filesystem on the node has adequate space to accommodate twice the amount of data currently stored by Longhorn. This is important because both OpenEBS and Longhorn use the node's filesystem for data storage.
   - Ensure that there is an additional 2G of memory and 2 CPUs available for OpenEBS. For more information, see [What are the minimum requirements and supported container orchestrators?](https://openebs.io/docs/faqs/general#what-are-the-minimum-requirements-and-supported-container-orchestrators) in the OpenEBS documentation.

- (Rook Only) Before you migrate from Longhorn to Rook, ensure that the dedicated block device for Rook attached to each node has enough space to host all data currently stored in Longhorn.

## Change the CSI Add-on in a Cluster

This procedure describes how to update the kURL specification file to use a new CSI provisioner add-on. Then, upgrade your kURL cluster to automatically migrate data to the new provisioner.

For more information about the supported migration paths for CSI provisioners, see [Supported CSI Migrations](#supported-csi-migrations) above.

_**Warning**_: When you change the CSI provisioner in your cluster, the data migration process causes some amount of downtime for the application. It is important to plan accordingly to minimize the impact on users.

To migrate to a new CSI provisioner in a kURL cluster:

1. Complete the [Prerequisites](#prerequisites) above.

1. Update the kURL specification to remove the current CSI add-on and add the new CSI add-on that you want to use (either Rook or OpenEBS). For information about the options for the Rook or OpenEBS kURL add-ons, see [Rook Add-on](/add-ons/rook) or [OpenEBS Add-on](/add-ons/openebs).

   **Example:**

   This example shows how to update a kURL specification to change the CSI provisioner add-on from Rook to OpenEBS Local PV.

   Given the following `my-current-installer` file, which specifies Rook as the CSI provisioner:

    ```
    apiVersion: cluster.kurl.sh/v1beta1
    kind: Installer
    metadata:
      name: my-current-installer
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

   You can remove `rook` and add `openebs` with `isLocalPVEnable: true` to migrate data from Rook to OpenEBS Local PV, as shown in the following `my-new-installer` file: 

    ```
    apiVersion: cluster.kurl.sh/v1beta1
    kind: Installer
    metadata:
      name: my-new-installer
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

1. Upgrade your kURL cluster to use the updated specification by rerunning the kURL installation script. For more information about how to upgrade a kURL cluster, see [Upgrading](/install-with-kurl/upgrading).

   During the cluster upgrade, the kURL installer detects that the CSI add-on has changed. kURL automatically begins the process of migrating data from the current CSI provisioner to the provisioner in the updated specification. For more information about the data migration process, see [About Changing the CSI Add-on](#about-changing-the-csi-add-on) above.

## Troubleshoot Longhorn Data Migration

This section describes how to troubleshoot known issues in migrating data from Longhorn to Rook or OpenEBS.
### Pods stuck in Terminating or Creating state

One of the most common problems that may arise during the migration process is Pods getting stuck in the Terminating or Creating state. This can happen when the Pods are trying to be scaled down or up but are not able to do so due to some underlying issue with Longhorn. In this case, it is recommended to restart the kubelet service on all nodes. This can be done by opening new sessions to the nodes and running the command below to restart the kubelet service.

```
sudo systemctl restart kubelet
```

### Restore the original number of Volume replicas
>>>>>>> f5d0b09 (Docs edits)

To ensure a smooth migration process, when executed on a single node cluster, all Longhorn volumes are scaled down to 1 replica. This is done to make it easier to identify any issues that may arise during the migration, as scaling up the number of replicas can potentially mask the underlying problem. Despite the migration not being successful, the volumes will remain at 1 replica in order to identify the root cause of the failure. If necessary you can restore the original number of replicas by running the following command:

```
kurl longhorn rollback-migration-replicas
```
