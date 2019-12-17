---
path: "/docs/create-installer/creating-an-installer-api"
date: "2019-10-15"
weight: 4
linktitle: "Create Installer API"
title: "Create An Installer via API"
---
## API based Installer Creation
An installer is the specification for a customized distribution of Kubernetes.
The minimum valid installer spec requires only a supported Kubernetes version:

```yaml
apiVersion: kurl.sh/v1beta1
spec:
  kubernetes:
    version: "1.15.3"
```

Retrieve the install script for that spec by POSTing it to `https://kurl.sh/installer`:
```bash
$ curl -X POST -H "Content-Type: text/yaml" --data-binary "@installer.yaml" https://kurl.sh/installer && echo ""
# https://kurl.sh/3138d30
```

The returned URL can be used to install a Kubernetes cluster:
```bash
curl https://kurl.sh/3138d30 | sudo bash
```

Refer to the [reference documentation](https://kots.io/reference/kubernetes-installers/kurl/) for a full list of options available in the installer yaml.
