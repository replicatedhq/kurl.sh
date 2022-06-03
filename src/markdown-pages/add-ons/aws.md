---
path: "/docs/add-ons/aws"
date: "2022-05-10"
linktitle: "AWS Add-On"
weight: 31
title: "AWS Add-On"
addOn: "aws"
---

The AWS add-on enables the use of the [Amazon Web Services (AWS) cloud provider](https://github.com/kubernetes/cloud-provider-aws/) integration with the Kubernetes (kubeadm) kURL add-on. For information about the kubeadm add-on, see [Kubernetes (kubeadm) Add-On](/docs/addon-ons/kubernetes).

This integration creates an interface between the Kubernetes cluster and specific Amazon Web Services APIs. This enables the:

- Dynamic provisioning of [Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) volumes.
- Image retrieval from [Elastic Container Registry](https://aws.amazon.com/ecr/).
- Dynamic provisioning and configuration of [Elastic Load Balancers (ELBs)](https://aws.amazon.com/elasticloadbalancing/) for exposing Kubernetes Service objects.

For more information about the AWS cloud provider, see the [AWS cloud provider](https://cloud-provider-aws.sigs.k8s.io/) online documentation.

## Prerequisite
### IAM Roles and Policies
The AWS cloud provider performs some tasks on behalf of the operator, such as creating an ELB or an EBS volume. Considering this, you must create [Identity and Access Management (IAM)](https://aws.amazon.com/iam/) policies in your AWS account. For more information about the required permissions for Amazon Web Services (AWS) cloud provider integration, see the [Prerequisites](https://kubernetes.github.io/cloud-provider-aws/prerequisites/) section in the Kubernetes documentation.

### Applying Policies by Tagging AWS Resources
Once the [prerequisite policies](https://kubernetes.github.io/cloud-provider-aws/prerequisites/) have been created, they must be assigned to the appropriate resources in your AWS account. For more details, please see the [AWS Documentation: Tagging your Amazon EC2 Resources](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html). The following resources are only discovered and managed once the tags are in place: 

- **EC2 instances:**  The [Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/) instances used for the kURL cluster.
- **Security Groups:** The security group(s) used by the nodes in the kURL cluster.
- **Subnet:** The subnets used by the kURL cluster. 
- **VPC:** The VPC used by the kURL cluster. 

These resources must have a tag with the key of `kubernetes.io/cluster/<cluster-name>`. By default, the [Kubernetes add-on](https://kurl.sh/docs/add-ons/kubernetes#advanced-install-options) uses the cluster name `kubernetes`. The value for this key is `owned`. Alternatively, if you choose to share resources between clusters, the value `shared` may be used.  


## Requirements and Limitations
### Supported Configurations
The AWS add-on is supported only:

- When the cluster created by kURL is installed on an AWS EC2 instance.
- With the [Kubernetes (kubeadm) add-on](/docs/addon-ons/kubernetes).
The AWS add-on **is not** supported for the [K3s](/docs/addon-ons/k3s) or [RKE2](/docs/addon-ons/rke2) add-ons.

### ELB and LoadBalancer Service Requirements
There are additional requirements when creating a `LoadBalancer` service:
- The [AWS cloud provider](https://cloud-provider-aws.sigs.k8s.io/) requires that a minimum of two nodes are available in the cluster and that one of the nodes is assigned the `worker` node role in order to use this integration. 
- When creating a `LoadBalancer` service where there is more than one security group attached to your cluster nodes, you must tag only one of the security groups as `owned` so that Kubernetes knows which group to add and remove rules from. A single untagged security group is allowed, however sharing this between clusters is not recommended.  
- Kubernetes will use subnet tagging in order to attempt to discover the correct subnet for the `LoadBalancer` service; this requires that these internet-facing and internal AWS ELB resources are properly tagged in your AWS account to operate successfull. For further details, please see [AWS Documentation: Subnet tagging for load balancers](https://docs.aws.amazon.com/eks/latest/userguide/load-balancing.html#subnet-tagging-for-load-balancers).


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
