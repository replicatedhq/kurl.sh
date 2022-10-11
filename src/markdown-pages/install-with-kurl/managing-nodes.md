---
path: "/docs/install-with-kurl/adding-nodes"
date: "2019-12-19"
weight: 20
linktitle: "Managing Nodes"
title: "Managing Nodes"
---

This topic describes how to manage nodes on kURL clusters. It includes procedures for how to safely reset, reboot, and remove nodes when performing maintenance tasks.

## ECKO Add-On Prerequisite

Before you manage a node on a kURL cluster, you must install the Embedded kURL Cluster Operator (EKCO) add-on on the cluster. The EKCO add-on is a utility tool used to perform maintenance operations on a kURL cluster.

For information on how to install the EKCO add-on to a kURL cluster, see [EKCO Add-on](/docs/add-ons/ekco).

## Reset a Node

Resetting a node is the process of attempting to remove all Kubernetes packages and host files from the node.

Resetting a node can be useful if you are creating and testing a kURL specification in a non-production environment. Some larger changes to a kURL specification cannot be deployed for testing by rerunning the kURL installation script on an existing node. In this case, you can attempt to reset the node so that you can reinstall kURL to test the change to the kURL specification.   

_**Important**_: Do not attempt to reset a node on a cluster in a production environment. Attempting to reset a node can permanently damage the cluster, which makes any data from the cluster irretrievable. Reset a node on a cluster only if you are able to delete the host VM and provision a new VM if the reset script does not successfully complete.

To reset a node on a cluster managed by kURL:

1. Run the kURL reset script on a VM that you are able to delete if the script is unsuccessful. The kURL reset script first runs the ECKO shutdown script to cordon the node. Then, it attempts to remove all Kubernetes packages and host files from the node.

   * **Online**:

      ```bash
      curl -sSL https://kurl.sh/latest/tasks.sh | sudo bash -s reset
      ```

   * **Air Gapped**:

      ```bash
      cat ./tasks.sh | sudo bash -s reset
      ```
1. If the reset does not complete, delete the host VM and provision a new VM.

   The reset script might not complete successfully if the removal of the Kubernetes packages and host files from the node also damages the cluster itself. When the cluster is damaged, the tools used by the reset script, such as the kubectl command-line tool, can no longer communicate with the cluster and the script cannot complete.

## Reboot a Node

Rebooting a node is useful when you are performing maintenance on the operating system (OS) level of the node. For example, after you perform a kernel update, you can reboot the node to apply the change to the OS.

To reboot a node on a cluster managed by kURL:

1. Run the EKCO shutdown script on the node:

   ```
   /opt/ekco/shutdown.sh
   ```

   The shutdown script deletes any Pods on the node that mount volumes provisioned by Rook. It also cordons the node, so that the node is marked as unschedulable and kURL does not start any new containers on the node. For more information, see see [EKCO Add-on](/docs/add-ons/ekco).

1. Reboot the node.

## Remove a Node

As part of performing maintenance on a multi-node cluster managed by kURL, it is often required to remove a node from the cluster and replicate its data to a new node. For example, you might need to remove one or more nodes during hardware maintenance.

This section describes how to safely remove nodes from a kURL cluster that uses the Rook add-on for Rook Ceph storage. For more information about the Rook add-on, see [Rook Add-on](/docs/add-ons/rook).

For information about how to remove a node from a cluster that does not use Rook Ceph, see [kubectl drain](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/) in the Kubernetes documentation.

### Rook Ceph and etcd Node Removal Requirements

The following are the requirements and considerations when removing nodes from Rook Ceph and etcd clusters:

* **etcd cluster health**: To remove a primary node from etcd clusters, you must meet the following requirements to maintain etcd quorum:
   * You must have at least one primary node.
   * If you scale the etcd cluster to three primary nodes, you must then maintain a minimum of three primary nodes to maintain quorum.
* **Rook Ceph cluster health**: When you scale a Ceph Storage Cluster to three or more Ceph Object Storage Daemons (OSDs), such as when you add additional manager or worker nodes to the cluster, the Ceph Storage Cluster can no longer have fewer than three OSDs. If you reduce the number of OSDs to less than three in this case, then the Ceph Storage Cluster loses quorum.
* **Add a node before removing a node**: To remove and replace a node, it is recommended that you add a new node first before removing the node. For example, to remove one node in a three-node cluster, first add a new node to scale the cluster to four nodes. Then, remove the desired node to scale the cluster back down to three nodes.
* **Remove one node at a time**: If you need to remove multiple nodes from a cluster, remove one node at a time.

### Rook Ceph Cluster Prerequisites

