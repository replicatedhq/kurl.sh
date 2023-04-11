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

As of March 27, 2023, the Docker add-on is deprecated. The Docker add-on might be removed from kURL after September 31st, 2023. Existing installations that use the Docker add-on are supported during this deprecation window. Kubernetes 1.24.0 and later does not support Docker. We recommend that you remove the Docker add-on on or before September 31st, 2023 and instead use the [Containerd](https://kurl.sh/docs/add-ons/containerd) add-on.

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
