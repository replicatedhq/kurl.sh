---
path: "/docs/create-installer/"
date: "2019-10-15"
weight: 20
linktitle: "Overview"
title: "Create An Installer"
---
The installer can support various add-ons. Removing an add-on from the spec will remove it from your installer. For a full list of supported add-ons and the advanced options they support see the [advanced reference documentation](add-on-adv-options).

An example spec may look like:
```yaml
apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: "my-installer"
spec:
  kubernetes:
    version: "1.25.x"
  weave:
    version: "2.6.x"
  contour:
    version: "1.22.x"
  minio:
    version: "latest"
  registry:
   version: "2.8.x"
  prometheus:
    version: "latest"
  containerd:
    version: "1.5.x"
  longhorn:
    version: "1.3.x"
  ekco:
    version: "latest"
  kotsadm:
    version: "latest"
```

## Versions
To pin a specific version of an add-on, you can specify a (supported) version of that add-on. Supported versions for each add-on can be found on the [add-ons](/add-ons) page. Since specifying a particular version will lock your installer to that version, you will not continue to get patch updates that include bug fixes and security patches. For this reason, it is recommended to use the [`.x` patch versions](#x-patch-versions) functionality.

### Latest Versions
When `"latest"` is the specified version for an add-on, this resolves to the latest recommended version of the component that is supported by our installer. This means that when an update to the component is shipped, your installer is automatically updated. This can be suitable in some scenarios, but Replicated strongly recommends that you specify particular versions that are tested and predictable for your installation use case, and to revisit these version declarations at least monthly as new add-on versions become available.

### `.x` Patch Versions
For add-ons that use [semantic versioning](https://semver.org), you can specify the version in the form `Major.Minor.x`. These versions will always resolve to the greatest patch version for the specified major and minor version of the add-on (e.g., 1.19.x). This is a great way to ensure you are using tested and predictable versions while continuing to receive bug fixes and security patches.

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
