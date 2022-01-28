---
path: "/docs/add-ons/ekco"
date: "2020-02-27"
linktitle: "EKCO Add-On"
weight: 34
title: "Embedded kURL Cluster Operator (EKCO) Add-On"
addOn: "ekco"
---

The [EKCO](https://github.com/replicatedhq/ekco) add-on is a utility tool to perform maintenance operations on a kURL cluster.

The Kurl add-on installs:
* The EKCO operator into the kurl namespace

## Advanced Install Options

```yaml
spec:
  ekco:
    version: "latest"
    nodeUnreachableToleration: 1h
    minReadyMasterNodeCount: 2
    minReadyWorkerNodeCount: 0
    rookShouldUseAllNodes: true
    shouldDisableRebootServices: true
    shouldDisableClearNodes: false
    shouldEnablePurgeNodes: false
    autoUpgradeSchedule: Sat 17:30
    enableInternalLoadBalancer: true
```

flags-table

## Operator Tasks

This section describes maintenance tasks that the EKCO operator performs.

### Clear nodes

The clear nodes feature ensures that pods running on a node that becomes unreachable are quickly rescheduled to healthy nodes.
When a node is unreachable for more than forty seconds, Kubernetes will change the node's ready status to `Unknown`.
After five minutes in the Unknown state, Kubernetes will delete all pods on the unreachable node so they can be rescheduled on healthy nodes.
The deleted pods are likely to remain in the Terminating state since kubelet will not be reachable to confirm the pods have stopped.
If a pod mounts a PVC it will maintain its lock on the PVC while stuck in the Terminating state and replacement pods will not be able to start.
This can cause applications using PVCs to be unavailable longer than the five minute grace period applied by Kubernetes.

To avoid extended downtime, the EKCO operator will watch for nodes in the Unknown state for more than five minutes and force delete all pods on them that have been terminating for at least thirty seconds.
Along with the 5 minute 40 second latency period before Kubernetes begins deleting pods on unreachable nodes, this means a minimum of 6 minutes 10 seconds will pass before pods can begin to be rescheduled.
In practice pods take 7 to 10 minutes to be rescheduled due to a variety of factors, such as whether EKCO itself was on the lost node and image pull times on the healthy nodes.

The clear node feature is a safer alternative to the purge node feature and is enabled by default.
When using the clear node and a node is lost, the cluster will be degraded until the node is cleaned up.
In a degraded state new nodes will not be able to join the cluster, the cluster cannot be upgraded, and cluster components will report health warnings.
Refer to the command [below](/docs/add-ons/ekco#manual-node-purge) for manually purging a lost node.

### Purge nodes

When enabled, the EKCO operator will automatically purge failed nodes that have been unreachable for more than `node_unreachable_toleration` (default 5m). The following steps will be taken during a purge:

1. Delete the Deployment resource for the OSD from the rook-ceph namespace
1. Exec into the Rook operator pod and run the command `ceph osd purge <id>`
1. Delete the Node resource
1. Remove the node from the CephCluster resource named rook-ceph in the rook-ceph namespace unless storage is managed automatically with `useAllNodes: true`
1. (Primaries only) Connect to the etcd cluster and remove the peer
1. (Primaries only) Remove the apiEndpoint for the node from the kubeadm-config ConfigMap in the kube-system namespace

#### Manual Node Purge

A command will be made available on all primary nodes to manually purge a node. This command takes a parameter `[name]` of the node you would like to purge. The command will inherit all configuration from the EKCO operator running in the cluster.

```bash
$ ekco-purge-node --help
Manually purge a Kurl cluster node

Usage:
  ekco purge-node [name] [flags]

Flags:
      --certificates_dir string       Kubernetes certificates directory (default "/etc/kubernetes/pki")
  -h, --help                          help for purge-node
      --maintain_rook_storage_nodes   Add and remove nodes to the ceph cluster and scale replication of pools
      --min_ready_master_nodes int    Minimum number of ready primary nodes required for auto-purge (default 2)
      --min_ready_worker_nodes int    Minimum number of ready secondary nodes required for auto-purge

Global Flags:
      --config string      Config file (default is /etc/ekco/config.yaml)
      --log_level string   Log level (default "info")
```

### Rook

The EKCO operator is responsible for appending nodes to the CephCluster `storage.nodes` setting to include the node in the list of nodes used by Ceph for storage. This operation will only append nodes. Removing nodes is done during purge.

EKCO is also responsible for adjusting the Ceph block pool, filesystem and object store replication factor up and down in accordance with the size of the cluster from `min_ceph_pool_replication` (default 1) to `max_ceph_pool_replication` (default 3).

### TLS Certificate Rotation

EKCO supports automatic certificate rotation for the [registry add-on](/docs/install-with-kurl/setup-tls-certs#registry) and the [Kubernetes control plane](/docs/install-with-kurl/setup-tls-certs#kubernetes-control-plane) since version 0.5.0 and for the [KOTS add-on](/docs/install-with-kurl/setup-tls-certs#kots-tls-certificate-renewal) since version 0.7.0.

### Reboot

EKCO installs the `ekco-reboot.service` to safely unmount pod volumes before system shutdown.
This service runs `/opt/ekco/shutdown.sh` when it is stopped, which happens automatically when the system begins to shutdown.
The shutdown script deletes pods on the current node that mount volumes provisioned by Rook and cordons the node.

When the `ekco-reboot.service` is started it runs `/opt/ekco/startup.sh`.
This happens automatically when the system starts after docker is running.
This script uncordons the node.

The shutdown script may fail to complete because it depends on services running on the node to be available to delete pods, but these services may already be shutting down.
To avoid race conditions, manually run the ekco-reboot service's shutdown script prior to proceeding with system shutdown or reboot:

```bash
/opt/ekco/shutdown.sh
```

### Internal Load Balancer

EKCO 0.11.0+ can maintain an internal load balancer forwarding all traffic from host port 6444 to one of the Kubernetes API server pods.
To do this, EKCO runs HAProxy as a [static pod](https://kubernetes.io/docs/tasks/configure-pod-container/static-pod/) on all nodes.
EKCO ensures that when new nodes are added and removed from the cluster that the correct HAProxy configuration is applied on all nodes.

### Auto-Upgrades (Experimental)

If an auto-upgrade schedule is included in your kURL spec and the end user passes the `auto-upgrades-enabled` flag to the install script, a systemd service named `ekco-upgrade` will be installed to automatically check for and install updates to Kubernetes and add-ons.
The schedule must be a valid [systemd calendar event time](https://manpages.debian.org/testing/systemd/systemd.time.7.en.html#CALENDAR_EVENTS).
This feature is available in version 0.8.0+.

### Example

The following spec and command would enable auto-upgrades for an installation:

```yaml
spec:
  ekco:
    version: "latest"
    autoUpgradeSchedule: Sat 17:30
```

```bash
curl -sSL https://kurl.sh/<installer-id> | sudo bash -s auto-upgrades-enabled
```


#### Limitations

Auto-upgrades are only supported on single-node online installations.
This feature is only relevant for named installers that may have changes to kURL specs without changes to the url where the spec is hosted.

#### Troubleshooting

To view the logs from the last attempted upgrade, use the following command:

```bash
journalctl -u ekco-upgrade.service
```

Use this command to see the previous and next scheduled upgrade times for the ekco-upgrade service:

```bash
systemctl list-timers
```

### Auto Resource Scaling

With auto resource scaling, EKCO automatically scales some cluster resources that 
were installed by kURL to the specified replica count.

Auto resource scaling is useful because a subset of cluster resources require that all
nodes join the cluster before the desired replica count can be fulfilled. This can cause
issues such as false positives in health check error reporting.

Auto resource scaling helps to avoid issues like this by scaling this subset of custom
resources to the specified replica count without requiring that all nodes join the cluster.

Auto resource scaling is available in v0.13.0 and later.
