---
path: "/docs/add-ons/selinux"
date: "2020-05-01"
linktitle: "SELinux"
weight: 54
title: "SELinux Add-On"
addOn: "selinux"
---

Security-Enhanced Linux (SELinux) is a security architecture for Linux systems that allows administrators to have more control over who can access the system.
This add-on allows for configuration of system SELinux policies, such as setting the desired state of SELinux, and running chcon and semanage commands in a sanitized manner.
This add-on will be skipped if SELinux is not installed or is disabled.

Many SELinux configurations will break Kubernetes.
Many more will break applications running within Kubernetes.
We strongly recommend testing configurations extensively.
Replicated will not take ownership of problems caused by overly restrictive SELinux confirations, and our first ask on instances encountering issues with SELinux enabled will often be to set SELinux to `permissive`.

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

## End User Patching

Occasionally end users will wish to enable SELinux and take responsibility for configuring it.
This can be done even without adding SELinux to a vendor's kURL spec with the `installer-spec-file` kURL installer option.
They can run `curl https://kurl.sh/somebigbank | sudo bash -s installer-spec-file="./patch.yaml"` instead, with an appropriate patch file:

```yaml
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
metadata:
  name: "preserve-system-selinux"
spec:
  selinuxConfig:
    preserveConfig: true
```

The process of using a patch spec at runtime is expanded upon [here](/docs/install-with-kurl/#modifying-an-install-using-a-yaml-patch-file-at-runtime).
