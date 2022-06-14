---
path: "/docs/add-ons/openebs"
date: "2019-02-20"
linktitle: "OpenEBS"
weight: 49
title: "OpenEBS Add-On"
addOn: "openebs"
---

The [OpenEBS](https://openebs.io) add-on includes two options for provisioning volumes for PVCs: LocalPV and cStor.

Either provisioner may be selected as the default provisioner for the cluster by naming its storageclass `default`.
In this example, the localPV provisioner would be used as provisioner for any PVCs that did not explicitly specify a storageClassName.

## Advanced Install Options

```yaml
spec:
  openebs:
    version: latest
    namespace: "space"
    isLocalPVEnabled: true
    localPVStorageClassName: default
    isCstorEnabled: true
    cstorStorageClassName: cstor
```

flags-table

## LocalPV

The [LocalPV provisioner](https://docs.openebs.io/docs/next/localpv.html) uses the host filesystem directory `/var/openebs/local` for storage.
PersistentVolumes provisioned with localPV will not be relocatable to a new node if a pod gets rescheduled.
Data in these PersistentVolumes will not be replicated across nodes to protect against data loss.
The localPV provisioner is suitable as the default provisioner for single-node clusters.

## cStor

The [cStor provisioner](https://docs.openebs.io/docs/next/ugcstor.html) relies on block devices for storage.
The OpenEBS NodeDeviceManager runs a DaemonSet to automatically incorporate available block devices into a storage pool named `cstor-disk`.
The first available block device on each node in the cluster will automatically be added to this pool.


### Adding Disks

After joining more nodes with disks to your cluster you can re-run the kURL installer to re-configure the `cstor-disk` storagepoolclaim, the storageclass, and the replica count of any existing volumes.

### Storage Class

The kURL installer will create a StorageClass that initially configures cStor to provision volumes with a single replica.
After adding more nodes with disks to the cluster, re-running the kURL installer will increase the replica count up to a maximum of three.
The kURL installer will also check for any PVCs that were created at a lower ReplicaCount and will add additional replicas to bring those volumes up to the new ReplicaCount.

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: cstor
  annotations:
    openebs.io/cas-type: cstor
    cas.openebs.io/config: |
      - name: StoragePoolClaim
        value: "cstor-disk"
      - name: ReplicaCount
        value: "1"
provisioner: openebs.io/provisioner-iscsi
```

### CustomResources

#### disks.openebs.io

Use `kubectl get disks` to list all the disks detected by the Node Device Manager.
The Node Device Manager will ignore any disks that are already mounted or that match `loop,/dev/fd0,/dev/sr0,/dev/ram,/dev/dm-`.

It is critical to ensure that disks are attached with a serial number and that this serial number is unique across all disks in the cluster.
On GCP, for example, this can be accomplished with the `--device-name` flag.
```
gcloud compute instances attach-disk my-instance --disk=my-disk-1 --device-name=my-instance-my-disk-1
```

Use the `lsblk` command with the `SERIAL` output columnm to verify on the host that a disk has a unique serial number:
```
lsblk -o NAME,SERIAL
```

#### blockdevices.openebs.io

For each disk in `kubectl get disks` there should be a corresponding blockdevice resource in `kubectl -n openebs get blockdevices`.
(It is possible to manually configure multiple blockdevice resources for a partitioned disk but that is not supported by the kURL installer.)

#### blockdeviceclaims.openebs.io

For each blockdevice that is actually being used by cStor for storage there will be a resource listed under `kubectl -n openebs get blockdeviceclaims`.
The kURL add-on uses an automatic striped storage pool, which can make use of no more than one blockdevice per node in the cluster.
Attaching a 2nd disk to a node, for example, would trigger creation of `disk` and `blockdevice` resources, but not a `blockdeviceclaim`.

#### storagepoolclaim.openebs.io

The kURL installer will create a `storagepoolclaim` resource named `cstor-disk`.
For the initial install, kURL will use this spec for the storagepoolclaim:

```yaml
spec:
  blockDevices:
    blockDeviceList: null
  maxPools: 1
  minPools: 1
  name: cstor-disk
  poolSpec:
    cacheFile: ""
    overProvisioning: false
    poolType: striped
  type: disk
```

The `blockDeviceList: null` setting indicates to OpenEBS that this is an automatic pool.
Blockdevices will automatically be claimed for the pool up to the value of `maxPools`.
If no blockdevices are available, the kURL installer will prompt for one to be attached and wait.
After joining more nodes with disks to the cluster, re-running the kURL installer will increase the `maxPools` level.

#### cstorvolumes.openebs.io

Each PVC provisioned by cStor will have a corresponding cstorvolume resource in the `openebs` namespace.
```
kubectl -n openebs get cstorvolumes
```
The cstorvolume name will be identical to the PersistentVolume name created for the PVC once bound.

#### cstorvolumereplicas.openebs.io

For each cstorvolume there will be 1 to 3 cstorvolumereplicas in the `openebs` namespace.
```
kubectl -n openebs get cstorvolumereplicas
```
The number of replicas should match the `ReplicaCount` configured in the StorageClass, which kURL increases as more nodes with disks are added to the clsuter.
