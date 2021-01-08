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
| airgap                           | Do not attempt outbound Internet connections while installing.                                                    |
| ha                               | Install in multi-master mode.                                                                                     |
| load-balancer-address            | IP:port of a load balancer for the K8s API servers in ha mode.                                                    |
| public-address                   | The public IP address.                                                                                            |
| installer-spec-file              | This flag takes the path to a ‘patch’ yaml file. The config in this patch will be merged with the existing installer yaml, taking precedence where there is conflict, and will change the installation based on the final config. |
| preserve-docker-config           | This flag will make the kURL installer keep the current docker config of the node, overriding any yaml config     |
| preserve-selinux-config          | This flag will make the kURL installer keep the current Selinux config of the node, overriding any yaml config.   |
| preserve-firewalld-config        | This flag will make the kURL installer keep the current Firewalld config of the node, overriding any yaml config. |
| preserve-iptables-config         | This flag will make the kURL installer keep the current Iptables config of the node, overriding any yaml config.  |
