---
path: "/docs/create-installer/creating-an-installer-ui"
date: "2019-10-15"
weight: 4
linktitle: "Create Installer UI"
title: "Create An Installer via UI"
---
## kurl.sh Installer Creation
[kurl.sh](https://kurl.sh) hosts a UI for configuring your Kubernetes distro and creating both an kURL URL and a kURL airgap package.  
![kurl](/kurl.png)

For each component you'll need to decide if you want to include the latest version, a specific tagged version or exclude the add-on all together.  
![kurl-pin](/kurl-pin.png)

As you make your selections the declarative YAML for the kURL manifest is dynamically built & displayed for you. Simultaneously, the install URL will change to a hash of the installation.  
![kurl-url](/kurl-url.png)

## Advanced Options
The kURL manifest can include [advanced configuration](add-on-adv-options) options for each add-on.  
![kurl-advanced](/kurl-advanced.png)
