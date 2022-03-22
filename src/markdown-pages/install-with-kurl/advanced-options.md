---
path: "/docs/install-with-kurl/advanced-options"
date: "2019-12-19"
weight: 18
linktitle: "Advanced Options"
title: "Advanced Options"
---

## Syntax for Advanced Options

To include advanced options in the kURL installation script, use the following syntax with `-s` before the advanced option flag:

```
curl https://kurl.sh/latest | sudo bash -s ADVANCED_FLAG
```
Where `ADVANCED_FLAG` is the flag for the advanced option.

For example, the following command installs kURL with the `force-reapply-addons` option enabled:

```
curl https://kurl.sh/latest | sudo bash -s force-reapply-addons
```

For more information about installing with kURL with advanced options, see [Install with kURL](https://kurl.sh/docs/install-with-kurl/).

The install scripts are idempotent. Re-run the scripts with different flags to change the behavior of the installer.

## Reference

| Flag                             | Usage                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------  |
| additional-no-proxy-addresses    | This indicates addresses that should not be proxied in addition to the private IP. Multiple addresses can be specified as a comma separated list of IPs or a range of addresses in CIDR notation. |
| airgap                           | Do not attempt outbound Internet connections while installing.                                                    |
| app-version-label                | A version label that indicates to KOTS which version of an application to install. KOTS will install the latest version if this flag is not passed. |
| container-log-max-files          | Specifies the maximum number of container log files that can be present for a container. This does not work with Docker. For Docker, check out https://docs.docker.com/config/containers/logging/json-file. |
| container-log-max-size           | A quantity defining the maximum size of the container log file before it is rotated. For example: \"5Mi\" or \"256Ki\". This does not work with Docker. For Docker, check out https://docs.docker.com/config/containers/logging/json-file. |
| exclude-builtin-host-preflights | Skips the built-in host preflight checks from running and only runs the vendor-defined checks. See [Customizing Host Preflights](/docs/create-installer/host-preflights/#adding-custom-host-preflight-checks). |
| force-reapply-addons             | Reinstall add-ons, whether or not they have changed since the last time kurl was run.                             |
| ha                               | Install will require a load balancer to allow for a highly available Kubernetes Control Plane.                    |
| host-preflight-enforce-warnings        | Forces host preflight warnings to exit the kURL installer with a non-zero exit code.                                                                                        |
| host-preflight-ignore                 | Ignore host preflight failures and warnings.                                                                 |
| ignore-remote-load-images-prompt | Bypass prompt to load images on remotes. This is useful for automating upgrades.                                  |
| ignore-remote-upgrade-prompt     | Bypass prompt to upgrade remotes. This is useful for automating upgrades.                                         |
| installer-spec-file              | This flag takes the path to a ‘patch’ yaml file. The config in this patch will be merged with the existing installer yaml, taking precedence where there is conflict, and will change the installation based on the final config. |
| kurl-install-directory           | Override the base directory where kURL will install its dependencies. The path will be suffixed with "/kurl/" ("{kurl-install-directory}/kurl/"). This directory must be writeable by the kURL installer and must have sufficient disk space (5 GB). (default "/var/lib/") |
| labels                           | Apply the given labels to the node. For example: \"labels=gpu=enabled,type=data\".<br>**Note:** This flag can be used when initially creating a kURL cluster or when adding a node to an existing kURL cluster.                                |
| load-balancer-address            | IP:port of a load balancer for the Kubernetes API servers in HA mode.                                             |
| preserve-docker-config           | This flag will make the kURL installer keep the current docker config of the node, overriding any yaml config.    |
| preserve-firewalld-config        | This flag will make the kURL installer keep the current Firewalld config of the node, overriding any yaml config. |
| preserve-iptables-config         | This flag will make the kURL installer keep the current Iptables config of the node, overriding any yaml config.  |
| preserve-selinux-config          | This flag will make the kURL installer keep the current SELinux config of the node, overriding any yaml config.   |
| public-address                   | The public IP address.                                                                                            |
| skip-system-package-install      | This flag will tell kURL to skip installing system packages. The user is responsible for installing the required packages beforehand. |
