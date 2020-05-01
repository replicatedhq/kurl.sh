---
path: "/docs/add-ons/selinux"
date: "2020-05-01"
linktitle: "Selinux Add-On"
weight: 25
title: "Selinux Add-On"
---

Security-Enhanced Linux (SELinux) is a security architecture for Linux systems that allows administrators to have more control over who can access the system.
This add-on allows for configuration of system SELinux policies, such as setting the desired state of SELinux, and running chcon and semanage commands in a sanitized manner.

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

| Flag           | Usage                                                                                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| chconCmds      | This is a list of arguments that may be passed in to kURL and executed by chcon during the install. Multiple commands may be run.                                                                         |
| disableSelinux | This is a flag that allows for disabling selinux during the install script without user interaction. Note that if disableSelinux and preserveConfig are set to True, preserveConfig will take precedence. |
| preserveConfig | This flag will ensure that nothing is changed in the existing selinux config on the system, regardless of other options.                                                                                  |
| semanageCmds   | This is a list of arguments that may be passed in to kURL and executed by semanage during the install. Multiple commands may be run.                                                                      |
| selinux        | This option sets the desired state of selinux, choices are enforcing, permissive, disabled.                                                                                                               |
