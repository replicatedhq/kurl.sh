---
path: "/docs/install-with-kurl/cis-compliance"
date: "2021-12-14"
weight: 24
linktitle: "CIS Compliance"
title: "CIS Compliance"
isAlpha: false
---
The kURL installer can be configured to be Center for Internet Security (CIS) compliant. This is an opt-in feature that is configured in the kURL specification by setting the `kurl.cisCompliance` field to `true`. For information about known limitations, see [Known Limitations](#known-limitations). For more information about CIS security compliance for Kubernetes, see the [CIS benchmark information](https://www.cisecurity.org/benchmark/kubernetes).

The following settings are changed when `cisCompliance` is set to `true`:

**Primary node configuration:**

The admin.conf file ownership is set to `root:root`.

**API server configuration:**

* `--kubelet-certificate-authority` is set as appropriate.
* The admission control plugin `PodSecurityPolicy` is enabled.
* `--insecure-port` is set to `0`.

**Kubelet configuration:**

`--protect-kernel-defaults` is set to `true`.

## Example YAML

This YAML file example shows a valid specification for CIS compliance:

```
apiVersion: "cluster.kurl.sh/v1beta1"
kind: "Installer"
metadata:
 name: "latest"
spec:
 kurl:
   cisCompliance: true
 kotsadm:
   version: "latest"
 kubernetes:
   version: "1.23.x"
 weave:
   version: "2.6.x"
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

## Known Limitations

* The [EKCO add-on](/docs/add-ons/ekco) v0.19.0 and later is required to use this feature.
* This feature works with the [Kubernetes (kubeadmn) add-on](https://kurl.sh.docs/add-ons/kubernetes) only.
* To meet CIS compliance, admin.conf permissions are changed from the default `root:sudo 440` to `root:root 444`.
* Kubelet no longer attempts to modify non-standard kernel flags. Using non-standard kernel flags can block the Kubelet from initializing and causes the installation to fail.
* This feature is not supported for upgrades of existing kURL installations because the settings that are changed can introduce adverse effects.
