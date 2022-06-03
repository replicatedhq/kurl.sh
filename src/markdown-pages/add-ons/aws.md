---
path: "/docs/add-ons/aws"
date: "2022-05-10"
linktitle: "AWS Add-On"
weight: 31
title: "AWS Add-On"
addOn: "aws"
---

The AWS add-on enables the Amazon Web Services (AWS) cloud provider integration with the Kubernetes (kubeadm) kURL add-on. For information about the kubeadm add-on, see [Kubernetes (kubeadm) Add-On](/docs/addon-ons/kubernetes).

The AWS cloud provider integration creates an interface between the Kubernetes cluster and AWS service APIs. This enables the:

- Dynamic provisioning of [Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) volumes.
- Image retrieval from [Elastic Container Registry](https://aws.amazon.com/ecr/).
- Dynamic provisioning and configuration of [Elastic Load Balancers (ELBs)](https://aws.amazon.com/elasticloadbalancing/) for exposing Kubernetes Service objects.

For more information about the AWS cloud provider, see the [AWS cloud provider](https://cloud-provider-aws.sigs.k8s.io/) online documentation.

## Prerequisite
### IAM Roles and Policies
The AWS cloud controller manager performs some tasks on behalf of the operator, such as creating an ELB or an EBS volume. Considering this, you must create Identity and Access Management (IAM) policies in AWS and assign them to your Elastic Compute Cloud (EC2) instances. For more information about the required permissions for Amazon Web Services (AWS) cloud provider integration, see the [Prerequisites](https://kubernetes.github.io/cloud-provider-aws/prerequisites/) section in the Kubernetes documentation.

### Applying Policies to EC2 Instances
For information about applying policies to your EC2 instance, see [IAM roles for Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) and the example [Amazon EC2: Allows Managing EC2 Security Groups with a Specific Tag Key-Value Pair](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_ec2_securitygroups-vpc.html) in the AWS documentation. 

The tag key is `kubernetes.io/cluster/<cluster-name>` and, by default, the [Kubernetes add-on](https://kurl.sh/docs/add-ons/kubernetes#advanced-install-options) uses the cluster name `kubernetes`. 


## Requirements and Limitations

The AWS add-on is supported only:

- When the cluster created by kURL is installed on an AWS EC2 instance.
- With the [Kubernetes (kubeadm) add-on](/docs/addon-ons/kubernetes). 

The AWS add-on is not supported for the [K3s](/docs/addon-ons/k3s) or [RKE2](/docs/addon-ons/rke2) add-ons.

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

For more information about the AWS EBS volume provisioner, see [Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) in the the AWS documentation.