Complete the following prerequisites to avoid data loss when removing nodes from Rook Ceph clusters:

   * (Recommended) Upgrade Rook Ceph to v1.4 or later.

   * In the kURL specification, set `isBlockStorageEnabled` to `true`. This is the default for Rook Ceph v1.4 and later.

   * Ensure that you can access the ceph CLI from inside a Pod that can communicate with the Ceph Storage Cluster. Do one of the following:      
      * (Recommended) Use the `rook-ceph-tools` Pod to access the ceph CLI. Use the same version of the Rook toolbox as the version of Rook Ceph installed in the cluster. For information about how to create a `rook-ceph-tools` Pod for Rook Ceph v1.5, see [Rook Toolbox](https://rook.io/docs/rook/v1.5/ceph-toolbox.html) in the Rook Ceph documentation.
      * Use `kubectl exec` to enter the `rook-ceph-operator` Pod, where the ceph CLI is available.

         If you use `kubectl exec` to access the ceph CLI, you can either open an interactive shell to run multiple ceph CLI commands in a row, or you can precede each ceph CLI command that you run with `kubectl exec`. The following shows an example of each method:

         * Create an interactive shell to run multiple commands in a row.

            **Example**:

            Open an interactive shell:

            ```
            kubectl exec -it -n rook-ceph rook-ceph-tools-54ff78f9b6-gqsfm -- /bin/bash
            ```
            Then, run ceph CLI commands from the interactive shell:

            ```
            ceph status
            ```

         * Precede each ceph CLI command with `kubectl exec`.

            **Example**:

            ```
            kubectl exec -it -n rook-ceph rook-ceph-tools-54ff78f9b6-gqsfm -- ceph status
            ```

### Remove Nodes from Rook Ceph Clusters

This procedure ensures that all data held in Ceph is replicated to new nodes safely by weighting the Ceph OSDs to `0` on each of the nodes that you want to remove, waiting for the cluster to rebalance, removing the OSDs that are on the node, and then finally removing the node.

To remove nodes from a kURL cluster with Rook Ceph:

1. Review the [Rook Ceph and etcd Node Removal Requirements](#rook-ceph-and-etcd-node-removal-requirements) above.

1. Complete the [Rook Ceph Cluster Prerequisites](#rook-ceph-cluster-prerequisites) above.

1. Verify that Ceph is in a healthy state by running one of the following `ceph status` commands in the `rook-ceph-tools` or `rook-ceph-operator` Pod in the `rook-ceph` namespace:

    * **Rook v1.4.x**:

      ```
      kubectl -n rook-ceph exec deploy/rook-ceph-tools -- ceph status
      ```
    * **Rook v1.0.x**:

      ```
      kubectl -n rook-ceph exec deploy/rook-ceph-operator -- ceph status
      ```

      The output of the command shows `health: HEALTH_OK` if Ceph is in a healthy state.

      For more information about how to access the ceph CLI from a Pod that can communicate with the Ceph Storage Cluster, see [Rook Ceph Cluster Prerequisites](#rook-ceph-cluster-prerequisites) above.

      _**Note**_: You check the health of Ceph before each step in this procedure in which you make any change to the Ceph Storage Cluster.

1. (Optional) Run `ceph osd tree` to view details about the OSDs on the node:

   ```
   kubectl exec -it -n rook-ceph POD -- ceph osd tree
   ```
   Relace `POD` with the ID of the `rook-ceph-tools` or `rook-ceph-operator` Pod.

1. Add a node to the cluster. Run `ceph status` to view the progress of the replication of data to the new Ceph OSD.

1. Reweight the OSD on the node that you intend to remove to `0`:

   ```
   ceph osd reweight OSD_NAME 0
   ```
   Replace `OSD_NAME` with the name of the Ceph OSD on the node.

   Ceph rebalances the placement groups off the OSD that you specify in the `ceph osd reweight` command. You can run `watch ceph status` to view the progress.

1. After the `ceph osd reweight` command is successful, verify Ceph is healthy by running `ceph status` reports `HEALTH_OK`.

1. On each node that you intend to remove, run the following ceph CLI command to mark the OSD as `down`:

   ```
   ceph osd down OSD_NAME
   ```
1. For each OSD on each node that you intend to remove, use the kubectl command-line tool to scale the OSD deployments to 0 replicas:

   ```
   kubectl scale deployment -n rook-ceph rook-ceph-osd-1 --replicas 0
   ```   

1. Remove the node.

   Once the node is removed, Ceph will begin replicating its data to OSDs on remaining nodes. If a Ceph Object Storage Daemon (OSD) is scheduled on a node that is removed, Ceph cluster health must be regained before removing any additional nodes.

To remove a node from a cluster managed by kURL:

   1. Run the EKCO shutdown script on the node:

      ```
      /opt/ekco/shutdown.sh
      ```

      The shutdown script deletes any Pods on the node that mount volumes provisioned by Rook. It also cordons the node, so that the node is marked as unschedulable and kURL does not start any new containers on the node. For more information, see [EKCO Add-on](/docs/add-ons/ekco).

   1. Power down the node.

   1. On another primary node in the cluster, run the EKCO purge script on the node that you powered down in the previous step:

      ```
      ekco-purge-node NODE_NAME
      ```
      Replace `NODE_NAME` with the name of the node that you powered down in the previous step.

      For information about the EKCO purge script, see [Purge Nodes](/docs/add-ons/ekco#purge-nodes) in _EKCO Add-on_.

   1. Remove the node from the cluster.

      After you remove the node, you can run the kURL reset script to remove kURL and Kubernetes assets from the node to prep it to re-join the cluster at a later time. Or, delete the VM and provision a new VM.
