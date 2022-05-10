---
path: "/docs/add-ons/aws"
date: "2022-05-10"
linktitle: "AWS Add-On"
weight: 31
title: "AWS Add-On"
addOn: "aws"
---

The AWS add-on allows you to enable the Amazon Web Services (AWS) cloud provider for Kubernetes on clusters that kURL creates. With the AWS add-on for kURL, you can use the AWS cloud provider to allow kURL-created clusters to manage AWS resources. For more information about the AWS cloud provider for Kubernetes, see the [cloud-provider-aws](https://github.com/kubernetes/cloud-provider-aws) repository in GitHub.

## Advanced Install Options

```yaml
spec:
  aws:
    version: 0.1.0
    excludeStorageClass: false
```

flags-table

## Requirements and Limitations

* [Does this work for air gap installations on kURL clusters?]
* [Do you need a specific port available?]
* [Other?]
