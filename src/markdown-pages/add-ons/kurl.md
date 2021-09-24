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
    licenseURL: https://somecompany.com/license-agreement.txt
    nameserver: 8.8.8.8
    hostPreflights:
      apiVersion: troubleshoot.sh/v1beta2
      kind: HostPreflight
      spec:
        collectors:
          - cpu: {}
        analyzers:
          - cpu:
              checkName: Number of CPU check
              outcomes:
                - warn:
                    when: "count < 6"
                    message: This server has less than 4 CPU cores
                - fail:
                    when: "count < 4"
                    message: This server has less than 2 CPU cores
                - pass:
                    when: "count >= 6"
                    message: This server has at least 4 CPU cores
```

flags-table
