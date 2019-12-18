---
path: "/docs/create-installer/"
date: "2019-10-15"
weight: 2
linktitle: "Overview"
title: "Create An Installer"
---
The installer can support various add-ons. Removing an add-on from the spec will remove it from your installer. For a full list of supported add-ons and the advanced options they support see the [advanced reference documentation](add-on-adv-options).

```yaml
apiVersion: kurl.sh/v1beta1
kind: Installer
metadata:
  name: "my-installer"
spec:
  kubernetes:
    version: "latest"
  docker:
    version: "latest"
  weave:
    version: "latest"
  rook:
    version: "latest"
  contour:
    version: "latest"
  kotsadm:
    version: "latest"
```

## Versions
For add-ons that are using `version: "latest"` this will be pinned to the latest version of the component that is supported by our installer. This means that when an update to the component is shipped, your installer will automatically be updated. This may be desirable in some scenarios, while other installers may want to have tested, locked and predictable installed versions. You can also list a specific (supported) version of an add on and it will be locked to that version.

## Distro Hash
The hash for a specific distro is immutable, each hash references a specific combination of components and versions. Mutable, vanity urls are available for Replicated customers as described below in **Managing a kURL Installer**.

## Creation & Management Options
### UI-based Installer Creation
kURL hosts a website where users can specify a kURL manifest. Creating a new distro can be as easy as selecting a few drop down components. [Learn more](creating-an-installer-ui)

### API-based Installer Creation
kURL hosts an API where users can POST a kURL manifest. [Learn more](creating-an-installer-api)

### Managing a kURL installer
The generated URLs use a hash to identify a specific set of components and versions, but it's also possible to [create and manage custom Kubernetes URLs](https://kots.io/vendor/embedded-kubernetes/embedded-kubernetes/) with the [Replicated vendor dashboard](https://vendor.replicated.com).

For example, if you create a Replicated account and then create an application named `SomeBigBank` then your account's kURL installer will become `curl -sSL https://kurl.sh/somebigbank | bash `. Beyond the vanity url, your Replicated team will be able to manage & update your new kURL distro as new add-ons or versions become available. Check out our overview for more information about [using kURL with Replicated KOTS](https://blog.replicated.com/kurl-with-replicated-kots/).
