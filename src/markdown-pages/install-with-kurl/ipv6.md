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
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: ipv6
spec:
  kurl:
    ipv6: true
  kubernetes:
    version: 1.19.15
  containerd:
    version: 1.4.6
  antrea:
    version: 1.4.0
  rook:
    version: 1.5.12
  kotsadm:
    version: 1.58.1
  ekco:
    version: 0.13.0
  registry:
    version: 2.7.1
```

There is no auto-detection of ipv6 or fall-back to ipv4 when ipv6 is not enabled on the host.


## Current Limitations

* Dual-stack is not supported. Resources will have only an ipv6 address when ipv6 is enabled. The host can be dual-stack, but control plane servers, pods, and cluster services will use IPv6. Node port services must be accessed on the hosts' IPv6 address.
* The only supported operating systems are: Ubuntu 18.04, Ubuntu 20.04, CentOS 8, and RHEL 8. (CentOS 7 NodePorts fail, but might work if you upgrade the kernel. Oracle Linux and Amazon Linux have not been tested).
* Antrea is the only supported CNI (1.4.0+).
* Antrea with encryption requires the kernel wireguard module to be available. The installer will bail if wireguard module cannot be loaded. Follow this guide for your OS, then reboot before running kurl: https://www.wireguard.com/install/.
* Rook is the only supported CSI (1.5.12+).
* Snapshots require velero 1.7.1+.
* External load balancer hasn't been tested.
* HTTP proxy hasn't been tested.
* Host preflight checks fail even though install succeeds.


## Host Requirements

* IPv6 forwarding must be enabled and bridge-call-nf6tables must be enabled. The installer does this automatically and configures this to persist after reboots.

* Using antrea, TCP 8091 and UDP 6081 have to be open between nodes instead of the ports used by weave (6784 and 6783). Antrea with encryption requires UDP port 51820 be open between nodes for wireguard.


## Troubleshooting

### Problem: joining 2nd node to cluster fails

Symptom: nodes in cluster can't ping6 each other.

Symptom: `ip -6 route` shows no default route

Solution: `sudo ip -6 route add default dev ens5`

### Problem: upload license fails with `failed to execute get request: Get "https://replicated.app/license/ipv6": dial tcp: lookup replicated.app on [fd00:c00b:2::a]:53: server misbehaving`

Solution: deploy a NAT64 server

Solution: use airgap or just set env var "DISABLE_OUTBOUND_CONNECTIONS=1" on the kotsadm deployment

Solution: wait for AAAA records to be added to replicated.app

### Problem: networking check fails in curl installer

Symptom: antrea-agent logs show:
```
E1210 19:44:12.494994       1 route_linux.go:119] Failed to initialize iptables: error checking if chain ANTREA-PREROUTING exists in table raw: running [/usr/sbin/ip6tables -t raw -S ANTREA-PREROUTING 1 
--wait]: exit status 3: modprobe: FATAL: Module ip6_tables not found in directory /lib/modules/4.18.0-193.19.1.el8_2.x86_64
ip6tables v1.8.4 (legacy): can't initialize ip6tables table `raw': Table does not exist (do you need to insmod?)
Perhaps ip6tables or your kernel needs to be upgraded.
```

Symptom: `sudo lsmod | grep ip6` is empty

Solution: `sudo modprobe ip6_tables`
