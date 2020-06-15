---
path: "/docs/add-ons/docker"
date: "2020-05-13"
linktitle: "Docker Add-On"
weight: 33
title: "Docker Add-On"
addOn: "docker"
---
Docker is a CRI (Container Runtime Interface).
If Docker is not used, an alternative CRI (currently containerd is in beta
support) must be used in it's place.
See containerd documentation for more information.

## Advanced Install Options

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

flags-table
