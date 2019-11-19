---
path: "/docs/add-on-author/contributing-an-add-on"
date: "2019-10-15"
linktitle: "Contributing Add-ons"
weight: 1
title: "Contributing an Add-On"
---

## Structure

New add-ons should be added to a source directory following the format `/addons/<name>/<version>`.
That directory must have at least two files: `install.sh` and `Manifest`.

The Manifest file specifies a list of images required for the add-on.
These will be pulled during CI and saved to the directory `/addons/<name>/<version>/images/`.

The install.sh script must define a function named `<add-on>` that will perform the install.
For example, `/addons/weave/2.5.2/install.sh` defines the function named `weave`.

Most add-ons include yaml files that will be applied to the cluster.
These should be copied to the directory `kustomize/<name>` and applied with `kubectl apply -k` rather than applied directly with `kubectl apply -f`.
This will allow users to easily review all applied yaml, add their own patches and re-apply after the script completes.

All files and directories in the add-on's source directory will be included in the package built for the add-on.
The package will be built and uploaded to `s3://kurl-sh/dist/<name>-<version>.tar.gz` during CI.
It can be downloaded directly from S3 or by redirect from `https://kurl.sh/dist/<name>-<version>.tar.gz`.
The built package will include the images from the Manifest saved as tar archives.

The install.sh script may also define the functions `<name>_pre_init` and `<name>_join`.
The pre_init function will be called prior to initializing the Kubernetes cluster.
This may be used to modify the configuration that will be passed to `kubeadm init`.
The join function will be called on remote nodes before they join the cluster and is useful for host configuration tasks such as loading a kernel module.

## Runtime

For online installs, the add-on package will be downloaded and extracted at runtime.
For airgap installs, the add-on package will already be included in the installer bundle.

The [addon](https://github.com/replicatedhq/kurl/blob/master/scripts/common/addon.sh) function in Kurl will first load all images from the add-on's `images/` directory and create the directory `<KURL_ROOT>/kustomize/<add-on>`.
It will then dynamically source the `install.sh` script and execute the function named `<add-on>`.

## Developing Add-ons

The `DIR` env var will be defined to the install root.
Any yaml that is ready to be applied unmodified should be copied from the add-on directory to the kustomize directory.
```
cp "$DIR/addons/weave/2.5.2/kustomization.yaml" "$DIR/kustomize/weave/kustomization.yaml"
```

The [`insert_resources`](https://github.com/replicatedhq/kurl/blob/5e6c9549ad6410df1f385444b83eabaf42a7e244/scripts/common/yaml.sh#L29) function can be used to add an item to the resources object of a kustomization.yaml:
```
insert_resources "$DIR/kustomize/weave/kustomization.yaml" secret.yaml
```

The [`insert_patches_strategic_merge`](https://github.com/replicatedhq/kurl/blob/5e6c9549ad6410df1f385444b83eabaf42a7e244/scripts/common/yaml.sh#L18) function can be used to add an item to the `patchesStrategicMerge` object of a kustomization.yaml:
```
insert_patches_strategic_merge "$DIR/kustomize/weave/kustomization.yaml" ip-alloc-range.yaml
```

The [`render_yaml_file`](https://github.com/replicatedhq/kurl/blob/5e6c9549ad6410df1f385444b83eabaf42a7e244/scripts/common/yaml.sh#L18) function can be used to substitute env vars in a yaml file at runtime:
```
render_yaml_file "$DIR/addons/weave/2.5.2/tmpl-secret.yaml" > "$DIR/kustomize/weave/secret.yaml"
```