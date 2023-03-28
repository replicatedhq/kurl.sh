---
path: "/docs/add-ons/docker"
date: "2020-05-13"
linktitle: "Docker"
weight: 36
title: "Docker Add-On"
addOn: "docker"
isDeprecated: true
---
## Deprecation Notice

### This add-on is deprecated.

As of March 27, 2023, kURL no longer intends to continue to offer this add-on as part of the ongoing kURL project. This add-on is now considered deprecated, and may no longer be offered by the project after September 31st, 2023. Existing installs that use this add-on will be best effort supported during this deprecation window. Kubenetes 1.24.0+ no loner supports Dockershim, therefore you must use an alternative CRI such as [containerd](/docs/add-ons/containerd).  Please remove Docker from your spec and replace it with [Containerd](https://kurl.sh/docs/add-ons/containerd) to migrate existing installs.



## Summary


Docker is a CRI (Container Runtime Interface).
If Docker is not used, an alternative CRI must be used in its place.
See [containerd documentation](/docs/add-ons/containerd) for more information.


For disk requirements, see [Add-on Directory Disk Space Requirements](/docs/install-with-kurl/system-requirements/#add-on-directory-disk-space-requirements).

## Advanced Install Options

```yaml
spec:
  docker:
    version: "19.03.10"
    bypassStorageDriverWarnings: false
    hardFailOnLoopback: false
    noCEOnEE: false
    daemonConfig: |
      {
    	  "exec-opts": ["native.cgroupdriver=systemd"]
      }
    preserveConfig: false
```

flags-table
