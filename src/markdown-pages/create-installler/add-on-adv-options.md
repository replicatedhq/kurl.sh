---
path: "/docs/create-installer/add-on-adv-options"
date: "2019-10-15"
weight: 21
linktitle: "Advanced Options"
title: "Advanced Options"
---

The Kubernetes Installers (kURL) reference documentation. Each add-on is listed with all supported keys, and the default for the key, if not present.

## Application Vendor YAML Options and Flags

The options available to the application vendor in the installer yaml are a subset of the options available to the cluster operator as flags to the install script.
Each yaml snippet below includes all options available to the application vendor for the add-on and the default for the key if not present.

The cluster operator can use flags to override any of the options set in the application vendor's installer yaml.
For example, passing the `service-cidr` flag to the install script overrides the field `spec.kubernetes.serviceCIDR` in the vendor's yaml.

Additionally, some options are only available to the cluster operator to be passed as flags to the install script. An example is the `bootstrap-token` flag for setting the secret used to join additional nodes to the Kubernetes cluster.

Flag options must be passed every time the install script is run.

## General Installation Options

These options are only available to the cluster operator as flags to the install script.

| Flag             | Usage                                                          |
| ---------------- | -------------------------------------------------------------- |
| airgap           | Do not attempt outbound Internet connections while installing. |
| http-proxy       | Configures Docker to use a proxy when pulling images. Disables automatic proxy detection from the environment and prompt. Must include http(s) and may include port. |
| no-proxy         | If present, do not use a proxy. Disables automatic proxy detection and prompt. |
| public-address   | The public IP address that will be added to the SANs of any certificates generated for host services. Setting this disables detection from the environment and prompt. |
| private-address  | The private IP address used for internal communication between components. Setting this disables detection from the host and prompt. |

### Kubernetes

```yaml
spec:
  kubernetes:
    version: "1.15.3"
    serviceCIDR: "10.96.0.0/12"
```

| Flag | Usage |
| ---- | ----- |
| service-cidr | Customize the range of virtual IPs assigned to services. |
| bootstrap-token | Authentication token used by kubernetes when adding nodes. The default is an auto-generated token. |
| bootstrap-token-ttl | TTL of the `bootstrap-token`. The default is 24 hours. |
| ha | Install Kubernetes in multi-master mode. |

## Add Ons

### Docker

```yaml
spec:
  docker:
    version: "18.09.8"
    bypassStorageDriverWarnings: false
    hardFailOnLoopback: false
    noCEOnEE: false
```

| Flag | Usage |
| ---- | ----- |
| bypass-storagedriver-warnings | Bypass Docker warnings when using the devicemapper storage driver in loopback mode                 |
| hard-fail-on-loopback         | If present, aborts the installation if devicemapper on loopback mode is detected                   |
| no-ce-on-ee                   | Disable installation of Docker CE onto platforms it does not support - RHEL, SLES and Oracle Linux |
| no-docker                     | Skip docker installation                                                                           |

### Registry

```yaml
spec:
  registry:
    version: "2.7.1"
```

### Weave

```yaml
spec:
  weave:
    version: "2.5.2"
    encryptNetwork: true
    IPAllocRange: "10.32.0.0/12"
```

| Flag | Usage |
| ---- | ----- |
| encrypt-network | Encrypt network communication between nodes in the cluster. Use `encrypt-network=0` to disable. |
| ip-alloc-range  | Customize the range of IPs assigned to pods. |

### Rook

```yaml
spec:
  rook:
    version: "1.0.4"
    storageClass: "default"
    cephPoolReplicas: 3
```

| Flag | Usage |
| ---- | ----- |
| ceph-pool-replicas | Replication factor of ceph pools. The default is to use the number of nodes in the cluster, up to a maximum of 3. |
| storage-class      | The name of the StorageClass that will use Rook to provision PVCs. |
| disable-rook       | Do not deploy the Rook add-on. |

### Contour

```yaml
spec:
  contour:
    version: "0.14.0"
```

| Flag | Usage |
| ---- | ----- |
| disable-contour | If present, disables the deployment of the Contour ingress controller. |

### Prometheus

```yaml
spec:
  prometheus:
    version: "0.33.0"
```

| Flag | Usage |
| ---- | ----- |
| disable-prometheus | If present, disables the deployment of Prometheus monitoring components. |

### Kotsadm

```yaml
spec:
  kotsadm:
    version: "0.9.9"
    applicationSlug: ""
    uiBindPort: 8800
```

| Flag | Usage |
| ---- | ----- |
| kotsadm-ui-bind-port | NodePort the kotsadm web application will listen on. |

### Velero

```yaml
spec:
  velero:
    version: "1.2.0"
    namespace: velero
    useRestic: true
    installCLI: true
```

| Flag | Usage |
| ---- | ----- |
| velero-namespace | Install the Velero server into an alternative namesapce. Default is "velero". |
| velero-disable-cli | Do not install the velero CLI. |
| velero-disable-restic | Do not install the Restic integration.  Volume data will not be included in backups if Restic is disabled. |
| velero-local-bucket | Create an alternative bucket in the local ceph RGW store for the initial backend. Default is "velero". |

### EKCO

```yaml
spec:
  ekco:
    version: "v2020.02.26-0"
    nodeUnreachableToleration: 1h
    minReadyMasterNodes: 2
    minReadyWorkerNodes: 0
    rook:
      maintainStorageNodes: true
```

| Flag | Usage |
| ---- | ----- |
| ekco-node-unreachable-toleration | How long a Node must be unreachable before considered dead. Default is 1h. |
| ekco-min-ready-master-nodes | Don't purge the node if it will result in less than this many ready masters. Default is 2. |
| ekco-min-ready-worker-nodes | Don't purge the node if it will result in less than this many ready workers. Default is 0. |
| ekco-disable-maintain-rook-storage-nodes | Whether to maintain the list of nodes to use in the CephCluster config. Default is true when rook addon is installed. |
