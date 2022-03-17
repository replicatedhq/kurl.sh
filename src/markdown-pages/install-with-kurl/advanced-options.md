---
path: "/docs/install-with-kurl/advanced-options"
date: "2019-12-19"
weight: 18
linktitle: "Advanced Options"
title: "Advanced Options"
---

The install scripts are idempotent. Re-run the scripts with different flags to change the behavior of the installer.

These flags are passed into the script using the following format:

`curl https://kurl.sh/latest | sudo bash -s OPTIONAL_FLAG`

# Optional Flags

## Flag: `additional-no-proxy-addresses`

This indicates addresses that should not be proxied in addition to the private IP. Multiple addresses can be specified as a comma separated list of IPs or a range of addresses in CIDR notation.

**Example**

    curl https://kurl.sh/latest | sudo bash -s additional-no-proxy-addresses=192.1.1.1

## Flag: `airgap`

Do not attempt outbound Internet connections while installing.

**Example**

    curl https://kurl.sh/latest | sudo bash -s airgap

## Flag: `container-log-max-files`

Specifies the maximum number of container log files that can be present for a container. This does not work with Docker. For Docker, check out https://docs.docker.com/config/containers/logging/json-file.

**Example**

    curl https://kurl.sh/latest | sudo bash -s container-log-max-files=2

## Flag: `container-log-max-size`

A quantity defining the maximum size of the container log file before it is rotated. For example: \"5Mi\" or \"256Ki\". This does not work with Docker. For Docker, check out https://docs.docker.com/config/containers/logging/json-file.

**Example**

    curl https://kurl.sh/latest | sudo bash -s container-log-max-size=5Mi

## Flag: `exclude-builtin-host-preflights`

Skips the built-in host preflight checks from running and only runs the vendor-defined checks. See [Customizing Host Preflights](/docs/create-installer/host-preflights/#adding-custom-host-preflight-checks).

**Example**

    curl https://kurl.sh/latest | sudo bash -s exclude-builtin-host-preflights

## Flag: `force-reapply-addons`

Reinstall add-ons, whether or not they have changed since the last time kurl was run.

**Example**

    curl https://kurl.sh/latest | sudo bash -s force-reapply-addons

## Flag: `ha`

Install will require a load balancer to allow for a highly available Kubernetes Control Plane.

**Example**

    curl https://kurl.sh/latest | sudo bash -s ha

## Flag: `host-preflight-enforce-warnings`

Forces host preflight warnings to exit the kURL installer with a non-zero exit code.

**Example**

    curl https://kurl.sh/latest | sudo bash -s host-preflight-enforce-warnings

## Flag: `host-preflight-ignore`

Ignore host preflight failures and warnings.                                                           

**Example**

    curl https://kurl.sh/latest | sudo bash -s host-preflight-ignore

## Flag: `ignore-remote-load-images-prompt`

Bypass prompt to load images on remotes. This is useful for automating upgrades.

**Example**

    curl https://kurl.sh/latest | sudo bash -s ignore-remote-load-images-prompt

## Flag: `ignore-remote-upgrade-prompt`

Bypass prompt to upgrade remotes. This is useful for automating upgrades.

**Example**

    curl https://kurl.sh/latest | sudo bash -s ignore-remote-upgrade-prompt

## Flag: `installer-spec-file`

This flag takes the path to a ‘patch’ yaml file. The config in this patch will be merged with the existing installer yaml, taking precedence where there is conflict, and will change the installation based on the final config.

**Example**

    curl https://kurl.sh/latest | sudo bash -s installer-spec-file="./patch.yaml"

## Flag: `kurl-install-directory`

Override the base directory where kURL will install its dependencies. The path will be suffixed with "/kurl/" ("{kurl-install-directory}/kurl/"). This directory must exist, be writeable by the kURL installer and must have sufficient disk space (5 GB).

**Note:**  the default is `/var/lib/`

**Example**

    curl https://kurl.sh/latest | sudo bash -s kurl-install-directory="/some/dir"

## Flag: `labels`

Apply the given labels to the node.

**Example**

    curl https://kurl.sh/latest | sudo bash -s labels="gpu=enabled,type=data"

**Note:** This flag can be used when initially creating a kURL cluster or when adding a node to an existing kURL cluster.

## Flag: `load-balancer-address`

The IP:port of a load balancer for the Kubernetes API servers in HA mode.      

**Example**

    curl https://kurl.sh/latest | sudo bash -s load-balancer-address="34.124.10.32:80"

## Flag: `preserve-docker-config`

This flag will make the kURL installer keep the current docker config of the node, overriding any yaml config.

**Example**

    curl https://kurl.sh/latest | sudo bash -s preserve-docker-config

## Flag: `preserve-firewalld-config`

This flag will make the kURL installer keep the current Firewalld config of the node, overriding any yaml config.

**Example**

    curl https://kurl.sh/latest | sudo bash -s preserve-firewalld-config

## Flag: `preserve-iptables-config`

This flag will make the kURL installer keep the current Iptables config of the node, overriding any yaml config.

**Example**

    curl https://kurl.sh/latest | sudo bash -s preserve-iptables-config

## Flag: `preserve-selinux-config`

This flag will make the kURL installer keep the current SELinux config of the node, overriding any yaml config.

**Example**

    curl https://kurl.sh/latest | sudo bash -s preserve-selinux-config

## Flag: `public-address`

The public IP address.

**Example**

    curl https://kurl.sh/latest | sudo bash -s public-address="34.139.108.74"

## Flag: `skip-system-package-install`

This flag will tell kURL to skip installing system packages. The user is responsible for installing the required packages beforehand.

**Example**

    curl https://kurl.sh/latest | sudo bash -s skip-system-package-install