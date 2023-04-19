---
path: "/docs/install-with-kurl/managing-nodes"
date: "2022-10-14"
weight: 20
linktitle: "Managing Nodes"
title: "Managing Nodes"
---

This topic describes how to manage nodes on kURL clusters.
It includes procedures for how to safely reset, reboot, and remove nodes when performing maintenance tasks.

See the following sections:

* [EKCO Add-On Prerequisite](#ekco-add-on-prerequisite)
* [Reset a Node](#reset-a-node)
* [Reboot a Node](#reboot-a-node)
* [Remove a Node from Rook Ceph Clusters](#remove-a-node-from-rook-ceph-clusters)
  * [Rook Ceph and etcd Node Removal Requirements](#rook-ceph-and-etcd-node-removal-requirements)
  * [Rook Ceph Cluster Prerequisites](#rook-ceph-cluster-prerequisites)
  * [(Recommended) Manually Rebalance Ceph and Remove a Node](#recommended-manually-rebalance-ceph-and-remove-a-node)
  * [Remove Nodes with EKCO](#remove-nodes-with-ekco)
* [Troubleshoot Node Removal](#troubleshoot-node-removal)

## EKCO Add-On Prerequisite

Before you manage a node on a kURL cluster, you must install the Embedded kURL Cluster Operator (EKCO) add-on on the cluster.
The EKCO add-on is a utility tool used to perform maintenance operations on a kURL cluster.

For information on how to install the EKCO add-on to a kURL cluster, see [EKCO Add-on](/docs/add-ons/ekco).

## Reset a Node

Resetting a node is the process of attempting to remove all Kubernetes packages and host files from the node.

Resetting a node can be useful if you are creating and testing a kURL specification in a non-production environment.
Some larger changes to a kURL specification cannot be deployed for testing by rerunning the kURL installation script on an existing node.
In this case, you can attempt to reset the node so that you can reinstall kURL to test the change to the kURL specification.

_**Warning**_: Do not attempt to reset a node on a cluster in a production environment.
Attempting to reset a node can permanently damage the cluster, which makes any data from the cluster irretrievable.
Reset a node on a cluster only if you are able to delete the host VM and provision a new VM if the reset script does not successfully complete.

To reset a node on a cluster managed by kURL:

1. Run the kURL reset script on a VM that you are able to delete if the script is unsuccessful.
The kURL reset script first runs the EKCO shutdown script to cordon the node. Then, it attempts to remove all Kubernetes packages and host files from the node.

   * **Online**:

      ```bash
      curl -sSL https://kurl.sh/latest/tasks.sh | sudo bash -s reset
      ```

   * **Air Gapped**:

      ```bash
      cat ./tasks.sh | sudo bash -s reset
      ```

1. If the reset does not complete, delete the host VM and provision a new VM.

   The reset script might not complete successfully if the removal of the Kubernetes packages and host files from the node also damages the cluster itself.
   When the cluster is damaged, the tools used by the reset script, such as the kubectl command-line tool, can no longer communicate with the cluster and the script cannot complete.

## Reboot a Node

Rebooting a node is useful when you are performing maintenance on the operating system (OS) level of the node.
For example, after you perform a kernel update, you can reboot the node to apply the change to the OS.

To reboot a node on a cluster managed by kURL:

1. Run the EKCO shutdown script on the node:

   ```
   /opt/ekco/shutdown.sh
   ```

   The shutdown script deletes any Pods on the node that mount volumes provisioned by Rook. It also cordons the node, so that the node is marked as unschedulable and kURL does not start any new containers on the node. For more information, see [EKCO Add-on](/docs/add-ons/ekco).

1. Reboot the node.

## Remove a Node from Rook Ceph Clusters

As part of performing maintenance on a multi-node cluster managed by kURL, it is often required to remove a node from the cluster and replicate its data to a new node. For example, you might need to remove one or more nodes during hardware maintenance.

This section describes how to safely remove nodes from a kURL cluster that uses the Rook add-on for Rook Ceph storage. For more information about the Rook add-on, see [Rook Add-on](/docs/add-ons/rook).

For information about how to remove a node from a cluster that does not use Rook Ceph, see [kubectl drain](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/) in the Kubernetes documentation.

### Rook Ceph and etcd Node Removal Requirements

Review the following requirements and considerations before you remove one or more nodes from Rook Ceph and etcd clusters:

* **etcd cluster health**: To remove a primary node from etcd clusters, you must meet the following requirements to maintain etcd quorum:
  * You must have at least one primary node.
  * If you scale the etcd cluster to three primary nodes, you must then maintain a minimum of three primary nodes to maintain quorum.
* **Rook Ceph cluster health**: When you scale a Ceph Storage Cluster to three or more Ceph Object Storage Daemons (OSDs), such as when you add additional manager or worker nodes to the cluster, the Ceph Storage Cluster can no longer have fewer than three OSDs. If you reduce the number of OSDs to less than three in this case, then the Ceph Storage Cluster loses quorum.
* **Add a node before removing a node**: To remove and replace a node, it is recommended that you add a new node before removing the node.
For example, to remove one node in a three-node cluster, first add a new node to scale the cluster to four nodes. Then, remove the desired node to scale the cluster back down to three nodes.
* **Remove one node at a time**: If you need to remove multiple nodes from a cluster, remove one node at a time.

### Rook Ceph Cluster Prerequisites

Complete the following prerequisites before you remove one or more nodes from a Rook Ceph cluster:

* Upgrade Rook Ceph to v1.4 or later.

   The two latest minor releases of Rook Ceph are actively maintained. It is recommended to upgrade to the latest stable release available. For more information, see [Release Cycle](https://rook.io/docs/rook/v1.10/Getting-Started/release-cycle/) in the Rook Ceph documentation.

   Attempting to remove a node from a cluster that uses a Rook Ceph version earlier than v1.4 can cause Ceph to enter an unhealthy state. For example, see [Rook Ceph v1.0.4 is Unhealthy with Mon Pods Not Rescheduled](#rook-ceph-v104-is-unhealthy-with-mon-pods-not-rescheduled) under _Troubleshoot Node Removal_ below.

* In the kURL specification, set `isBlockStorageEnabled` to `true`. This is the default for Rook Ceph v1.4 and later.

* Ensure that you can access the ceph CLI from a Pod that can communicate with the Ceph Storage Cluster. To access the ceph CLI, you can do one of the following:

  * (Recommended) Use the `rook-ceph-tools` Pod to access the ceph CLI.
  Use the same version of the Rook toolbox as the version of Rook Ceph that is installed in the cluster.
  By default, the `rook-ceph-tools` Pod is included on kURL clusters with Rook Ceph v1.4 and later.
  For more information about `rook-ceph-tools` Pods, see [Rook Toolbox](https://rook.io/docs/rook/v1.10/Troubleshooting/ceph-toolbox/) in the Rook Ceph documentation.

  * Use `kubectl exec` to enter the `rook-ceph-operator` Pod, where the ceph CLI is available.

* (Optional) Open an interactive shell in the `rook-ceph-tools` or `rook-ceph-operator` Pod to run multiple ceph CLI commands in a row. For example:

   ```
   kubectl exec -it -n rook-ceph deployment/rook-ceph-tools -- bash
   ```

   If you do not create an interactive shell, precede each ceph CLI command in the `rook-ceph-tools` or `rook-ceph-operator` Pod with `kubectl exec`. For example:

   ```
   kubectl exec -it -n rook-ceph deployment/rook-ceph-tools -- ceph status
   ```

* Verify that Ceph is in a healthy state by running one of the following `ceph status` commands in the `rook-ceph-tools` Pod in the `rook-ceph` namespace:

  * **Rook Ceph v1.4.0 or later**:

      ```
      kubectl -n rook-ceph exec deployment/rook-ceph-tools -- ceph status
      ```

  * **Rook Ceph v1.0.0 to 1.3.0**:

      ```
      kubectl -n rook-ceph exec deployment/rook-ceph-operator -- ceph status
      ```

      **Note**: It is not recommended to use versions of Rook Ceph earlier than v1.4.0.

      The output of the command shows `health: HEALTH_OK` if Ceph is in a healthy state.

### (Recommended) Manually Rebalance Ceph and Remove a Node

This procedure ensures that the data held in Rook Ceph is safely replicated to a new node before you remove a node.
Rebalancing your data is critical for preventing data loss that can occur when removing a node if the data stored in Ceph has not been properly replicated.

To manually remove a node, you first use the Ceph CLI to reweight the Ceph OSD to `0` on the node that you want to remove and wait for Ceph to rebalance the data across OSDs.
Then, you can remove the OSD from the node, and finally remove the node.

**Note**: The commands in this procedure assume that you created an interactive shell in the `rook-ceph-tools` or `rook-ceph-operator` Pod.  It also helps to have another shell to use `kubectl` commands at the same time.
For more information, see [Rook Ceph Cluster Prerequisites](#rook-ceph-cluster-prerequisites) above.

To manually rebalance data and remove a node:

1. Review the [Rook Ceph and etcd Node Removal Requirements](#rook-ceph-and-etcd-node-removal-requirements) above.

1. Complete the [Rook Ceph Cluster Prerequisites](#rook-ceph-cluster-prerequisites) above.

1. Add the same number of new nodes to the cluster that you intended to remove.
For example, if you intend to remove a total of two nodes, add two new nodes.

   Ceph rebalances the existing placement groups to the new OSDs.

1. After Ceph completes rebalancing, run the following command to verify that Ceph is in a healthy state:

   ```
   ceph status
   ```

1. Run the following command to display a list of all the OSDs in the cluster and their associated nodes:

   ```
   ceph osd tree
   ```

   **Example output**:

   ```
   [root@rook-ceph-tools-54ff78f9b6-gqsfm /]# ceph osd tree

   ID   CLASS  WEIGHT   TYPE NAME                       STATUS  REWEIGHT  PRI-AFF
   -1         0.97649  root default
   -3         0.19530      host node00.foo.com
   0    hdd  0.19530          osd.0                       up   1.00000  1.00000
   -7         0.19530      host node01.foo.com
   2    hdd  0.19530          osd.1                       up   1.00000  1.00000
   -5         0.19530      host node02.foo.com
   1    hdd  0.19530          osd.2                       up   1.00000  1.00000
   -9         0.19530      host node03.foo.com
   3    hdd  0.19530          osd.3                       up   1.00000  1.00000
   -11         0.19530      host node04.foo.com
   4    hdd  0.19530          osd.4                       up   1.00000  1.00000
   ```

1. Run the following command to reweight the OSD to `0` on the first node that you intend to remove:

   ```
   ceph osd reweight OSD_ID 0
   ```

   Replace `OSD_ID` with the Ceph OSD on the node that you intend to remove. For example, `ceph osd reweight 1 0`.

   Ceph rebalances the placement groups off the OSD that you specify in the `ceph osd reweight` command.
   To view progress, run `ceph status`, or `watch ceph status`.  Ceph may display a HEALTH_WARN state during the rebalance, but will return to HEALTH_OK once complete.

   **Example output**:

   ```
   [root@rook-ceph-tools-54ff78f9b6-gqsfm /]# watch ceph status
   cluster:
      id:     5f0d6e3f-7388-424d-942b-4bab37f94395
      health: HEALTH_WARN
               Degraded data redundancy: 1280/879 objects degraded (145.620%), 53 pgs degraded
   ...
   progress:
      Rebalancing after osd.2 marked out (15s)
         [=====================.......] (remaining: 4s)
      Rebalancing after osd.1 marked out (5s)
         [=============...............] (remaining: 5s)
   ```

1. After the `ceph osd reweight` command completes, run the following command to verify that Ceph is in a healthy state:

   ```
   ceph status
   ```

1. Then, run the following command to mark the OSD as `down`:

   ```
   ceph osd down OSD_ID
   ```

   Replace `OSD_ID` with the Ceph OSD on the node that you intend to remove. For example, `ceph osd down 1`.  Note: it may not report as down until after the next step.

1. In another terminal, outside of the `rook-ceph-tools` pod run the following kubectl command to scale the corresponding OSD deployment to 0 replicas:

   ```
   kubectl scale deployment -n rook-ceph OSD_DEPLOYMENT --replicas 0
   ```

   Replace `OSD_DEPLOYMENT` with the name of the Ceph OSD deployment. For example, `kubectl scale deployment -n rook-ceph rook-ceph-osd-1 --replicas 0`.

1. Back in the `rook-ceph-tools` pod, run the following command to ensure that the OSD is safe to remove:

   ```
   ceph osd safe-to-destroy osd.OSD_ID
   ```

   Replace `OSD_ID` with the ID of the OSD. For example, `ceph osd safe-to-destroy osd.1`.

   **Example output**:

   ```
   OSD(s) 1 are safe to destroy without reducing data durability.
   ```

1. Purge the OSD from the Ceph cluster:

   ```
   ceph osd purge OSD_ID --yes-i-really-mean-it
   ```

   Replace `OSD_ID` with the ID of the OSD. For example, `ceph osd purge 1 --yes-i-really-mean-it`.

   **Example output**:

   ```
   purged osd.1
   ```

1. Outside of the `rook-ceph-tools` pod, delete the OSD deployment:

   ```
   kubectl delete deployment -n rook-ceph OSD_DEPLOYMENT
   ```

   Replace `OSD_DEPLOYMENT` with the name of the Ceph OSD deployment. For example, `kubectl delete deployment -n rook-ceph rook-ceph-osd-1`.

1. Remove the node.

Repeat the steps in this procedure for any remaining nodes that you want to remove. Always verify that Ceph is in a HEALTH_OK state before making changes to Ceph.

### Remove Nodes with EKCO

You can use EKCO add-on scripts to programmatically cordon and purge a node so that you can then remove the node from the cluster.

_**Warnings**_: Consider the following warnings about data loss before you proceed with this procedure:

* **Ceph health**: The EKCO scripts in this procedure provide a quick method for cordoning a node and purging Ceph OSDs so that you can remove the node. This procedure is _not_ recommended unless you are able to confirm that Ceph is in a healthy state. If Ceph is not in a healthy state before you remove a node, you risk data loss.

     To verify that Ceph is in a healthy state, run the following `ceph status` command in the `rook-ceph-tools` or `rook-ceph-operator` Pod in the `rook-ceph` namespace for Rook Ceph v1.4 or later:

     ```
     kubectl -n rook-ceph exec deploy/rook-ceph-tools -- ceph status
     ```

* **Data replication**: A common Ceph configuration is three data replicas across three Ceph OSDs.
  It is possible for Ceph to report a healthy status without data being replicated properly across all OSDs.
  For example, in a single-node cluster, there are not multiple machines where Ceph can replicate data.
  In this case, even if Ceph reports healthy, removing a node results in data loss because the data was not properly replicated across multiple OSDs on multiple machines.

     If you are not certain that Ceph data replication was configured and completed properly, or if Ceph is not in a healthy state, it is recommended that you first rebalance the data off the node that you intend to remove to avoid data loss.
     For more information, see [(Recommended) Manually Rebalance Ceph and Remove a Node](#recommended-manually-rebalance-ceph-and-remove-a-node) above.

To use the EKCO add-on to remove a node:

1. Review the [Rook Ceph and etcd Node Removal Requirements](#rook-ceph-and-etcd-node-removal-requirements) above.

1. Complete the [Rook Ceph Cluster Prerequisites](#rook-ceph-cluster-prerequisites) above.

1. Verify that Ceph is in a healthy state before you proceed. Run the following `ceph status` command in the `rook-ceph-tools` or `rook-ceph-operator` Pod in the `rook-ceph` namespace for Rook Ceph v1.4 or later:

   ```
   kubectl -n rook-ceph exec deploy/rook-ceph-tools -- ceph status
   ```

1. Run the EKCO shutdown script on the node:

   ```
   /opt/ekco/shutdown.sh
   ```

   The shutdown script deletes any Pods on the node that mount volumes provisioned by Rook.
   It also cordons the node, so that the node is marked as unschedulable and kURL does not start any new containers on the node. For more information, see [EKCO Add-on](/docs/add-ons/ekco).

1. Power down the node.

1. On another primary node in the cluster, run the EKCO purge script for the node that you intend to remove:

   ```
   ekco-purge-node NODE_NAME
   ```

   Replace `NODE_NAME` with the name of the node that you powered down in the previous step.

   The EKCO purge script For information about the EKCO purge script, see [Purge Nodes](/docs/add-ons/ekco#purge-nodes) in _EKCO Add-on_.

1. Remove the node from the cluster.

## Troubleshoot Node Removal

This section includes information about troubleshooting issues with node removal in Rook Ceph clusters.

### Rook Ceph v1.0.4 is Unhealthy with Mon Pod Pending

#### Symptom

After you remove a node from a Rook Ceph v1.0.4 cluster and you run `kubectl -n rook-ceph exec deployment.apps/rook-ceph-operator -- ceph status`, you see that Ceph is in an unhealthy state where a Ceph monitor (mon) is down.

For example:

```
health: HEALTH_WARN
        1/3 mons down, quorum a,c
```

Additionally, under `services`, one or more are out of quorum:

```
services:
  mon: 3 daemons, quorum a,c (age 5min), out of quorum: b
```

When you run `kubectl -n rook-ceph get pod -l app=rook-ceph-mon`, you see that the mon pod is in a Pending state.

For example:

```
NAME             READY  STATUS   RESTARTS  AGE
rook-ceph-mon-a  1/1    Running  0         20m
rook-ceph-mon-b  0/1    Pending  0         9m45s
rook-ceph-mon-c  1/1    Running  0         13m
```

#### Cause

This is caused by an issue in Rook Ceph v1.0.4 where the rook-ceph-mon-endpoints ConfigMap still maps a node that was removed.

#### Workaround

To address this issue, you must return the Ceph cluster to a healthy state and upgrade to Rook Ceph v1.4 or later.

To return Ceph to a healthy state so that you can upgrade, manually delete the mapping to the removed node from the rook-ceph-mon-endpoints ConfigMap then rescale the operator.

To return Ceph to a healthy state and upgrade:

1. Stop the Rook Ceph operator:

   ```
   kubectl -n rook-ceph scale --replicas=0 deployment.apps/rook-ceph-operator
   ```

1. Edit the rook-ceph-mon-endpoints ConfigMap to delete the removed node from the `mapping`:

   ```
   kubect -n rook-ceph edit configmaps rook-ceph-mon-endpoints
   ```

  _**Warning**_: Ensure that you remove the correct rook-ceph-mon-endpoint from the `mapping` field in the ConfigMap. Removing the wrong rook-ceph-mon-endpoint can cause unexpected behavior, including data loss.

1. Find the name of the Pending mon pod:

   ```
   kubectl -n rook-ceph get pod -l app=rook-ceph-mon
   ```

1. Delete the Pending mon pod:

   ```
   kubectl -n rook-ceph delete pod MON_POD_NAME
   ```

   Replace `MON_POD_NAME` with the name of the mon pod that is in a Pending state from the previous step.

1. Rescale the operator:

   ```
   kubectl -n rook-ceph scale --replicas=1 deployment.apps/rook-ceph-operator
   ```

1. Verify that all mon pods are running:

   ```
   kubectl -n rook-ceph get pod -l app=rook-ceph-mon
   ```

   The output of this command shows that each mon pod has a `Status` of `Running`.

1. Verify that Ceph is in a healthy state:

   ```
   kubectl -n rook-ceph exec deployment.apps/rook-ceph-operator -- ceph status
   ```

   The output of this command shows `health: HEALTH_OK` if Ceph is in a healthy state.

1. After confirming that Ceph is in a healthy state, upgrade Rook Ceph to v1.4 or later before attempting to manage nodes in the cluster.

For more information about these steps, see [Managing nodes when the previous Rook version is in use might leave Ceph in an unhealthy state where mon pods are not rescheduled](https://community.replicated.com/t/managing-nodes-when-the-previous-rook-version-is-in-use-might-leave-ceph-in-an-unhealthy-state-where-mon-pods-are-not-rescheduled/1099/1) in _Replicated Community_.
