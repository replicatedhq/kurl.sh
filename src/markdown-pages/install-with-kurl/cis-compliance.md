---
path: "/docs/install-with-kurl/cis-compliance"
date: "2022-03-23"
weight: 27
linktitle: "CIS Compliance"
title: "CIS Compliance"
isAlpha: false
---
You can configure the kURL installer to be Center for Internet Security (CIS) compliant for CIS 1.8 or earlier. Opt-in to this feature by setting the `kurl.cisCompliance` field to `true` in the kURL specification. For information about known limitations, see [Known Limitations](#known-limitations). For more information about CIS security compliance for Kubernetes, see the [CIS benchmark information](https://www.cisecurity.org/benchmark/kubernetes).

When you set `cisCompliance` is set to `true`, the following settings are changed from the default settings:

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
 kotsadm:
   version: "latest"
 kubernetes:
   version: "1.23.x"
   cisCompliance: true
 flannel:
   version: "0.20.x"
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

## Requirements and Known Limitations

* The [EKCO add-on](/docs/add-ons/ekco) v0.19.0 and later is required to use this feature.
* This feature works with the [Kubernetes (kubeadm) add-on](https://kurl.sh/docs/add-ons/kubernetes) only.
* To meet CIS compliance, admin.conf and super-admin.conf permissions are changed from the default `root:sudo 440` to `root:root 400` and `root:root 600` respectively.
* Kubelet no longer attempts to change kernel parameters at runtime. Using kernel parameters other than those expected by Kubernetes can block kubelet from initializing and causes the installation to fail.
* This feature has been tested with kURL upgrades, however we strongly recommend testing this with your development environments prior to upgrading production.

## Running kube-bench

Below are instructions for running the CIS 1.8 Kubernetes Benchmark checks for Kubernetes versions 1.26 through 1.31 using kube-bench.

Download the kube-bench binary:

```bash
curl -LO https://github.com/aquasecurity/kube-bench/releases/download/v0.8.0/kube-bench_0.8.0_linux_amd64.tar.gz
tar xzvf kube-bench_0.8.0_linux_amd64.tar.gz
```

Run kube-bench:

```bash
sudo KUBECONFIG=/etc/kubernetes/admin.conf ./kube-bench run --config-dir=./cfg --benchmark cis-1.8
```

## AWS Amazon Linux 2 (AL2) Considerations
The kernel defaults of this Amazon Machine Image (AMI) are not set properly for CIS compliance. CIS compliance does not allow Kubernetes to change kernel settings itself. You must change the kernel defaults to the following settings before installing with kURL:

``` bash
sudo sysctl vm.overcommit_memory=1
sudo sysctl kernel.panic=10
sudo sysctl kernel.panic_on_oops=1
```

Failure to set these values will result in kubelet crashing.
These settings must also be configured on AL2 instance nodes before upgrading them to a CIS compliant kURL specification.
