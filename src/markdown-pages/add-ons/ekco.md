---
path: "/docs/add-ons/ekco"
date: "2020-02-27"
linktitle: "EKCO"
weight: 37
title: "Embedded kURL Cluster Operator (EKCO) Add-On"
addOn: "ekco"
---

The [EKCO](https://github.com/replicatedhq/ekco) add-on is a utility tool to perform maintenance operations on a kURL cluster.

The kURL add-on installs the EKCO operator into the kURL namespace.

## Advanced Install Options

```yaml
spec:
  ekco:
    version: "latest"
    nodeUnreachableToleration: 1h
    minReadyMasterNodeCount: 2
    minReadyWorkerNodeCount: 0
    rookShouldUseAllNodes: true
    rookShouldDisableReconcileMDSPlacement: false
    rookShouldDisableReconcileCephCSIResources: false
    shouldDisableRebootServices: true
    shouldDisableClearNodes: false
    shouldEnablePurgeNodes: false
    enableInternalLoadBalancer: true
    shouldDisableRestartFailedEnvoyPods: false
    envoyPodsNotReadyDuration: 5m
    minioShouldDisableManagement: false
```

flags-table

## Operator Tasks

This section describes maintenance tasks that the EKCO operator performs.

### Clear nodes

The clear nodes feature ensures that pods running on an unreachable node are quickly rescheduled to healthy nodes.
When a node is unreachable for more than forty seconds, Kubernetes changes the node's ready status to `Unknown`.
After five minutes in the Unknown state, Kubernetes deletes all of the pods on the unreachable node so they can be rescheduled on healthy nodes.
The deleted pods typically remain in the Terminating state since kubelet is not reachable to confirm that the pods have stopped.
If a pod mounts a PVC, it maintains its lock on the PVC while stuck in the Terminating state and replacement pods are not able to start.
This can cause applications using PVCs to be unavailable longer than the five minute grace period applied by Kubernetes.

To avoid extended downtime, the EKCO operator watches for nodes in the Unknown state for more than five minutes and force deletes all pods on those nodes that have been terminating for at least 30 seconds. This 30 seconds, in addition to the 5 minute 40 second latency period before Kubernetes begins deleting pods on unreachable nodes, means that a minimum of 6 minutes 10 seconds passes before pods can begin to be rescheduled.
In practice, pods take 7 to 10 minutes to be rescheduled due to a variety of factors, such as whether EKCO itself was on the lost node and the image pull times on the healthy nodes.

The clear node feature is a safer alternative to the purge node feature and is enabled by default.
When using the clear node feature and a node is lost, the cluster is degraded until the node is cleaned up.
In a degraded state, new nodes cannot join the cluster, the cluster cannot be upgraded, and cluster components report health warnings.
For more information, see to the command [below](/docs/add-ons/ekco#manual-node-purge) for manually purging a lost node.

### Purge nodes

When enabled, the EKCO operator automatically purges failed nodes that have been unreachable for more than `node_unreachable_toleration` (**Default:** 5 minutes).

The following steps are taken during a purge:

1. Delete the Deployment resource for the OSD from the rook-ceph namespace.
1. Exec into the Rook operator pod and run the command `ceph osd purge <id>`.
1. Delete the Node resource.
1. Remove the node from the CephCluster resource named rook-ceph in the rook-ceph namespace unless storage is managed automatically with `useAllNodes: true`.
1. (Primaries only) Connect to the etcd cluster and remove the peer.
1. (Primaries only) Remove the apiEndpoint for the node from the kubeadm-config ConfigMap in the kube-system namespace.

#### Manual Node Purge

A command is made available on all primary nodes to manually purge a node. This command takes a parameter `[name]` of the node that you want to purge. The command inherits all of the configuration from the EKCO operator running in the cluster.

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

The EKCO operator is responsible for appending nodes to the CephCluster `storage.nodes` setting to include the node in the list of nodes used by Ceph for storage. This operation only appends nodes. Removing nodes is done during the purge.

EKCO is also responsible for adjusting the Ceph block pool, filesystem, and object store replication factor up and down in accordance with the size of the cluster from `min_ceph_pool_replication` (**Default:** 1) to `max_ceph_pool_replication` (**Default:** 3).

In order to allow for single node Rook clusters, the kURL install script makes the pod anti-affinity rules less strict for the Rook MDS daemons.
Once the cluster is scaled beyond one node, EKCO will revert this change in anti-affinity and rebalance the MDS pods.
This functionality can be disabled by setting the `ekco.rookShouldDisableReconcileMDSPlacement` property to `true`.

Additionally, the kURL script will omit resource requests and limits for Ceph CSI provisioner and plugin Pods.
Once the cluster is scaled to three Nodes, and thus has enough capacity, EKCO will set the requests and limits to their recommended quantities. This functionality can be disabled by setting the `ekco.rookShouldDisableReconcileCephCSIResources` property to `true`.

### Contour

The EKCO operator will forcefully delete Envoy pods that change from a ready state to one where the Envoy container is not ready and have been in that state for at least 5 minutes.
This has been added to work around a [known issue](https://github.com/projectcontour/contour/issues/3192) that may be caused by resource contention.
This functionality can be disabled by setting the `ekco.shouldDisableRestartFailedEnvoyPods` property to `true`.
The duration can be adjusted by changing the `ekco.envoyPodsNotReadyDuration` property.

### Manage MinIO with EKCO

When you install kURL with `ekco.minioShouldDisableManagement` set to `false`, the EKCO operator manages data in the MinIO deployment to ensure that the data is properly replicated and has high availability.

To manage data in MinIO, the EKCO operator first enables a high availability six-replica StatefulSet when at least three nodes are healthy and the OpenEBS localpv storage class is available.

Then, EKCO migrates data from the original MinIO deployment to the StatefulSet before deleting the data. MinIO is temporarily unavailable while the data migration is in progress.

After the StatefulSet is running, EKCO ensures that replicas are evenly distributed across nodes.

To disable EKCO's management of data in MinIO, set `ekco.minioShouldDisableManagement` to `true`.

### TLS Certificate Rotation

EKCO supports automatic certificate rotation for the [registry add-on](/docs/install-with-kurl/setup-tls-certs#registry) and the [Kubernetes control plane](/docs/install-with-kurl/setup-tls-certs#kubernetes-control-plane) since version 0.5.0 and for the [KOTS add-on](/docs/install-with-kurl/setup-tls-certs#kots-tls-certificate-renewal) since version 0.7.0.

### Internal Load Balancer

EKCO 0.11.0+ can maintain an internal load balancer forwarding all traffic from host port 6444 to one of the Kubernetes API server pods.
To do this, EKCO runs HAProxy as a [static pod](https://kubernetes.io/docs/tasks/configure-pod-container/static-pod/) on all nodes.
EKCO ensures that, when new nodes are added and removed from the cluster, the correct HAProxy configuration is applied on all nodes.

In addition to the `ekco.enableInternalLoadBalancer` parameter, the `ekco-enable-internal-load-balancer` flag can be specified at install time to enable this feature.

```bash
curl https://kurl.sh/latest | sudo bash -s ekco-enable-internal-load-balancer
```

### Auto-resource Scaling

With auto-resource scaling, EKCO automatically scales some cluster resources that
were installed by kURL to the specified replica count.

Auto-resource scaling is useful because a subset of cluster resources require that all
nodes join the cluster before the desired replica count can be fulfilled. This can cause
issues such as false positives in health check error reporting. Auto-resource scaling helps to avoid issues like this by scaling this subset of custom resources to the specified replica count without requiring that all nodes join the cluster.

Auto-resource scaling is available in v0.13.0 and later.

### Pod Image Overrides

EKCO adds an admission controller that can be configured to override container images in pods.

A list can be specified in the `podImageOverrides` property as an array of strings in the format `[original]=[overridden]`.

For example:

```yaml
ekco:
  version: latest
  podImageOverrides:
    - projectcontour/contour:v1.18.0=myregistry.io/contour:v1.18.0-fips
```

## Reboot

EKCO installs the `ekco-reboot.service` to safely unmount pod volumes before the system shutdown.
This service runs `/opt/ekco/shutdown.sh` when it is stopped, which happens automatically when the system begins to shutdown.
The shutdown script deletes pods on the current node that mount volumes provisioned by Rook and cordons the node.

When the `ekco-reboot.service` is started, it runs `/opt/ekco/startup.sh`.
This happens automatically when the system starts after docker is running.
This script uncordons the node.

The shutdown script can fail to complete because it depends on services running on the node to be available to delete pods, but these services can be shutting down already.
To avoid race conditions, manually run the ekco-reboot service's shutdown script before proceeding with the system shutdown or reboot:

```bash
/opt/ekco/shutdown.sh
```
