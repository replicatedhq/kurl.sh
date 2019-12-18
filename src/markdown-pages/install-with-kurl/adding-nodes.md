---
path: "/docs/install-with-kurl/adding-nodes"
date: "2019-12-19"
weight: 3
linktitle: "Adding Nodes"
title: "Adding Nodes"
---
At the end of the install process, the install script will print out commands for adding nodes. These commands will be valid for 2 hours. To get new commands, re-run the install script on the master node.

## Standard Installations
The install script will print the command that can be run on **worker** nodes to join them to your new cluster.
![add-nodes](/add-nodes.png)

## HA Installations
For HA clusters, the install script will print out separate commands for joining **workers** and joining additional **master** nodes.
![add-nodes-ha](/add-nodes-ha.png)
