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

### Kubernetes

```yaml
spec:
  kubernetes:
    version: "1.15.3"
    serviceCIDR: "10.96.0.0/12"
```

| Flag | Usage |
| ---- | ----- |
| serviceCidr       | Customize the range of virtual IPs assigned to services. |
| bootstrapToken    | Authentication token used by kubernetes when adding nodes. The default is an auto-generated token. |
| bootstrapTokenTTL | TTL of the `bootstrap-token`. The default is 24 hours. |
| ha                | Install Kubernetes in multi-master mode. |

## Add Ons

### Docker

```yaml
spec:
  docker:
    version: "18.09.8"
    bypassStorageDriverWarnings: false
    hardFailOnLoopback: false
    noCEOnEE: false
    daemonConfig: |
      {
    	  "exec-opts": ["native.cgroupdriver=systemd"]
      }
    preserveConfig: false
```

| Flag | Usage |
| ---- | ----- |
| bypassStorageDriverWarnings   | Bypass Docker warnings when using the devicemapper storage driver in loopback mode.                                    |
| hardFailOnLoopback            | If present, aborts the installation if devicemapper on loopback mode is detected.                                      |
| noCEOnEE                      | Disable installation of Docker CE onto platforms it does not support - RHEL, SLES and Oracle Linux.                    |
| noDocker                      | Skip docker installation.                                                                                              |
| daemonConfig                  | This is where a docker daemon.json config may be added as a string field.                                              |
| preserveConfig                | This flag will ensure that nothing is changed in the existing docker config on the system, regardless of other options.|

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
    isEncryptionDisabled: true
    podCIDR: "1.1.1.1"
    podCidrRange: "/16"
```

| Flag | Usage |
| ---- | ----- |
| isEncryptionDisabled | Encrypt network communication between nodes in the cluster. |
| podCIDR              | The subnet where pods will be found.                        |
| podCidrRange         | The size of the CIDR where pods can be found.               |

### Rook

```yaml
spec:
  rook:
    version: latest
    blockDeviceFilter: sd[b-z]
    cephReplicaCount: 24
    isBlockStorageEnabled: true
    storageClassName: "storage"
```

| Flag | Usage |
| ---- | ----- |
| storageClassName        | The name of the StorageClass that will use Rook to provision PVCs.                                                |
| cephReplicaCount        | Replication factor of ceph pools. The default is to use the number of nodes in the cluster, up to a maximum of 3. |
| isBlockStorageEnabled   | Use block devices instead of the filesystem for storage in the Ceph cluster.                                      |
| blockDeviceFilter       | Only use block devices matching this regex.                                                                       |

### Contour

```yaml
spec:
  contour:
    version: "0.14.0"
```

| Flag | Usage |
| ---- | ----- |
| disableContour | If present, disables the deployment of the Contour ingress controller. |

### Prometheus

```yaml
spec:
  prometheus:
    version: "0.33.0"
```

| Flag | Usage |
| ---- | ----- |
| disablePrometheus | If present, disables the deployment of Prometheus monitoring components. |

### Kotsadm

```yaml
spec:
  kotsadm: 
    version: "latest"
    applicationSlug: "slug"
    uiBindPort: 8800
    hostname: "hostname"
    applicationNamespace: "kots"
```

| Flag                  | Usage                                                                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| applicationSlug       | The slug shown on the app settings page of vendor web.                                                                                                                 |
| uiBindPort            | This is the port where the kots admin panel can be interacted with via browser.                                                                                        |
| hostname              | The hostname that the admin console will be exposed on.                                                                                                                |
| applicationNamespaces | An additional namespace that should be pre-created during the install (For applications that install to other namespaces outside of the one where kotsadm is running). |

### Velero

```yaml
spec:
  velero:
    version: "latest"
    namespace: "velero"
    disableRestic: true
    disableCLI: true
    localBucket: "local"
```

| Flag          | Usage                                                                                                      |
| --------------| ---------------------------------------------------------------------------------------------------------- |
| namespace     | Install the Velero server into an alternative namesapce. Default is "velero".                              |
| disableCLI    | Do not install the velero CLI.                                                                             |
| disableRestic | Do not install the Restic integration.  Volume data will not be included in backups if Restic is disabled. |
| localBucket   | Create an alternative bucket in the local ceph RGW store for the initial backend. Default is "velero".     |

### EKCO

```yaml
spec:
  ekco:
    version: "latest"
    nodeUnreachableTolerationDuration: 1h
    minReadyMasterNodeCount: 2
    minReadyWorkerNodeCount: 0
    rookShouldUseAllNodes: true
    shouldDisableRebootServices: true
```

| Flag                              | Usage                                                                                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nodeUnreachableTolerationDuration | How long a Node must be unreachable before considered dead. Default is 1h.                                                                                  |
| minReadyMasterNodeCount           | Don't purge the node if it will result in less than this many ready masters. Default is 2.                                                                  |
| minReadyWorkerNodeCount           | Don't purge the node if it will result in less than this many ready workers. Default is 0.                                                                  |
| rookShouldUseAllNodes             | This will disable management of nodes in the CephCluster resource. If false, ekco will add nodes to the storage list and remove them when a node is purged. |
| shouldMaintainStorageNodes        | Whether to maintain the list of nodes to use in the CephCluster config. Default is true when rook addon is installed.                                       |
