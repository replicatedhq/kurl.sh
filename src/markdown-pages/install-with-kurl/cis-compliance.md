---
path: "/docs/install-with-kurl/cis-compliance"
date: "2021-12-14"
weight: 24
linktitle: "CIS Compliance"
title: "CIS Compliance"
isAlpha: false
---
The kURL installer can be configured to be Center for Internet Security (CIS) compliant. This is an opt-in feature that is configured in the kURL specification by setting the `kurl.cisCompliance` field to `true`.

For information about known limitations, see [Known Limitations](#known-limitations).

For more information about CIS security compliance for Kubernetes, see the [CIS benchmark information](https://www.cisecurity.org/benchmark/kubernetes).

This YAML file example shows a valid specification for CIS compliance:

```
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: cisCompliance
spec:
  kurl:
    cisCompliance: true
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
  velero:
    version: 1.7.1
```

## Known Limitations

* The Ecko [EKCO add-on](/docs/add-ons/ekco) v0.19.0 and later is required to use this feature.
* This feature works with the [Kubernetes (kubeadmn) add-on](https://kurl.sh.docs/add-ons/kubernetes) only.
* To meet CIS compliance, admin.conf permissions are changed from the default `root:sudo 440` to `root:root 444`.
* Kubelet no longer attempts to modify non-standard kernel flags. Using non-standard kernel flags can block the Kubelet from initializing and cause the installation to fail.
