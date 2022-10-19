---
path: "/docs/install-with-kurl/"
date: "2019-12-19"
weight: 10
linktitle: "Overview"
title: "Install with kURL"
---
For unauthenticated users, kURL will calculate a hash based on the selected components and their versions. This hash becomes the name & unique identifier of that installer for all installation methods (standard, HA and airgap). For example, the airgap installer for `fa57b02` can be found at `https://kurl.sh/bundle/fa57b02.tar.gz`.

## Online Usage
To run the latest version of the install script:
```
curl https://kurl.sh/latest | sudo bash
```

## Advanced Options
kURL installers support a handful of end-user defined advanced options that can be enabled with install script flags. These can be used in combination with both online and airgapped installers. The list of options and their expected values is available here: [kURL Advanced Install Options](/docs/install-with-kurl/advanced-options).

## Highly Available K8s (HA)
```
curl https://kurl.sh/latest | sudo bash -s ha
```
HA installs will prompt and wait for an optional load balancer address to be provided that can route external and internal traffic to the API servers.
In the absence of a load balancer address, kURL will enable [the EKCO add-on's internal load balancer](/docs/add-ons/ekco#internal-load-balancer).
(If EKCO 0.11.0+ is not available, then kURL will default to using the first primary instead of a load balancer. This is not recommended for production installs.)
This prompt can be bypassed during the install process by specifying `enableInternalLoadBalancer: true` in the kURL yaml spec for the [EKCO add-on](/docs/add-ons/ekco#advanced-install-options).

### External Load Balancer


To use an external load balancer instead of the internal load balancer, either specify the load balancer address at the prompt or beforehand with the `load-balancer-address=<address>` flag.
An external load balancer may be preferred when clients outside the cluster need access to the cluster's Kubernetes API.

```
curl https://kurl.sh/latest | sudo bash -s ha load-balancer-address=k8slb.somebigbank.com:6443
```

See the [Load Balancer Requirements](/docs/install-with-kurl/system-requirements#load-balancers) for detailed information on external load balancer configuration for HA setups.

### HA Recovery

[Learn more](/docs/add-ons/ekco#clear-nodes) about how the EKCO add-on ensures pods recover during node failure events.

### Converting to HA

To convert a non-HA cluster to an HA cluster, re-run the install script with the `ha` flag:

```bash
curl https://kurl.sh/latest | sudo bash -s ha
```

To change the load balancer of an existing HA cluster, re-run the install script with the new load balancer address.
This requires that the [EKCO add-on](/docs/add-ons/ekco) is enabled with version 0.6.0+.

```bash
curl https://kurl.sh/latest | sudo bash -s ha load-balancer-address=k8slb.somebigbank.com:6443
```

This will automatically regenerate new certificates that include the new load balancer host as a Subject Alternative Name for all Kubernetes API servers in the cluster.

## Airgapped Usage
To install Kubernetes in an airgapped environment, first fetch the installer archive:
```
curl -LO https://kurl.sh/bundle/latest.tar.gz
```

After copying the archive to your host, untar it and run the install script:
```
tar xvzf latest.tar.gz
cat install.sh | sudo bash -s airgap
```

Airgapped HA is available through:
```
tar xvzf latest.tar.gz
cat install.sh | sudo bash -s airgap ha
```

## Vendor Licensing Agreement (Beta)

kURL supports requiring acceptance to a vendor-supplied license agreement prior to installation. This license will be presented at installation run time and requires an explicit 'y' or 'Y' to continue or the installation will be aborted. The URL provided should link directly to a text file and not to a web page. (eg [web-page](https://github.com/replicatedhq/kURL/blob/master/LICENSE) vs [text-file](https://raw.githubusercontent.com/replicatedhq/kURL/master/LICENSE)).

A license can be defined within the install yaml:
```
 apiVersion: "cluster.kurl.sh/v1beta1"
  kind: "Installer"
  metadata:
    name: ""
  spec:
    kurl:
      licenseURL: https://somecompany.com/license-agreement.txt
```

NOTE: This is not yet supported for Airgap installs. 

## Versioned Releases
kURL supports pinning the installation to a specific release version.

The version can be specified in the URL, for example:
```
curl https://kurl.sh/version/v2021.05.07-0/latest | sudo bash
```

Airgap bundles can be downloaded using a similar pattern:
```
curl -LO https://kurl.sh/bundle/version/v2021.05.07-0/latest.tar.gz
```

A release can be pinned within the installer yaml, as well:
```yaml
  apiVersion: "cluster.kurl.sh/v1beta1"
  kind: "Installer"
  metadata:
    name: ""
  spec:
    kurl:
      installerVersion: "v2021.06.15-0"
```

If an installer version is specified in both the yaml and the URL, the URL version will be used.


A list of releases can be found on the [kURL Releases](https://github.com/replicatedhq/kURL/releases) page.

*NOTE: Version pinning is supported as of release `v2021.05.07-0`.*

## Latest
`latest` is a specific distribution that is managed by Replicated. This installer typically provides the most recent version of several add-ons and the most recent version of Kubernetes that kURL supports. The `latest` version of an add-on is the most recent version that Replicated is confident will continue to work when you upgrade to it.

While the `latest` specification can be suitable for some situations, Replicated strongly recommends that you specify particular versions that are tested and predictable for your installation use case, and that you revisit these version declarations at least monthly as new add-on versions become available. For more information about add-on versions, see [Versions](/docs/create-installer/#versions).

An example of how `latest` can be used in a spec is:  
```yaml
  apiVersion: "cluster.kurl.sh/v1beta1"
  kind: "Installer"
  metadata:
    name: ""
  spec:
    kubernetes:
      version: "1.25.x"
    weave:
      version: "2.6.x"
    contour:
      version: "1.22.x"
    minio:
      version: "latest"
    registry:
      version: "latest"
    prometheus:
      version: "latest"
    containerd:
      version: "1.5.x"
    longhorn:
      version: "1.3.x"
    ekco:
      version: "latest"
```

## Using the kURL Installer CRD

The kURL installer YAML is a valid Kubernetes Custom Resource. At the end of an
install, the install time options can be easily viewed via kubectl.

For example, if the install was done using the following command:

```
curl https://kurl.sh/latest | sudo bash
```

Once the install is complete you can view the current state of the cluster and every option that was
changed in the kURL YAML spec with the following command.

```
kubectl get installer latest -n default
```

## Modifying an Install Using a YAML Patch File at Runtime.

End users may wish to take an existing kURL install script and modify part of
the spec on the fly. Here are several options and considerations to take.

To use this option, one must run the install script in the following way:

```
curl https://kurl.sh/latest | sudo bash -s installer-spec-file=[path to YAML patch]
```

This file must be in a valid installer CRD format, a minimum version of a
patch YAML file is shown below. Note that it must contain the proper apiVersion
and kind, as well as have a name.

```yaml
  apiVersion: "cluster.kurl.sh/v1beta1"
  kind: "Installer"
  metadata:
    name: "patch"
  spec:
    kubernetes:
      HACluster: true
```

The kURL installer will perform a merge on this YAML to reach the desired end
spec. If there is a difference between a specific field that exists in both the base YAML and the
patch YAML, the patch YAML will take precedence in the final merged YAML. Fields
that are only present in one of the YAML files will also be preserved in the
final merged YAML.

Note that changing add-on versions in a patch file is not supported for airgap installs, because the downloaded airgap archive will only contain the version in the original spec.

Once the install is finished, the merged YAML that represents the install can be
viewed by running the following command to show the current state of the cluster. 

```
kubectl get installer merged -n default
```

## Select Examples of Using a Patch YAML File

Currently, if the 'latest' kURL install script is run on CentOS, there will be a
prompt asking the user if they wish to either disable Firewalld and SELinux, or
continue and ignore these warnings. Using this patch file will cause the kURL
install script to automatically disable Firewalld and SELinux, allowing for an
unattended install.

```yaml
  apiVersion: "cluster.kurl.sh/v1beta1"
  kind: "Installer"
  metadata:
    name: "patch"
  spec:
    firewalldConfig:
      disableFirewalld: true
    selinuxConfig:
      disableSelinux: true
```

If a user wishes to use a different set of IPTables rule on an install they can
use the following patch YAML to do so. Note that commands merged this way will
replace, not add to commands that may exist on the base YAML.

```yaml
  apiVersion: "cluster.kurl.sh/v1beta1"
  kind: "Installer"
  metadata:
    name: "patch"
  spec:
    iptablesConfig:
      iptablesCmds:
        - ["-A", "INPUT", "-s", "1.1.1.1", "-j", "DROP"]
```

The following patch YAML can be used to configure the IP adddress ranges of Pods and Services.
Note that the installer will attempt to default to `10.32.0.0/20` for Pods and `10.96.0.0/22` for Services.
If not available, the installer will attempt to find an available range with prefix bits of 20 and 22 respectively in the `10.32.0.0/16` or `10.0.0.0/8` address spaces.

```yaml
  apiVersion: cluster.kurl.sh/v1beta1
  kind: Installer
  metadata:
    name: "patch"
  spec:
    kubernetes:
      serviceCIDR: "<your custom subnet>"
    weave:     
      podCIDR: "<your custom subnet>"
```

This patch YAML file can also be used to add functionality that does not exist
in the base YAML file. Please note this will work for online installs only, as
airgap packages will not include the files needed.

For example, if the base YAML did not have Fluentd specified, it could be added
at runtime with this patch.

```yaml
  apiVersion: "cluster.kurl.sh/v1beta1"
  kind: "Installer"
  metadata:
    name: "patch"
  spec:
    fluentd:
      fullEKFStack: true
      version: "0.7.3"
```
