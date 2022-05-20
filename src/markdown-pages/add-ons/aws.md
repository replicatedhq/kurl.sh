---
path: "/docs/add-ons/aws"
date: "2022-05-10"
linktitle: "AWS Add-On"
weight: 31
title: "AWS Add-On"
addOn: "aws"
---

The AWS add-on enables the Amazon Web Services (AWS) cloud provider integration with the Kubernetes (kubeadm) kURL add-on. For information about the kubeadm add-on, see [Kubernetes (kubeadm) Add-On](/docs/addon-ons/kubernetes).

The AWS cloud provider integration creates an interface between the Kubernetes cluster and AWS service APIs. This enables the dynamic provisioning of Elastic Block Store (EBS) volumes, image retrieval from [Elastic Container Registry](https://aws.amazon.com/ecr/), and dynamic provisioning and configuration of Elastic Load Balancers (ELBs) for exposing Kubernetes Service objects.

For more information about the AWS cloud provider, see the [AWS cloud provider](https://cloud-provider-aws.sigs.k8s.io/) online documentation.

## Prerequisite

Because the AWS cloud controller manager performs some tasks on behalf of the operator, such as creating an ELB or an EBS volume, you must create Identity and Access Management (IAM) policies in AWS and assign them to your Elastic Compute Cloud (EC2) instances.

For more information about the required permissions, see [Prerequisites](https://kubernetes.github.io/cloud-provider-aws/prerequisites/) in the AWS cloud provider documentation.

## Requirements and Limitations

* The AWS add-on is supported only when the cluster created by kURL is installed on an AWS EC2 instance.
* The AWS add-on is supported only with the [Kubernetes (kubeadm) add-on](/docs/addon-ons/kubernetes). The AWS add-on is not supported for the [K3s](/docs/addon-ons/k3s) or [RKE2](/docs/addon-ons/rke2) add-ons.

## Advanced Install Options

```yaml
spec:
  aws:
    version: 0.1.0
    excludeStorageClass: false
```

flags-table

## Using a Volume Provisioner with the AWS Add-On

When the AWS add-on is enabled, you do not need to add a volume provisioner add-on to the kURL specification because you can use the default AWS EBS volume provisioner.

For more information about the AWS EBS volume provisioner, see [Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) on the AWS website.
