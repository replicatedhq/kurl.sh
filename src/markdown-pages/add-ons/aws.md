---
path: "/docs/add-ons/aws"
date: "2022-05-10"
linktitle: "AWS Add-On"
weight: 31
title: "AWS Add-On"
addOn: "aws"
---

The AWS add-on allows you to customize the configuration of the [Kubernetes (kubeadm)](/docs/addon-ons/kubernetes) control plane to interface to the AWS cloud provider service for storage classes. This means that the apiserver, controllermanager, and kubelet will all be started with the extra argument specifying that the cloud provider is AWS. This enables you to have Kubernetes provision [persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)directly from the default storage classes available from AWS to the machine that kURL is installed on running in AWS. If needed, the advanced option `ExcludeStorageClass` may be used to exclude the `aws-ebs` provisioner storage class provided by the AWS add-on. For more information about the AWS cloud provider for Kubernetes, see the [cloud-provider-aws](https://github.com/kubernetes/cloud-provider-aws) repository in GitHub.

## Advanced Install Options

```yaml
spec:
  aws:
    version: 0.1.0
    excludeStorageClass: false
```

flags-table

## Requirements and Limitations

* When used, a volume provisioner add-on does not need to be included in the kURL specification as [AWS EBS](https://aws.amazon.com/ebs/) will be used.
* This add-on currently only configures the above mentioned portions of the Kubernetes control plane and only uses AWS for storage provisioner services.
* This add-on is only intended to be used on AWS.  
