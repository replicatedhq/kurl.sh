---
path: "/docs/add-ons/aws"
date: "2022-05-10"
linktitle: "AWS Add-On"
weight: 31
title: "AWS Add-On"
addOn: "aws"
---

The AWS add-on enables the [AWS cloud provider](https://github.com/kubernetes/cloud-provider-aws) integration with the [Kubernetes (kubeadm) add-on](/docs/addon-ons/kubernetes). The AWS cloud provider provides the interface between a Kubernetes cluster and AWS service APIs. This project enables dynamic provisioning of Elastic Block Store (EBS) volumes as well as dynamic provisioning/configuration of Elastic Load Balancers (ELBs) for exposing Kubernetes Service objects.

Because the AWS cloud controller manager performs some tasks on behalf of the operator, like creating an ELB or an EBS volume, you will need to create IAM policies and assign them to your EC2 instances. Please see the [prerequisites guide](https://kubernetes.github.io/cloud-provider-aws/prerequisites/) for the permissions needed.

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
