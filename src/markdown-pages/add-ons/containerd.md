---
path: "/docs/add-ons/containerd"
date: "2020-06-13"
linktitle: "Containerd Add-On"
weight: 31
title: "Containerd Add-On"
addOn: "containerd"
---
Containerd is an alternative CRI (Container Runtime Interface) to Docker.
Please note that containerd must be specified in yaml spec, and that docker must not be present if containerd is.

As CentOS, RHEL and Oracle Linux 8.x do not support Docker, the Containerd CRI is required.

## Advanced Install Options

```yaml
spec:
  containerd:
    version: 1.4.4
    preserveConfig: false
    tomlConfig: |
      [debug]
        "level" = "info"
```

flags-table
