---
path: "/docs/install-with-kurl/advanced-options"
date: "2019-12-19"
weight: 15
linktitle: "Advanced Options"
title: "Advanced Options"
---

The install scripts are idempotent. Re-run the scripts with different flags to change the behavior of the installer.

| Flag                             | Usage                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------  |
| additional-no-proxy-addresses    | This indicates addresses that should not be proxied in addition to the private IP. Multiple addresses can be specified as a comma separated list of IPs or a range of addresses in CIDR notation. |
| airgap                           | Do not attempt outbound Internet connections while installing.                                                    |
| force-reapply-addons             | Reinstall addons, whether or not they have changed since the last time kurl was run.                              |
| ha                               | Install will require a load balancer to allow for a highly available Kubernetes Control Plane.                    |
| installer-spec-file              | This flag takes the path to a ‘patch’ yaml file. The config in this patch will be merged with the existing installer yaml, taking precedence where there is conflict, and will change the installation based on the final config. |
| kurl-install-directory           | Override the base directory where kURL will install its dependencies. The path will be suffixed with "/kurl/" ("{kurl-install-directory}/kurl/"). This directory must be writeable by the kURL installer and must have sufficient disk space (5 GB). (default "/var/lib/") |
| load-balancer-address            | IP:port of a load balancer for the Kubernetes API servers in HA mode.                                             |
| preflight-ignore                 | Ignore preflight failures and warnings.                                                                           |
| preflight-ignore-warnings        | Ignore preflight warnings.                                                                                        |
| preserve-docker-config           | This flag will make the kURL installer keep the current docker config of the node, overriding any yaml config.    |
| preserve-iptables-config         | This flag will make the kURL installer keep the current Iptables config of the node, overriding any yaml config.  |
| preserve-firewalld-config        | This flag will make the kURL installer keep the current Firewalld config of the node, overriding any yaml config. |
| preserve-selinux-config          | This flag will make the kURL installer keep the current Selinux config of the node, overriding any yaml config.   |
| public-address                   | The public IP address.                                                                                            |
