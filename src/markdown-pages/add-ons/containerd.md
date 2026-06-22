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
- container-selinux

The following host packages are required for Amazon Linux 2023 and Ubuntu 24.04:

- bash
- libseccomp2
- libzstd1
- systemd
- container-selinux
- containerd

The `containerd` package does not need to match the version of the containerd add-on.

## Maximum Containerd Versions

Not every version of Containerd is available for every OS.
If your kURL spec requests a newer version of Containerd than can be installed for your current operating system, the latest version will be installed instead.

| Operating System | Latest Version |
|------------------|----------------|
| RHEL 7           | 1.6.33         |
| CentOS 7         | 1.6.33         |
| Oracle Linux 7   | 1.6.33         |
| Ubuntu 18.04     | 1.6.21         |

For instance, if you attempt to install Containerd `1.7.25` on a RHEL 7 system, kURL will instead install Containerd `1.6.33`.

## Containerd 2.x Configuration

Containerd 2.x uses configuration schema version 3 and splits the CRI plugin into separate runtime and image tables. When using Containerd 2.x, kURL writes its default settings to a drop-in file at `/etc/containerd/conf.d/50-replicated.toml` instead of editing `/etc/containerd/config.toml` directly.

Custom settings supplied via `tomlConfig` are written to `/etc/containerd/conf.d/99-user.toml`. Containerd merges drop-in files in `/etc/containerd/conf.d/` in sorted filename order, with later files winning, so `99-user.toml` overrides kURL's defaults in `50-replicated.toml`.

Because the CRI plugin tables changed in Containerd 2.x, custom settings that target the 1.x table path `io.containerd.grpc.v1.cri` are silently ignored. For Containerd 2.x, use the new table paths:

- `io.containerd.cri.v1.runtime` for runtime settings
- `io.containerd.cri.v1.images` for image and registry settings

When upgrading an existing cluster from Containerd 1.x to 2.x, kURL backs up the previous `/etc/containerd/config.toml` to a `.bak` file before regenerating it for the new schema. The old configuration is preserved as a recovery artifact but is not reused, because the CRI plugin tables differ between schema versions.

### Supported upgrade path to Containerd 2.x

Before upgrading to Containerd 2.x, the cluster must already be running Containerd 1.7.x. Upgrades from Containerd 1.6.x or earlier directly to 2.x are not supported.

Containerd 2.x is not supported with Kubernetes 1.26. Upgrade Kubernetes to 1.27 or later before upgrading to Containerd 2.x.

## Advanced Install Options

```yaml
spec:
  containerd:
    version: 1.7.x
    preserveConfig: false
    tomlConfig: |
      [debug]
        "level" = "info"
```

flags-table
