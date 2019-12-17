---
path: "/docs/install-with-kurl/advanced-options"
date: "2019-12-19"
weight: 5
linktitle: "Advanced Options"
title: "Advanced Options"
---

The install scripts are idempotent. Re-run the scripts with different flags to change the behavior of the installer.

| Flag                             | Usage                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| airgap                           | Do not attempt outbound Internet connections while installing                                      |
| bypass-storagedriver-warnings    | Bypass all Docker storagedriver warnings                                                           |
| bootstrap-token                  | Authentication token used by kubernetes when adding additional nodes                               |
| bootstrap-token-ttl              | TTL of the `bootstrap-token`                                                                       |
| ceph-pool-replicas               | Replication factor of ceph pools. Default is based on number of ready nodes if unset.              |
| disable-contour                  | If present, disables the deployment of the Contour ingress controller                              |
| disable-prometheus               | If present, disables the deployment of Prometheus monitoring components                            |
| disable-rook                     | Do not deploy the Rook add-on                                                                      |
| encrypt-network                  | Disable network encryption with `encrypt-network=0`                                                |
| ha                               | Install in multi-master mode                                                                       |
| hard-fail-on-loopback            | If present, aborts the installation if devicemapper on loopback mode is detected                   |
| http-proxy                       | If present, then use proxy                                                                         |
| ip-alloc-range                   | Customize the range of IPs assigned to pods                                                        |
| load-balancer-address            | IP:port of a load balancer for the K8s API servers in ha mode                                      |
| service-cidr                     | Customize the range of virtual IPs assigned to services                                            |
| no-docker                        | Skip docker installation                                                                           |
| no-proxy                         | If present, do not use a proxy                                                                     |
| public-address                   | The public IP address                                                                              |
| private-address                  | The private IP address                                                                             |
| no-ce-on-ee                      | Disable installation of Docker CE onto platforms it does not support - RHEL, SLES and Oracle Linux |
| reset                            | Uninstall Kubernetes                                                                               |
| storage-class                    | The name of an alternative StorageClass that will provision storage for PVCs                       |
