---
path: "/docs/install-with-kurl/adding-nodes"
date: "2019-12-19"
weight: 13
linktitle: "Adding Nodes"
title: "Adding Nodes"
---
At the end of the install process, the install script will print out commands for adding nodes.
Commands to add new worker nodes last 24 hours, and commands to add additional master nodes in HA mode last for 2 hours.
To get new commands, run `tasks.sh join_token` with the relevant parameters (`airgap` and `ha`) on a master node.
For instance, on an airgapped HA installation you would run `cat ./tasks.sh | sudo bash -s join_token ha airgap`, while on a single-master online installation you would run `curl -sSL https://kurl.sh/latest/tasks.sh | sudo bash -s join_token`.

## Standard Installations
The install script will print the command that can be run on **worker** nodes to join them to your new cluster.
![add-nodes](/add-nodes.png)

## HA Installations
For HA clusters, the install script will print out separate commands for joining **workers** and joining additional **master** nodes. 
See [Highly Available K8s](/docs/install-with-kurl/#highly-available-k8s-ha) for HA install details.
![add-nodes-ha](/add-nodes-ha.png)
