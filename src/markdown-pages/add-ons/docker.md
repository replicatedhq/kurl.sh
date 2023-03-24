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

kURL will not be moving forward with support of this add-on in kURL starting March 23, 2023 and will be fully deprecated after September 31st 2023.  Existing installs that use this add-on will continue to be best-effort supported until the deprecation date.  To migrate to [Containerd](https://kurl.sh/docs/add-ons/containerd) please change your kURL spec to containerd to migrate existing installs.

## Summary


Docker is a CRI (Container Runtime Interface).
If Docker is not used, an alternative CRI must be used in its place.
See [containerd documentation](/docs/add-ons/containerd) for more information.

Kubenetes 1.24.0+ does not support Dockershim.  As a result of this,  therefore you must use an alternative CRI, such as [containerd](/docs/add-ons/containerd), instead.

As a result of Kubernetes dropping support for Docker, we are deprecating the use of Docker moving forward 

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
