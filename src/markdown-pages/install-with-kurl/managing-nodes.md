---
path: "/docs/install-with-kurl/adding-nodes"
date: "2019-12-19"
weight: 20
linktitle: "Managing Nodes"
title: "Managing Nodes"
---

This topic describes how to manage nodes on kURL clusters. It includes procedures for how to safely reset, reboot, and remove nodes when performing maintenance tasks.

## ECKO Add-On Prerequisite

Before you can manage a node on a kURL cluster, you must install the Embedded kURL Cluster Operator (EKCO) add-on on the cluster. The EKCO add-on is a utility tool used to perform maintenance operations on a kURL cluster.

Each of the procedures in this topic for managing nodes on kURL cluster use the EKCO shutdown script. The shutdown script deletes any Pods on the node that mount volumes provisioned by Rook. It also cordons the node, so that the node is marked as unschedulable and kURL does not start any new containers on the node.

For information on how to add EKCO to a kURL cluster, see [EKCO Add-on](/docs/add-ons/ekco).

## Reset a Node

Resetting a node attempts to remove all Kubernetes packages and host files from the node.

Using the kURL reset script to reset a node can be useful if you are creating and testing a kURL specification in a non-production environment. Some larger changes to a kURL specification cannot be deployed for testing by rerunning the kURL installation script on an existing node. In this case, you can attempt to reset the node so that you can reinstall kURL to test the change to the kURL specification.   

_**Important**_: Do not attempt to reset a node on a cluster in a production environment. Attempting to reset a node can permanently damage the cluster, which makes any data from the node irretrievable. Reset a node on a cluster only if you are prepared to delete the host VM and provision a new VM if the reset script does not successfully complete.

To reset a node on a cluster managed by kURL:

1. Run the kURL reset script. The kURL reset script first runs the ECKO shutdown script to cordon the node. Then, it attempts to remove all Kubernetes packages and host files from the node.

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

Rebooting a node is useful when you are performing maintenance on the operating system (OS) level of the node. For example, after you update the kernel on your machine, you can reboot the node to apply the change to the OS.

To reboot a node on a cluster managed by kURL:

1. Run the EKCO shutdown script on the node:

   ```
   /opt/ekco/shutdown.sh
   ```

   The shutdown script deletes any Pods on the node that mount volumes provisioned by Rook. It also cordons the node, so that the node is marked as unschedulable and kURL does not start any new containers on the node. For more information, see see [EKCO Add-on](/docs/add-ons/ekco).

1. Reboot the node.

## Remove a Node

As part of performing maintenance on a multi-node cluster managed by kURL, it is often required to
remove a node from the cluster and transfer its data to a new node. For example, you might need to remove one or more nodes during hardware maintenance.

### Ceph and etcd Considerations

Once the cluster is scaled up to three nodes, the Ceph cluster must be maintained at three nodes.
If a Ceph Object Storage Daemon (OSD) is scheduled on a node that is removed, Ceph cluster health must be regained before removing any additional nodes.
Once the node is removed, Ceph will begin replicating its data to OSDs on remaining nodes.
If the cluster is scaled below three, a new node must be added to regain cluster health.

For more information about the Rook add-on, see [Rook Add-on](/docs/add-ons/rook).

When removing a node on a cluster that uses ectd, you must maintain etcd quorum.
* There must always be one primary node
* After you scale up the cluster to three primary nodes, you must maintain a minimum of three primary nodes to maintain quorum.

### Remove a Node

To remove a node from a cluster managed by kURL:

1. Do the following to avoid data loss when removing a node from kURL clusters that have the Rook add-on:
   * (Recommended) Upgrade Rook Ceph to v1.4 or later.
   * In the kURL specification, set `isBlockStorageEnabled` to `true`. This is the default for rook-ceph v1.4 and later.
   * Ensure that you can access the ceph CLI from a Pod that can communicate with the Ceph cluster.

1. If the Rook add-on is installed on the cluster, ensure that Ceph is in a healthy state before you attempt to remove a node. To verify the health of Ceph, run one of the following `ceph status` commands in the `rook-ceph-tools` or `rook-ceph-operator` Pod in the `rook-ceph` namespace:

    * **Rook v1.4.x**:

      ```
      kubectl -n rook-ceph exec deploy/rook-ceph-tools -- ceph status
      ```
    * **Rook v1.0.x**:

      ```
      kubectl -n rook-ceph exec deploy/rook-ceph-operator -- ceph status
      ```

1. Run the EKCO shutdown script on the node:

   ```
   /opt/ekco/shutdown.sh
   ```

   The shutdown script deletes any Pods on the node that mount volumes provisioned by Rook. It also cordons the node, so that the node is marked as unschedulable and kURL does not start any new containers on the node. For more information, see see [EKCO Add-on](/docs/add-ons/ekco).

1. Power down the node.

1. On another primary node in the cluster, run the EKCO purge script on the node that you powered down in the previous step:

   ```
   ekco-purge-node NODE_NAME
   ```
   Replace NODE_NAME with the name of the node that you powered down in the previous step.

   For information about the EKCO purge script, see [Purge Nodes](/docs/add-ons/ekco#purge-nodes) in _EKCO Add-on_.

1. Remove the node from the cluster.

   After you remove the node, you can run the kURL reset script to remove kURL and Kubernetes assets from the node to prep it to re-join the cluster at a later time. Or, delete the VM and provision a new VM.
