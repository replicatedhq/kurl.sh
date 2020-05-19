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
HA installs will prompt and wait for an optional load balancer address to be provided in the install process. This will route external and internal traffic to the API servers. In the absence of a load balancer address, all traffic will be routed to the first master. This prompt can be bypassed during the install process by specifying the address in the flag `load-balancer-address=<address>` in the install script.

## Airgapped Usage
To install Kubernetes in an airgapped environment, first fetch the installer archive:
```
curl -LO https://k8s.kurl.sh/bundle/latest.tar.gz
```

After copying the archive to your host, untar it and run the install script:
```
tar zxvf latest.tar.gz
cat install.sh | sudo bash -s airgap
```

Airgapped HA is available through:
```
tar zxvf latest.tar.gz
cat install.sh | sudo bash -s airgap ha
```

## Latest
`latest` is a specific distro that is managed by the team at Replicated. This installer provides the most recent version of several add-ons and the most recent version of Kubernetes that kURL supports. Currently the spec for `latest` is:  
```yaml
  apiVersion: "cluster.kurl.sh/v1beta1"
  kind: "Installer"
  metadata:
    name: ""
  spec:
    kubernetes:
      version: "latest"
    weave:
      version: "latest"
    rook:
      version: "latest"
    contour:
      version: "latest"
    docker:
      version: "latest"
    prometheus:
      version: "latest"
    registry:
      version: "latest"
```

## Using the kURL Installer CRD

The kURL installer YAML is a valid Kubernetes Custom Resource. At the end of an
install, the install time options can be easily viewed via kubectl.

For example, if the install was done using the following command:

```
curl https://kurl.sh/latest
```

Once the install is complete you can view the current state of the cluster and every option that was
changed in the kURL YAML spec with the following command.

```
kubectl get installer latest
```

## Modifying an Install Using a YAML Patch File at Runtime.

End users may wish to take an existing kURL install script and modify part of
the spec on the fly. Here are several options and considerations to take.

To use this option, one must run the install script in the following way:

```
curl https://kurl.sh/latest | sudo bash -s installer-spec-file=[path to YAML patch]
```

This file must be in a valid installer CRD format, a minimum version of a
patch YAML file is shown below. Note that is must contain the proper apiVersion
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

Once the install is finished, the merged YAML that represents the install can be
viewed by running the following command to show the current state of the cluster. 

```
kubectl get installer merged
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
