---
path: "/docs/install-with-kurl/changing-storage"
date: "2022-10-10"
weight: 25
linktitle: "Changing Storage"
title: "Changing Storage"
isAlpha: false
---

It is relatively common to initially allocate less (or more) storage than is required for an installation in practice.
Some storage providers allow this to be done easily, while others require far more effort.

This guide is not for changing the size of an individual PVC, but instead the storage of the entire PV provisioner.

# OpenEBS LocalPV

OpenEBS LocalPV consumes a host's storage at `/var/openebs/local`.
If you increase the amount of storage available here, OpenEBS will use it.
If it shrinks, OpenEBS will have less storage to use.

# Rook-Ceph

## Expanding Storage

Rook does not support expanding the storage of existing block devices, only adding new ones.
However, a 100GB block device added to a node that already had a 100GB block device used by rook will be treated similarly to a freshly created instance with a single 200GB disk.
In general, all nodes in a cluster should have the same amount of storage, and lopsided amounts of storage can lead to inefficiencies.

Rook will use all block devices attached to the host unless a `blockDeviceFilter` is set, explained [here](/docs/add-ons/rook#block-storage).

## Contracting Storage

Rook does not support shrinking a block device once it has been allocated to Rook.
However, entire block devices can be removed from the cluster.
This procedure is not intended to be used on a regular basis, but can be very helpful if you have accidentally added a disk to Rook that was intended for something else.

Removing all OSDs from a node will fail if there would be less than three nodes with sufficient storage for your usage remaining.

### Identifying OSDs
The first step is to determine what OSD number corresponds to the block device you wish to be freed up.

With a shell into the tools deployment from `kubectl exec -it -n rook-ceph deployment/rook-ceph-tools -- bash`, we can get a list of disks that ceph is using, and which disk is on which host.

```
[rook@rook-ceph-tools-6fb84b545-js4rg /]$ ceph osd tree
ID  CLASS  WEIGHT   TYPE NAME                     STATUS  REWEIGHT  PRI-AFF
-1         0.58597  root default
-3         0.39067      host laverya-rook-main
 0    ssd  0.09769          osd.0                     up   1.00000  1.00000
 1    ssd  0.09769          osd.1                     up   1.00000  1.00000
 2    ssd  0.19530          osd.2                     up   1.00000  1.00000
-5         0.19530      host laverya-rook-worker
 3    ssd  0.04880          osd.3                     up   1.00000  1.00000
 4    ssd  0.14650          osd.4                     up   1.00000  1.00000
[rook@rook-ceph-tools-6fb84b545-js4rg /]$ ceph osd df
ID  CLASS  WEIGHT   REWEIGHT  SIZE     RAW USE  DATA     OMAP  META     AVAIL    %USE   VAR   PGS  STATUS
 0    ssd  0.09769   1.00000  100 GiB   13 GiB   13 GiB   0 B   52 MiB   87 GiB  13.45  0.76   37      up
 1    ssd  0.09769   1.00000  100 GiB   25 GiB   25 GiB   0 B   93 MiB   75 GiB  25.38  1.44   47      up
 2    ssd  0.19530   1.00000  200 GiB   32 GiB   32 GiB   0 B  124 MiB  168 GiB  16.17  0.92   85      up
 3    ssd  0.04880   1.00000   50 GiB  9.4 GiB  9.4 GiB   0 B   39 MiB   41 GiB  18.88  1.07   45      up
 4    ssd  0.14650   1.00000  150 GiB   25 GiB   25 GiB   0 B  100 MiB  125 GiB  16.75  0.95  115      up
                       TOTAL  600 GiB  106 GiB  105 GiB   0 B  407 MiB  494 GiB  17.62
MIN/MAX VAR: 0.76/1.44  STDDEV: 4.05
```
If this is enough to identify your disk already, fantastic!
For instance, a 150GB disk on `laverya-rook-worker` would be osd.4 above.
However, a 100GB disk on `laverya-rook-main` could be either osd.0 or osd.1.

If this is not enough - for instance if you have multiple disks of the same size on the same instance - you can use kubectl from the host.
You can get the list of rook-ceph OSDs with `kubectl get pods -n rook-ceph -l ceph_daemon_type=osd`, and then check each one by searching the describe output for `ROOK_BLOCK_PATH`.

```
kubectl describe pod -n rook-ceph rook-ceph-osd-1-6cf7c5cb7-z7c8p | grep ROOK_BLOCK_PATH
      DEVICE="$ROOK_BLOCK_PATH"
      ROOK_BLOCK_PATH:              /dev/sdc
      ROOK_BLOCK_PATH:              /dev/sdc
```
From this we can tell that the OSD using /dev/sdc is osd.1.

### Draining OSDs
Once this is known, there are many commands to be run within the rook-ceph-tools deployment.
You can get a shell to this deployment with `kubectl exec -it -n rook-ceph deployment/rook-ceph-tools -- bash`.

Once you have determined the OSD to be removed, you can tell ceph to relocate data off of this disk with `ceph osd reweight 1 0`.
```
[rook@rook-ceph-tools-6fb84b545-js4rg /]$ ceph osd reweight 1 0
reweighted osd.1 to 0 (0)
```

Immediately after running this, if we run ceph status there will be a progress bar:
```
[rook@rook-ceph-tools-6fb84b545-js4rg /]$ ceph status
  cluster:
    id:     be2c8681-a8a8-4f84-bf78-5afe2d88e48e
    health: HEALTH_WARN
            Degraded data redundancy: 6685/32898 objects degraded (20.320%), 39 pgs degraded, 13 pgs undersized

  services:
    mon: 1 daemons, quorum a (age 37m)
    mgr: a(active, since 35m)
    mds: 1/1 daemons up, 1 hot standby
    osd: 5 osds: 5 up (since 20m), 4 in (since 21s); 32 remapped pgs
    rgw: 1 daemon active (1 hosts, 1 zones)

  data:
    volumes: 1/1 healthy
    pools:   11 pools, 177 pgs
    objects: 16.45k objects, 62 GiB
    usage:   95 GiB used, 405 GiB / 500 GiB avail
    pgs:     6685/32898 objects degraded (20.320%)
             4418/32898 objects misplaced (13.429%)
             126 active+clean
             15  active+recovery_wait+undersized+degraded+remapped
             14  active+recovery_wait+degraded
             5   active+recovery_wait+remapped
             5   active+recovery_wait
             5   active+recovery_wait+degraded+remapped
             3   active+undersized+degraded+remapped+backfill_wait
             2   active+remapped+backfill_wait
             2   active+recovering+undersized+degraded+remapped

  io:
    client:   18 MiB/s rd, 35 MiB/s wr, 79 op/s rd, 18 op/s wr
    recovery: 46 MiB/s, 0 keys/s, 11 objects/s

  progress:
    Global Recovery Event (0s)
      [............................]

```

At this point, ceph is removing data from the OSD to be removed and moving it to the OSD(s) to be kept.

When completed, every PG should be active+clean, and none should be in any other status.

There should be no progress bar at the bottom, and it will look similar to this:
```
[rook@rook-ceph-tools-6fb84b545-js4rg /]$ ceph status
  cluster:
    id:     be2c8681-a8a8-4f84-bf78-5afe2d88e48e
    health: HEALTH_OK

  services:
    mon: 1 daemons, quorum a (age 112m)
    mgr: a(active, since 111m)
    mds: 1/1 daemons up, 1 hot standby
    osd: 5 osds: 5 up (since 95m), 4 in (since 75m)
    rgw: 1 daemon active (1 hosts, 1 zones)

  data:
    volumes: 1/1 healthy
    pools:   11 pools, 177 pgs
    objects: 18.02k objects, 68 GiB
    usage:   137 GiB used, 363 GiB / 500 GiB avail
    pgs:     177 active+clean

  io:
    client:   136 MiB/s rd, 51 KiB/s wr, 580 op/s rd, 1 op/s wr
```

You can then run `ceph osd df` to ensure that the OSD to be removed is empty:
```
[rook@rook-ceph-tools-6fb84b545-js4rg /]$ ceph osd df
ID  CLASS  WEIGHT   REWEIGHT  SIZE     RAW USE  DATA     OMAP  META     AVAIL    %USE   VAR   PGS  STATUS
 0    ssd  0.09769   1.00000  100 GiB   26 GiB   25 GiB   0 B  225 MiB   74 GiB  25.64  0.93   56      up
 1    ssd  0.09769         0      0 B      0 B      0 B   0 B      0 B      0 B      0     0    0      up
 2    ssd  0.19530   1.00000  200 GiB   43 GiB   43 GiB   0 B  423 MiB  157 GiB  21.51  0.78  121      up
 3    ssd  0.04880   1.00000   50 GiB   15 GiB   15 GiB   0 B  133 MiB   35 GiB  29.91  1.09   49      up
 4    ssd  0.14650   1.00000  150 GiB   54 GiB   53 GiB   0 B  470 MiB   96 GiB  35.77  1.30  128      up
                       TOTAL  500 GiB  137 GiB  136 GiB   0 B  1.2 GiB  363 GiB  27.46
MIN/MAX VAR: 0.78/1.30  STDDEV: 5.34
```

And additionally run `ceph osd safe-to-destroy osd.<num>` to ensure that ceph really is done with the drive:
```
[rook@rook-ceph-tools-6fb84b545-js4rg /]$ ceph osd safe-to-destroy osd.1
OSD(s) 1 are safe to destroy without reducing data durability.
```

### Disabling OSDs
The next set of commands will need to be run with kubectl, so you can exit the rook-ceph-tools shell with `exit`.

First, scale the rook-ceph-operator to 0 replicas to keep it from undoing things. `kubectl -n rook-ceph scale deployment rook-ceph-operator --replicas=0`.
Then, scale down the OSD you wish to remove with `kubectl -n rook-ceph scale deployment rook-ceph-osd-<num> --replicas=0`.

After this, it's time to TEST AND MAKE SURE NOTHING IS BROKEN before actually deleting things for real.

Does kotsadm still work?
Can you make a support bundle through the web UI?
Can you browse the files of a release?
Does the application itself still function?

If any of the above answers are "no", you should scale the rook-ceph-operator and rook-ceph-osd-<num> deployments back to 1 replica.

### Destroying OSDs

Once again, you will need to get a toolbox shell with `kubectl exec -it -n rook-ceph deployment/rook-ceph-tools -- bash`.

An OSD can be destroyed with `ceph osd purge 1 --yes-i-really-mean-it`.
If you do not in fact "mean it", please do not run this.

```
[rook@rook-ceph-tools-6fb84b545-js4rg /]$ ceph osd purge 1 --yes-i-really-mean-it
purged osd.1
[rook@rook-ceph-tools-6fb84b545-js4rg /]$ ceph osd df
ID  CLASS  WEIGHT   REWEIGHT  SIZE     RAW USE  DATA     OMAP  META     AVAIL    %USE   VAR   PGS  STATUS
 0    ssd  0.09769   1.00000  100 GiB   26 GiB   25 GiB   0 B  287 MiB   74 GiB  25.72  0.93   58      up
 2    ssd  0.19530   1.00000  200 GiB   43 GiB   43 GiB   0 B  500 MiB  157 GiB  21.63  0.78  119      up
 3    ssd  0.04880   1.00000   50 GiB   15 GiB   15 GiB   0 B  162 MiB   35 GiB  29.97  1.09   48      up
 4    ssd  0.14650   1.00000  150 GiB   54 GiB   53 GiB   0 B  573 MiB   96 GiB  35.99  1.30  127      up
                       TOTAL  500 GiB  138 GiB  136 GiB   0 B  1.5 GiB  362 GiB  27.59
MIN/MAX VAR: 0.78/1.30  STDDEV: 5.37
```

Once the OSD has been purged, you can `exit` the toolbox again and reformat the freed disk for your purposes, or remove it from the instance entirely.

After the free block device has been made unavailable for use by rook-ceph, you can restore the operator with `kubectl -n rook-ceph scale deployment rook-ceph-operator --replicas=1`, because the operator is needed for normal use.

