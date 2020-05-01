---
path: "/docs/add-ons/firewalld"
date: "2020-05-01"
linktitle: "Firewalld Add-On"
weight: 25
title: "Firewalld Add-On"
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

| Flag                   | Usage                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bypassFirewalldWarning | By default, a kURL install will not continue with firewalld active. When this flag is set, kURL will continue to install.                                                                                     |
| disableFirewalld       | This is a flag that allows for disabling firewalld during the install script without user interaction. Note that if disableFirewalld and preserveConfig are set to True, preserveConfig will take precedence. |
| hardFailOnFirewalld    | This is a flag that will stop and exit a current install if firewalld is active.                                                                                                                              |
| firewalld              | This flag describes the desired state of firewalld, either enabled or disabled.                                                                                                                               |
| firewalldCmds          | This is a list of arguments that may be passed in to kURL and executed by firewall-cmd during the install. Multiple commands may be run.                                                                      |
| preserveConfig         | This flag will ensure that nothing is changed in the existing firewalld config on the system, regardless of other options.                                                                                    |
