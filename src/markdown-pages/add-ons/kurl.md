---
path: "/docs/add-ons/kurl"
date: "2020-05-01"
linktitle: "Kurl"
weight: 45
title: "Kurl Add-On"
addOn: "kurl"
---
For disk space requirements, see [Core Directory Disk Space Requirements](/docs/install-with-kurl/system-requirements#core-directory-disk-space-requirements).

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
    skipSystemPackageInstall: false
    excludeBuiltinHostPreflights: false
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
                    message: This server has less than 6 CPU cores
                - fail:
                    when: "count < 4"
                    message: This server has less than 4 CPU cores
                - pass:
                    when: "count >= 6"
                    message: This server has at least 6 CPU cores
```

flags-table
