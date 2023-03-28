---
path: "/docs/add-ons/aws"
date: "2022-05-10"
linktitle: "AWS"
weight: 31
title: "AWS Add-On"
addOn: "aws"
isDeprecated: true
---

## Deprecation Notice

### This add-on is deprecated.

As of March 27, 2023, kURL no longer intends to continue to offer this add-on as part of the ongoing kURL project. This add-on is now considered deprecated, and may no longer be offered by the project after April 31st, 2023. Existing installs that use this add-on will be best effort supported during this deprecation window.

## Summary

The AWS add-on enables the Kubernetes control plane to be configured to use the [Amazon Web Services (AWS) cloud provider integration](https://cloud-provider-aws.sigs.k8s.io/). For more information about these components, see the [Kubernetes `cloud-provider-aws`](https://github.com/kubernetes/cloud-provider-aws/#components) repository. For information about the kubeadm add-on, see [Kubernetes (kubeadm) Add-On](/docs/addon-ons/kubernetes).

This integration, provided by Kubernetes, creates an interface between the Kubernetes cluster and specific AWS APIs. This enables the:

- Dynamic provisioning of Elastic Block Store (EBS) volumes. See [Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) in the AWS documentation.
- Image retrieval from Elastic Container Registry (ECR). See [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/) in the AWS documentation.
- Dynamic provisioning and configuration of Elastic Load Balancers (ELBs) for exposing Kubernetes Service objects. [Amazon Elastic Load Balancers](https://aws.amazon.com/elasticloadbalancing/) in the AWS documentation.

For more information about the AWS cloud provider, see [AWS Cloud Provider](https://cloud-provider-aws.sigs.k8s.io/) in the Kubernetes documentation.

## Prerequisite
### IAM Roles and Policies
The AWS cloud provider performs some tasks on behalf of the operator, such as creating an ELB or an EBS volume. Considering this, you must create identity and access management (IAM) policies in your AWS account.

For more information about AWS IAM, see [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) in the AWS documentation. 

For more information about the required permissions for Amazon Web Services (AWS) cloud provider integration, see the [Prerequisites](https://kubernetes.github.io/cloud-provider-aws/prerequisites/) section in the Kubernetes documentation.

### Applying Policies by Tagging AWS Resources
After the prerequisite policies are created, you must assign them to the appropriate resources in your AWS account. 

For more information about AWS policies prerequisites, see [Prerequisites](https://kubernetes.github.io/cloud-provider-aws/prerequisites/) in the Kubernetes documentation. 

For more information about tagging, see [AWS Documentation: Tagging your Amazon EC2 Resources](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html) in the AWS documentation. 

The following resources are discovered and managed only after the tags are assigned: 

- **EC2 instances:**  The Elastic Compute Cloud (EC2) instances used for the kURL cluster. See [Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/) in the AWS documentation.
- **Security Groups:** The security groups used by the nodes in the kURL cluster.
- **Subnet:** The subnets used by the kURL cluster. 
- **VPC:** The VPC used by the kURL cluster. 

These resources must have a tag with the key of `kubernetes.io/cluster/<cluster-name>`. By default, the Kubernetes add-on uses the cluster name `kubernetes`. The value for this key is `owned`. Alternatively, if you choose to share resources between clusters, the value `shared` can be used. For more information about the Kubernetes add-on, see [Advanced Install Options](https://kurl.sh/docs/add-ons/kubernetes#advanced-install-options) in _Kubernetes add-on_. 


## Requirements and Limitations
### Supported Configurations

The AWS add-on is supported only:

- When the cluster created by kURL is installed on an AWS EC2 instance.
- With the Kubernetes (kubeadm) add-on. See [Kubernetes (kubeadm) add-on](/docs/addon-ons/kubernetes).

### AWS ELB and Kubernetes LoadBalancer Service Requirements

There are additional requirements when creating a `LoadBalancer` service:

- The AWS cloud provider requires that a minimum of two nodes are available in the cluster and that one of the nodes is assigned the `worker` node role to use this integration. See [Kubernetes AWS Cloud Provider](https://cloud-provider-aws.sigs.k8s.io/) in the Kubernetes documentation. **Failure to have two nodes available, one of which is a worker node, will require an AWS administrator for your account to manually register the ELB in the AWS management console.**

- When creating a `LoadBalancer` service where there is more than one security group attached to your cluster nodes, you must tag only one of the security groups as `owned` so that Kubernetes knows which group to add and remove rules from. A single, untagged security group is allowed, however, sharing this untagged security group between clusters is not recommended.
 
- Kubernetes uses subnet tagging to attempt to discover the correct subnet for the `LoadBalancer` service. This requires that these internet-facing and internal AWS ELB resources are properly tagged in your AWS account to operate successfully. For more information about AWS subnet tagging, see [AWS Documentation: Subnet tagging for load balancers](https://docs.aws.amazon.com/eks/latest/userguide/load-balancing.html#subnet-tagging-for-load-balancers) in the AWS documentation.


## Advanced Install Options

The following example shows the exclusion of AWS-EBS provisioner storage class provided by the AWS add-on:

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
