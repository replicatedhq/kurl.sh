---
path: "/docs/add-on-author/core-contributions"
date: "2019-10-15"
linktitle: "Core Contributions"
weight: 2
title: "Core Contributions"
---

## Core Contributions

Beyond contributing new add-ons, we're always interested in new contributions to the core kURL project.

## Contributing

1. Spin up an instance for the target OS, e.g. Ubuntu 18.04.
1. Build the Kubernetes host packages for your desired version of Kubernetes. For K8s 1.15.2 on Ubuntu 18.04 you'd use `make build/packages/kubernetes/1.15.2/ubuntu-18.04`. (For packages that have already been released, you can save time by running `curl -L https://kurl.sh/dist/kubernetes-1.15.2.tar.gz | tar xzvf -` on your server.)
1. Airgap only - build the Docker package: `make build/packages/docker/18.09.8/ubuntu-18.04`
1. OPTIONAL - when developing the kurl-util image `export SYNC_KURL_UTIL_IMAGE=1`
1. Run the task to watch for code changes and copy them to your server: `REMOTES=<user>@<hostname>,<user>@<hostname2> make watchrsync`
1. Edit scripts/Manifest to configure Kubernetes and addons.

That will place the installer in your HOME's kurl directory and sync any changes you make locally to the scripts/ directory.
If you rebuild the OS packages, you'll need to manually run `rsync -r build/ ${USER}@${HOST}:kurl` to push those changes.
The `make watchrsync` command requires Node with the `gaze-run-interrupt` package available globally.

On the remote instance run `cd ~/kurl && sudo bash install.sh` to test your changes.


## How It Works

The `bundles` directory holds Dockerfiles used to download the Kubernetes and Docker host packages required for each supported OS.
Make tasks use these Dockerfiles to run an image for the target OS and download .dep or .rpm files and all required dependencies.

The `scripts` directory contains the top-level `install.sh` and `join.sh` scripts along with helper scripts.

The `web` directory holds an Express app for serving the install scripts.
