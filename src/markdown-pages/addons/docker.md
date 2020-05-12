---
path: "/docs/add-ons/docker"
date: "2020-05-13"
linktitle: "Docker Add-On"
weight: 32
title: "Docker Add-On"
addOn: "docker"
---

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