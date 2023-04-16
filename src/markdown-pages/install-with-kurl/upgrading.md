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

It is possible to upgrade from any Kubernetes minor versions to the latest supported Kubernetes version using a single spec.
This upgrade process will step through minor versions one at a time.
For example, upgrades from Kubernetes 1.19.x to 1.26.x will step through versions 1.20.x, 1.21x, 1.22.x, 1.23.x, 1.24.x, and 1.25.x before installing 1.26.x.
Upgrades without internet access may prompt the end-user to download supplemental packages.

## Container Runtimes

If the install script detects an upgrade of a container runtime (`Docker` or `Containerd`) is required, then the new versions provided will be installed.
For example, if you have a cluster using Containerd version `1.6.4` and then you modify the version in your spec to `1.6.18` and re-run the kURL script, the installer will upgrade Containerd to the newly specified version.

Also, be aware that Docker is not supported with Kubernetes versions 1.24+. Therefore, it is recommended to use Containerd instead. You can upgrade your installation by replacing Docker in your spec with Containerd. If the install script detects a change from Docker to Containerd, it will install Containerd, load the images found in Docker, and remove Docker.

### About Containerd upgrades

The Kurl installer offers a practical solution to the challenge of upgrading Containerd installations that span more than one minor release, despite Containerd not providing official support for this upgrade path. With its automated processes that facilitate such upgrades, Kurl enables users to upgrade their Containerd installations seamlessly, even if spanning two minor releases. This ensures that the upgrade process is streamlined, enabling a smoother transition to the latest version of Containerd.

It is worth noting that while it is possible to upgrade Containerd directly from version 1.3.x to 1.5.x, attempting to upgrade across more than two minor releases, such as upgrading from version 1.3.x to 1.6.x, will result in an upgrade error. Therefore, it is highly recommended that users follow the supported upgrade paths to ensure a successful upgrade of their cluster. By adhering to the supported upgrade paths, you can avoid potential issues and successfully upgrade your Containerd installation.

## Airgap

Because upgraded components may have pods scheduled on any node in the cluster, images must be pre-loaded on every node prior to running the updated installer.
After downloading and extracting the airgap bundle to every node in the cluster, run this script to ensure all required images are available:

```bash
cat tasks.sh | sudo bash -s load-images
```

The install script will also perform a check for required images and prompt the user to run this command if any are missing.
