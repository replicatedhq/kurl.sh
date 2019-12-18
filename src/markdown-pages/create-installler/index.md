---
path: "/docs/create-installer/"
date: "2019-10-15"
weight: 2
linktitle: "Overview"
title: "Create An Installer"
---
### UI-based Installer Creation
kURL hosts a website where users can specify a kURL manifest. Creating a new distro can be as easy as selecting a few drop down components. [Learn more](creating-an-installer-ui)

### API-based Installer Creation
kURL hosts an API where users can POST a kURL manifest. [Learn more](creating-an-installer-api)

### Managing a kURL installer
The generated URLs use a hash to identify a specific set of components and versions, but it's also possible to [create and manage custom Kubernetes URLs](https://kots.io/vendor/embedded-kubernetes/embedded-kubernetes/) with the [Replicated vendor dashboard](https://vendor.replicated.com).

For example, if you create a Replicated account and create an application named `SomeBigBank` then your account's kURL installer will become `curl -sSL https://kurl.sh/somebigbank | bash `. Beyond the vanity url, your Replicated team will be able to manage & update your new kURL distro as new add-ons or versions become available. Check out our overview for more information about [using kURL with Replicated KOTS](https://blog.replicated.com/kurl-with-replicated-kots/).
