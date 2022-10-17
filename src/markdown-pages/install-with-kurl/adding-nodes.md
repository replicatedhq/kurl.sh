---
path: "/docs/install-with-kurl/adding-nodes"
date: "2019-12-19"
weight: 19
linktitle: "Adding Nodes"
title: "Adding Nodes"
---

This topic describes how to add nodes to kURL clusters.
For information about managing nodes on kURL clusters, including removing, rebooting, and resetting nodes, see [Managing Nodes](/docs/install-with-kurl/managing-nodes).

## About Adding Nodes
At the end of the install process, the install script will print out commands for adding nodes.
Commands to add new secondary nodes last 24 hours, and commands to add additional primary nodes in HA mode last for 2 hours.
To get new commands, run `tasks.sh join_token` with the relevant parameters (`airgap` and `ha`) on a primary node.
For instance, on an airgapped HA installation you would run `cat ./tasks.sh | sudo bash -s join_token ha airgap`, while on a single-primary online installation you would run `curl -sSL https://kurl.sh/latest/tasks.sh | sudo bash -s join_token`.

### Standard Installations
The install script will print the command that can be run on **secondary** nodes to join them to your new cluster.

![add-nodes](/add-nodes.png)

### HA Installations
For HA clusters, the install script will print out separate commands for joining **secondaries** and joining additional **primary** nodes.
See [Highly Available K8s](/docs/install-with-kurl/#highly-available-k8s-ha) for HA install details.

![add-nodes-ha](/add-nodes-ha.png)
