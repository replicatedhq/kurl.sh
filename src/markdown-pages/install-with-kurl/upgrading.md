---
path: "/docs/install-with-kurl/upgrading"
date: "2020-07-24"
weight: 17
linktitle: "Upgrading"
title: "Upgrading"
---

To upgrade Kubernetes or an add-on in a kURL cluster, generate a new installer script and run it on any primary in the cluster.

## Kubernetes

If the install script detects an upgrade of Kubernetes is required, it will first drain and upgrade the primary where the script is running.
Then if there are any remote primaries to upgrade, the script will drain each sequentially and print out a script that must be run on that node.
The script will detect when Kubernetes has been upgraded on the remote node and proceed to drain the next node.
After upgrading all primaries the same operation will be performed sequentially on all remote secondaries.

The install script supports upgrading at most two minor versions of Kubernetes.
When upgrading two minor versions, the skipped minor version will be installed before proceeding to the desired version.
For example, it is possible to upgrade directly from Kubernetes 1.22 to 1.24, but the install script completes the installation of 1.23 before proceeding to 1.24.

## Container Runtimes

If the install script detects an upgrade of a container runtime (`Docker` or `Containerd`) is required, then the new versions provided will be installed.
For example, if you have a cluster using Containerd version `1.6.4` and then you modify the version in your spec to `1.6.18` and re-run the kURL script, the installer will upgrade Containerd to the newly specified version.

Also, be aware that `Docker is not supported with Kubernetes versions 1.24+`. Therefore, it is recommended to use `Containerd` instead. You can upgrade your installation by replacing Docker definition in the installer with Containerd. If the install script detects an upgrade of `Docker` to `Containerd`, it will install Containerd and load the images found and exported from Docker. In this case, Docker will be also removed from the host.

## Airgap

Because upgraded components may have pods scheduled on any node in the cluster, images must be pre-loaded on every node prior to running the updated installer.
After downloading and extracting the airgap bundle to every node in the cluster, run this script to ensure all required images are available:

```bash
cat tasks.sh | sudo bash -s load-images
```

The install script will also perform a check for required images and prompt the user to run this command if any are missing.
