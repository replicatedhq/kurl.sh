---
path: "/docs/install-with-kurl/"
date: "2019-12-19"
weight: 1
linktitle: "Overview"
title: "Install with kURL"
---

## Online Usage

To run the latest version of the install script:

```
curl https://kurl.sh/latest | sudo bash
```

HA
```
curl https://kurl.sh/latest | sudo bash -s ha
```

## Airgapped Usage

To install Kubernetes in an airgapped environment, first fetch the installer archive:

```
curl -LO https://kurl.sh/bundle/latest.tar.gz
```

After copying the archive to your host, untar it and run the install script:

```
tar xvf latest.tar.gz
cat install.sh | sudo bash
```
