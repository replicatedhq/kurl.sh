---
path: "/docs/add-ons/selinux"
date: "2020-05-01"
linktitle: "SELinux Add-On"
weight: 45
title: "SELinux Add-On"
addOn: "selinux"
---

Security-Enhanced Linux (SELinux) is a security architecture for Linux systems that allows administrators to have more control over who can access the system.
This add-on allows for configuration of system SELinux policies, such as setting the desired state of SELinux, and running chcon and semanage commands in a sanitized manner.
This add-on will be skipped if SELinux is not installed or is disabled.

## Advanced Install Options

```yaml
spec:
  selinuxConfig:
    selinux: "permissive"
    type: "targeted"
    semanageCmds:
      - [user, -a, -R, "staff_r sysadm_r system_r", -r, "s0-s0:c0.c1023", my_staff_u]
    chconCmds:
      - ["-v", "--type=httpd_sys_content_t", "/html"]
    preserveConfig: false
    disableSelinux: false
```

flags-table
