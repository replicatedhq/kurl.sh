---
path: "/docs/add-ons/containerd"
date: "2020-06-13"
linktitle: "Containerd"
weight: 34
title: "Containerd Add-On"
addOn: "containerd"
---
Containerd is the recommended CRI (Container Runtime Interface).
If docker was previously installed and containerd is enabled in the yaml spec, then the cluster will be migrated to containerd and docker will be uninstalled.

As CentOS, RHEL and Oracle Linux 8.x do not support Docker, the Containerd CRI is required.

Containerd 1.4.8+ has dropped support for Ubuntu 16.04.

### About Containerd upgrades

If you are planning to upgrade your Containerd installation, it is highly recommended that you refer to the relevant [documentation page](/docs/install-with-kurl/upgrading#about-containerd-upgrades) for guidance and best practices.

## Host Package Requirements

The following host packages are required for Red Hat Enterprise Linux 9 and Rocky Linux 9:

- bash
- libseccomp
- libzstd
- systemd

The following host packages are required for Amazon Linux 2023 and Ubuntu 24.04:

- bash
- libseccomp2
- libzstd1
- systemd
- containerd

The `containerd` package does not need to match the version of the containerd add-on.

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
