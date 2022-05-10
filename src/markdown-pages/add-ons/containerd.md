---
path: "/docs/add-ons/containerd"
date: "2020-06-13"
linktitle: "Containerd Add-On"
weight: 34
title: "Containerd Add-On"
addOn: "containerd"
---
Containerd is the recommended CRI (Container Runtime Interface).
If docker was previously installed and containerd is enabled in the yaml spec, then the cluster will be migrated to containerd and docker will be uninstalled.

As CentOS, RHEL and Oracle Linux 8.x do not support Docker, the Containerd CRI is required.

Containerd 1.4.8+ has dropped support for Ubuntu 16.04.

## Advanced Install Options

```yaml
spec:
  containerd:
    version: 1.4.6
    preserveConfig: false
    tomlConfig: |
      [debug]
        "level" = "info"
```

flags-table
