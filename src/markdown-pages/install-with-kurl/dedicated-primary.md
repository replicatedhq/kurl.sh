---
path: "/docs/install-with-kurl/dedicated-primary"
date: "2021-05-14"
weight: 21
linktitle: "Dedicated Primary"
title: "Dedicated Primary"
---

The first node kURL is installed on will always be a primary node running Kubernetes control-plane components, including etcd.
A common practice is to taint all primary nodes to prevent most pods from being scheduled on them.
The kURL installer does not taint primaries by default because single-node installs must be capable of scheduling all pods.

Once a secondary node has been joined to a cluster, it's possible to taint the primary nodes with the following command:

### Airgap

```bash
cat tasks.sh | sudo bash -s taint_primaries
```

### Online

```bash
curl -L https://k8s.kurl.sh/latest/tasks.sh | sudo bash -s taint_primaries
```

**Limitations**: Currently the only supported CSI plugin for dedicated primaries is Rook versions 1.4.3+.

### Rook

Production installations with the [Rook add-on](/docs/add-ons/rook) should use tainted primaries to avoid scheduling pods consuming Rook storage volumes on the same nodes where OSDs are running.
By default, Rook 1.4.3+ will start an OSD on all nodes where an available block device is found, including secondary nodes.
Use this procedure to ensure OSDs are scheduled only on tainted primaries to avoid problems with colocation:

1. Install a kURL cluster with one or more primaries, each having a block device. The [EKCO add-on](/docs/add-ons/ekco) will automatically configure Rook to use all primary nodes for storage.
2. Before joining a secondary node, reconfigure EKCO to stop automatically using new nodes for storage. Run `kubectl -n kurl edit configmap ekco-config` and change `maintain_rook_storage_nodes` to `false` and set `max_ceph_pool_replication` to the number of primaries in the cluster, up to a max of 3. Run `kubectl -n kurl delete pod --selector=app=ekc-operator` after the changes to the config map are applied.
3. Join one or more secondary nodes without a block device. Ignore the host preflight warning that no available block device was found on the node.
4. Taint the primaries: `cat tasks.sh | sudo bash -s taint_primaries` or online `curl -L https://k8s.kurl.sh/latest/tasks.sh | sudo bash -s taint_primaries`
5. Confirm pods consuming PVCs provisioned by Rook have been moved to secondary nodes by running `lsblk` on all nodes. No `rbd` devices should be shown on primary nodes.
6. Confirm pods consuming the Rook shared filesystem have been moved to secondary nodes by running `cat /proc/mounts | grep 6789`. That command should have no output on primary nodes.
