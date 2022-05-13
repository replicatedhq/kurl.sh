---
path: "/docs/add-ons/firewalld"
date: "2020-05-01"
linktitle: "Firewalld Add-On"
weight: 38
title: "Firewalld Add-On"
addOn: "firewalld"
---

Firewalld is a firewall management tool for Linux operating systems.
This add-on allows for configuration of system Firewalld policies, such as setting the desired state of Firewalld, and running firewall-cmd commands in a sanitized manner.

## Advanced Install Options

```yaml
spec:
  firewalldConfig:
    firewalld: enabled
    firewalldCmds:
      - ["--zone=home", "--change-interface=eth0"]
    bypassFirewalldWarning: true
    disableFirewalld: false
    hardFailOnFirewalld: false
    preserveConfig: false
```

flags-table
