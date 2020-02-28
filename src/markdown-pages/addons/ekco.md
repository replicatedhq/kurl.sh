---
path: "/docs/add-ons/ekco"
date: "2020-02-27"
linktitle: "EKCO Add-On"
weight: 27
title: "Embedded kURL Cluster Operator (EKCO) Add-On"
---

The [EKCO](https://github.com/replicatedhq/ekco) add-on is a utility tool to perform maintenance operations on a kURL cluster.

The Kurl add-on installs:
* The EKCO operator into the kurl namespace

## Advanced Install Options

```yaml
spec:
  ekco:
    version: "v0.1.0"
    nodeUnreachableTolerationDuration: 1h
    minReadyMasterNodeCount: 2
    minReadyWorkerNodeCount: 0
    rook:
      shouldMaintainStorageNodes: true
```

| Flag | Usage |
| ---- | ----- |
| ekco-node-unreachable-toleration-duration | How long a Node must be unreachable before considered dead. Default is 1h. |
| ekco-min-ready-master-node-count | Don't purge the node if it will result in less than this many ready masters. Default is 2. |
| ekco-min-ready-worker-node-count | Don't purge the node if it will result in less than this many ready workers. Default is 0. |
| ekco-disable-should-maintain-rook-storage-nodes | Whether to maintain the list of nodes to use in the CephCluster config. Default is true when rook addon is installed. |

## Operator Tasks

This section describes maintenance tasks that the EKCO operator performs.

### Purge nodes

In an HA Kubernetes cluster the EKCO operator will automatically purge failed nodes that have been unreachable for more than `node_unreachable_toleration` (default 1h). The following steps will be taken during a purge:

1. Delete the Deployment resource for the OSD from the rook-ceph namespace
1. Exec into the Rook operator pod and run the command `ceph osd purge <id>`
1. Delete the Node resource
1. Remove the node from the CephCluster resource named rook-ceph in the rook-ceph namespace unless storage is managed automatically with `useAllNodes: true`
1. (Masters only) Connect to the etcd cluster and remove the peer
1. (Masters only) Remove the apiEndpoint for the node from the kubeadm-config ConfigMap in the kube-system namespace

#### Manual Node Purge

A command will be made available on all master nodes to manually purge a node. This command takes a parameter `[name]` of the node you would like to purge. The command will inherit all configuration from the EKCO operator running in the cluster.

```bash
$ ekco-purge-node --help
Manually purge a Kurl cluster node

Usage:
  ekco purge-node [name] [flags]

Flags:
      --certificates_dir string       Kubernetes certificates directory (default "/etc/kubernetes/pki")
  -h, --help                          help for purge-node
      --maintain_rook_storage_nodes   Add and remove nodes to the ceph cluster and scale replication of pools
      --min_ready_master_nodes int    Minimum number of ready master nodes required for auto-purge (default 2)
      --min_ready_worker_nodes int    Minimum number of ready worker nodes required for auto-purge

Global Flags:
      --config string      Config file (default is /etc/ekco/config.yaml)
      --log_level string   Log level (default "info")
```

### Rook

The EKCO operator is responsible for appending nodes to the CephCluster `storage.nodes` setting to include the node in the list of nodes used by Ceph for storage. This operation will only append nodes. Removing nodes is done during purge.

EKCO is also responsible for adjusting the Ceph block pool, filesystem and object store replication factor up and down in accordance with the size of the cluster from `min_ceph_pool_replication` (default 1) to `max_ceph_pool_replication` (default 3).
