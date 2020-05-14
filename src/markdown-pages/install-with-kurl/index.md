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
