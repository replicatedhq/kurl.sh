---
path: "/docs/add-ons/openebs"
date: "2019-02-20"
linktitle: "OpenEBS"
weight: 49
title: "OpenEBS Add-On"
addOn: "openebs"
---

The [OpenEBS](https://openebs.io) add-on creates a Storage Class which provisions [Local](https://openebs.io/docs#local-volumes) Persistent Volumes to Stateful workloads.

## Advanced Install Options

```yaml
spec:
  openebs:
    version: latest
    namespace: openebs
    isLocalPVEnabled: true
    localPVStorageClassName: openebs
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

The OpenEBS Storage Class can be set as the default by setting the `openebs.localPVStorageClassName` property to `"default"` or when no other storage provisioner add-on is included in the spec.

In this example, the Local PV provisioner would be used as the default provisioner for any Persistent Volume Claims that do not explicitly specify a `storageClassName`.

```yaml
spec:
  openebs:
    version: latest
    isLocalPVEnabled: true
    localPVStorageClassName: default
```

### Limitations

Other [Replicated Volume](https://openebs.io/docs/#replicated-volumes) provisioners provided by the OpenEBS project including cStor are not supported.
