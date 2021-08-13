---
path: "/docs/add-ons/kurl"
date: "2020-05-01"
linktitle: "Kurl Add-On"
weight: 39
title: "Kurl Add-On"
addOn: "kurl"
---


## Advanced Install Options

```yaml
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
spec:
  kurl:
    airgap: true
    proxyAddress: http://10.128.0.70:3128
    additionalNoProxyAddresses:
    - .corporate.internal
    noProxy: false
    licenseURL: https://raw.githubusercontent.com/replicatedhq/kURL/master/LICENSE
    nameserver: 8.8.8.8
```

flags-table
