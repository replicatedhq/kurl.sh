---
path: "/docs/add-ons/openebs"
date: "2019-02-20"
linktitle: "OpenEBS"
weight: 49
title: "OpenEBS Add-On"
addOn: "openebs"
---

The [OpenEBS](https://openebs.io) add-on creates a Storage Class which provisions [Local](https://openebs.io/docs#local-volumes) Persistent Volumes to Stateful workloads.

## Host Package Requirements

The following host packages are required for Red Hat Enterprise Linux 9 and Rocky Linux 9 for versions 1.x and 2.x of the OpenEBS add-on:

- iscsi-initiator-utils

## Advanced Install Options

```yaml
spec:
  openebs:
    version: latest
    namespace: openebs
    isLocalPVEnabled: true
    localPVStorageClassName: local
```

flags-table

## Local Volumes

The [Local PV](https://openebs.io/docs/#local-volumes) provisioner uses the host filesystem directory `/var/openebs/local` for storage.
Local Volumes are accessible only from a single node in the cluster.
Pods using Local Volume have to be scheduled on the node where volume is provisioned.
Persistent Volumes provisioned as Local Volumes will not be relocatable to a new node if a pod gets rescheduled.
Data in these Persistent Volumes will not be replicated across nodes to protect against data loss.
The Local PV provisioner is suitable as the default provisioner for single-node clusters.
Additionally, Local Volumes are typically preferred for workloads like Cassandra, MongoDB, Elastic, etc that are distributed in nature and have high availability built into them.

### Storage Class

The OpenEBS Storage Class will be set as the default if:

1. Rook is not included in the spec.
2. There is no existing default Storage Class in the cluster.
3. Longhorn is not included in the spec OR the `openebs.localPVStorageClassName` property is set to `"default"`.

### Limitations

Other [Replicated Volume](https://openebs.io/docs/#replicated-volumes) provisioners provided by the OpenEBS project including cStor are not supported.
