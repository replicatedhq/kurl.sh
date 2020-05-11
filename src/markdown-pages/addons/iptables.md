---
path: "/docs/add-ons/iptables"
date: "2020-05-01"
linktitle: "Iptables Add-On"
weight: 25
title: "Iptables Add-On"
addOn: "iptables"
---

Iptables is a user-space utility program that allows a system administrator to configure the IP packet filter rules of the Linux kernel firewall, implemented as different Netfilter modules.
This add-on allows for running Iptables commands in a sanitized manner.

## Advanced Install Options

```yaml
spec:
  iptablesConfig:
    iptablesCmds:
      - ["-A", "INPUT", "-i", "lo", "-j", "ACCEPT"]
    preserveConfig: false
```

flags-table