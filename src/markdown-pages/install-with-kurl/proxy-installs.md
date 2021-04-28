---
path: "/docs/install-with-kurl/proxy-installs"
date: "2020-06-01"
weight: 17
linktitle: "Proxy Installs"
title: "Proxy Installs"
---

Online installs that require a proxy to reach the public Internet can be configured with the `kurl` section of the yaml spec.

```
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
spec:
  kurl:
    proxyAddress: http://10.128.0.70:3128
    additionalNoProxyAddresses:
    - .corporate.internal
    noProxy: false
```

The proxy configuration will be used to download packages required for the installation script to complete and will be applied to the docker and kotsadm add-ons.
See [Modifying an Install Using a YAML Patch File](/docs/install-with-kurl#modifying-an-install-using-a-yaml-patch-file-at-runtime) for more details on using patch files.

## Proxy Environment Variables

If a `proxyAddress` is not configured in the installer spec, the following environment variables will be checked in order: `HTTP_PROXY`, `http_proxy`, `HTTPS_PROXY`, `https_proxy`.

Any addresses set in either the `NO_PROXY` or `no_proxy` environment variable will be added to the list of no proxy addresses.

## No Proxy Addresses

All addresses set in the `additionalNoProxyAddresses` list will be added to the default set of no proxy addresses.
Addresses can be specified as a single IP address or a range of addresses in CIDR notation.

The default set of no proxy addresses includes:
* The CIDR used for assigning IPs to Kubernetes services
* The CIDR used for assigning IPs to pods
* The private IP of the host where the script runs
* The load balancer address for the Kubernetes API servers (on HA installs)
* The `.svc` and `.local` search domains for cluster services
* Add-on namespaces
* Other service hostnames referenced by add-ons without fully qualified domain names

Addresses of all additional hosts in the cluster must be added manually to the `additionalNoProxyAddresses` parameter using a [YAML patch file](/docs/install-with-kurl/#modifying-an-install-using-a-yaml-patch-file-at-runtime) or passed into the install script using the `additional-no-proxy-addresses` [flag](/docs/install-with-kurl/advanced-options).
