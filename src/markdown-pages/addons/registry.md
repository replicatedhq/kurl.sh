---
path: "/docs/add-ons/registry"
date: "2020-05-13"
linktitle: "Registry Add-On"
weight: 42
title: "Registry Add-On"
addOn: "registry"
---

[Docker registry](https://github.com/docker/distribution) is an OCI compatible image registry.
This addon deploys it to the `kurl` namespace.

## Advanced Install Options

```yaml
spec:
  registry:
    version: "2.7.1"
```

flags-table