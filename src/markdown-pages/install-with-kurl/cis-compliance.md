---
path: "/docs/install-with-kurl/cis-compliance"
date: "2021-12-14"
weight: 24
linktitle: "CIS Compliance"
title: "CIS Compliance"
isAlpha: false
---
The kURL installer can be configured to be Center for Internet Security (CIS) compliant. This is an opt-in feature that is configured in the kURL specification by setting the `kurl.cisCompliance` field to `true`.

To meet CIS compliance, admin.conf permissions are changed from the default `root:sudo 440` to `root:root 444`.

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

* Ecko is required to use this flag.
* This flag only works with kubeadmn.
* If `protectKernelDefaults` is set to `true`, the Kubelet sends errors if the kernel flags are not as expected.
Typically, the Kubelet attempts to modify kernel flags to match its expectation. If the `cisCompliance` flag is set to `true`, the kernel default settings should be copied. Otherwise, non-standard kernel default setting can block the Kubelet script from initializing and are difficult to triage because the error messages return limited information.
