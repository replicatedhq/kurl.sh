---
path: "/docs/add-ons/kurl"
date: "2020-05-01"
linktitle: "Kurl Add-On"
weight: 25
title: "Kurl Add-On"
---


## Advanced Install Options

```yaml
spec:
  kurl:
    airgap: true
```

| Flag             | Usage                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| airgap           | This flag signifies that the installer will use an airgap bundle to install the file. It needs and does not need an outbound internet connection.                      |
| HTTPProxy        | Configures Docker to use a proxy when pulling images. Disables automatic proxy detection from the environment and prompt. Must include http(s) and may include port.   |
| noProxy          | If present, do not use a proxy. Disables automatic proxy detection and prompt.                                                                                         |
| publicAddress    | The public IP address that will be added to the SANs of any certificates generated for host services. Setting this disables detection from the environment and prompt. |
| privateAddress   | The private IP address used for internal communication between components. Setting this disables detection from the host and prompt.                                   |