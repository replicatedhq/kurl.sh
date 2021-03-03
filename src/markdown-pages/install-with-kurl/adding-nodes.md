---
path: "/docs/install-with-kurl/adding-nodes"
date: "2019-12-19"
weight: 13
linktitle: "Adding Nodes"
title: "Adding Nodes"
---
At the end of the install process, the install script will print out commands for adding nodes.
Commands to add new secondary nodes last 24 hours, and commands to add additional primary nodes in HA mode last for 2 hours.
To get new commands, run `tasks.sh join_token` with the relevant parameters (`airgap` and `ha`) on a primary node.
For instance, on an airgapped HA installation you would run `cat ./tasks.sh | sudo bash -s join_token ha airgap`, while on a single-primary online installation you would run `curl -sSL https://kurl.sh/latest/tasks.sh | sudo bash -s join_token`.

## Standard Installations
The install script will print the command that can be run on **secondary** nodes to join them to your new cluster.

![add-nodes](/add-nodes.png)

## HA Installations
For HA clusters, the install script will print out separate commands for joining **secondaries** and joining additional **primary** nodes. 
See [Highly Available K8s](/docs/install-with-kurl/#highly-available-k8s-ha) for HA install details.

![add-nodes-ha](/add-nodes-ha.png)

## Resetting a Node

It is possible to reset a node using the following script:

*NOTE: The provided script is best effort and is not guaranteed to fully reset the node.*

```bash
curl -sSL https://kurl.sh/latest/tasks.sh | sudo bash -s reset
```

Or for airgap:

```bash
cat ./tasks.sh | sudo bash -s reset
```

## Rebooting a Node

To safely reboot a node, use the following steps:

*NOTE: In order to safely reboot a node it is required to have the [EKCO addon](/docs/add-ons/ekco) installed.*

1. Run `/opt/ekco/shutdown.sh` on the node.
1. Reboot the node

## Removing a Node

It is possible to remove a node from a multi-node cluster.
In order to safely remove a node it is required to have the [EKCO addon](/docs/add-ons/ekco) installed.
When removing a node it is always safest to add back a node or check the health of the cluster before removing an additional node.

When removing a node it is safest to use the following steps:

1. Run `/opt/ekco/shutdown.sh` on the node.
1. Power down the node or run the [reset script](/docs/install-with-kurl/adding-nodes#resetting-a-node)
1. Run `ekco-purge-node [node name]` on another primary.

### Etcd Cluster Health

When removing a primary node extra precautions must be taken to maintain etcd quorom.

First, there must always be at least one primary node.

Once scaled up to three primary nodes, a minimum of three primaries must be maintained to maintain quorom.
If the cluster is scaled down to two primaries, a third primary should be added back to prevent loss of quorom.

### Ceph Cluster Health

When using the [Rook add-on](/docs/add-ons/rook) extra precautions must be taken to avoid data loss.

On a one or two node cluster, the size of the Ceph cluster will always be one.

Once the cluster is scaled up to three nodes, the Ceph cluster must be maintained at three nodes.
If a Ceph Object Storage Daemon (OSD) is scheduled on a node that is removed, Ceph cluster health must be regained before removing any additional nodes.
Once the node is removed, Ceph will begin replicating its data to OSDs on remaining nodes.
If the cluster is scaled below three, a new node must be added to regain cluster health.

It is possible to check the Ceph cluster health by running the command `ceph status` in the `rook-ceph-tools` or `rook-ceph-operator` Pod in the `rook-ceph` namespace for Rook version 1.0.x or 1.4.x respectively.

**Rook 1.4.x**

```
kubectl -n rook-ceph exec deploy/rook-ceph-tools -- ceph status
```

**Rook 1.0.x**

```
kubectl -n rook-ceph exec deploy/rook-ceph-operator -- ceph status
```
