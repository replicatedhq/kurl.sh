---
path: "/docs/add-ons/docker"
date: "2020-05-13"
linktitle: "Docker Add-On"
weight: 36
title: "Docker Add-On"
addOn: "docker"
---
Docker is a CRI (Container Runtime Interface).
If Docker is not used, an alternative CRI must be used in its place.
See [containerd documentation](/docs/add-ons/containerd) for more information.

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
