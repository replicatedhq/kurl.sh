---
path: "/docs/install-with-kurl/ipv6"
date: "2021-12-14"
weight: 25
linktitle: "IPv6"
title: "IPv6"
isAlpha: true
---
kURL can be installed on IPv6 enabled hosts by passing the `ipv6` flag to the installer or by setting the `kurl.ipv6` field to `true` in the yaml spec.

```
sudo bash install.sh ipv6
```

This example shows a valid spec for ipv6.

```
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
metadata:
  name: "ipv6"
spec:
  kurl:
    ipv6: true
  kubernetes:
    version: "1.23.x"
  kotsadm:
    version: "latest"
  antrea:
    version: "latest"
  contour:
    version: "1.20.x"
  prometheus:
    version: "0.53.x"
  registry:
    version: "2.7.x"
  containerd:
    version: "1.4.x"
  ekco:
    version: "latest"
  minio:
    version: "2020-01-25T02-50-51Z"
  longhorn:
    version: "1.2.x"
```

There is no auto-detection of ipv6 or fall-back to ipv4 when ipv6 is not enabled on the host.


## Current Limitations

* Dual-stack is not supported. Resources will have only an IPv6 address when IPv6 is enabled. The host can be dual-stack, but control plane servers, pods, and cluster services will use IPv6. Node port services must be accessed on the hosts' IPv6 address.
* The only supported operating systems are: Ubuntu 18.04, Ubuntu 20.04, CentOS 8, and RHEL 8.
* Antrea is the only supported CNI (1.4.0+).
* Antrea with encryption requires the kernel wireguard module to be available. The installer will bail if wireguard module cannot be loaded. Follow this guide for your OS, then reboot before running the kURL installer: https://www.wireguard.com/install/.
* Rook is the only supported CSI (1.5.12+).
* Snapshots require velero 1.7.1+.
* External load balancer requires a DNS name. You cannot enter an IPv6 IP at the load balancer prompt. (The internal load balancer is not affected since it automatically uses `localhost`).

## Host Requirements

* IPv6 forwarding must be enabled and bridge-call-nf6tables must be enabled. The installer does this automatically and configures this to persist after reboots.

* Using antrea, TCP 8091 and UDP 6081 have to be open between nodes instead of the ports used by weave (6784 and 6783). Antrea with encryption requires UDP port 51820 be open between nodes for wireguard and that the wireguard kernel module be available.

* The ip6_tables kernel module must be available. The installer configures this to be loaded automatically.


## Troubleshooting

### Joining 2nd Node to Cluster Fails

If nodes in the cluster can't `ping6` each other and the commmand `ip -6 route` shows no default route, you may need to add a default route to your primary interface, for example: `ip -6 route add default dev ens5`

### Upload Kotsadm License Fails

If an application license fails to upload, click the more details link to view the error.
An error like this indicates a DNS failure:
```
failed to execute get request: Get "https://replicated.app/license/ipv6": dial tcp: lookup replicated.app on [fd00:c00b:2::a]:53: server misbehaving`
```

This is caused by a lack of AAAA records for replicated.app.
The solution is to deploy a NAT64 server that can translate `A` records into `AAAA` records.
Another solution is to switch to an airgap install or to temporarily set the env var "DISABLE_OUTBOUND_CONNECTIONS=1" on the kotsadm deployment.
A third option is to perform a [proxy install](/docs/install-with-kurl/proxy-installs).

### Networking Check Fails in kURL Installer

The kURL installer includes a networking check after antrea is installed.
If this fails, check the logs for the antrea-agent daemonset in the kube-system namespace.
An error like the following indicates the ip6_tables kernel module is not available:
```
E1210 19:44:12.494994       1 route_linux.go:119] Failed to initialize iptables: error checking if chain ANTREA-PREROUTING exists in table raw: running [/usr/sbin/ip6tables -t raw -S ANTREA-PREROUTING 1
--wait]: exit status 3: modprobe: FATAL: Module ip6_tables not found in directory /lib/modules/4.18.0-193.19.1.el8_2.x86_64
ip6tables v1.8.4 (legacy): can't initialize ip6tables table `raw': Table does not exist (do you need to insmod?)
Perhaps ip6tables or your kernel needs to be upgraded.
```

Verify that `lsmod | grep ip6_tables` is empty and then run `modprobe ip6_tables` to load the required module.
Since the antrea add-on install script persists this under `/etc/modules-load.d` there may be another host agent interfering if this module is not loaded after reboots.
