---
path: "/docs/add-ons/ufw"
date: "2021-04-13"
linktitle: "UFW Add-On"
weight: 56
title: "UFW Add-On"
addOn: "ufw"
---

Uncomplicated Firewall is a firewall management tool for Linux operating systems.
This add-on allows for configuration of the "is UFW running" preflight check.

## Advanced Install Options

```yaml
spec:
  ufwConfig:
    bypassUFWWarning: true
    disableUFW: false
    hardFailOnUFW: false
```

flags-table
