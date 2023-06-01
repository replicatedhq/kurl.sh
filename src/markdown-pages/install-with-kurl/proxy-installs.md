---
path: "/docs/install-with-kurl/proxy-installs"
date: "2020-06-01"
weight: 16
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

The proxy configuration will be used to download packages required for the installation script to complete and will be applied to the docker and KOTS add-ons.
The provided proxy will be configured and used for HTTP and HTTPS access.
See [Modifying an Install Using a YAML Patch File](/docs/install-with-kurl#modifying-an-install-using-a-yaml-patch-file-at-runtime) for more details on using patch files.

## Proxy Environment Variables

If a `proxyAddress` is not configured in the installer spec, the following environment variables will be used instead:

| Environment variable        | Description                                                             |
|-----------------------------|-------------------------------------------------------------------------|
| `HTTP_PROXY`/`http_proxy`   | Will be configured and used for HTTP access                             |
| `HTTPS_PROXY`/`https_proxy` | Will be configured and used for HTTPS access                            |
| `NO_PROXY`/`no_proxy`       | Defines the host names/IP addresses that shouldn't go through the proxy |

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

Addresses of all hosts in the cluster must be to included in the `additionalNoProxyAddresses` parameter in advance of installing or joining additional nodes.
This parameter can be set using a [YAML patch file](/docs/install-with-kurl/#modifying-an-install-using-a-yaml-patch-file-at-runtime) or passed into the install script using the `additional-no-proxy-addresses` [flag](/docs/install-with-kurl/advanced-options).
When a host is added to the cluster, if the original list of addresses did not encompass this host's address, the install or upgrade script must be re-run on each host with the new host added to the `additionalNoProxyAddresses` parameter. 

For this reason it is recommended to use a range of addresses in CIDR notation to prevent the need for retroactively running the installer when adding additonal nodes.
