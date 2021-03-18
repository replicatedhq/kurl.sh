---
path: "/docs/install-with-kurl/configuring-public-cloud-load-balancers"
date: "2021-03-18"
weight: 14
linktitle: "Configuring Public Cloud Load Balancers"
title: "Configuring Public Cloud Load Balancers"
---
Highly Available kURL installs require a Layer 4 TCP load balancer that supports hairpinning. This topic provides steps for a working configuration in AWS, Azure, and GCP.

**NOTE**: We recommend that you begin the kURL install with a single primary behind the load balancer, although this is only a strict requirement for GCP. This reduces the chance that a kURL install may fail due to the load balancer forwarding traffic to an instance which isn't yet initialized. You should add the additional primaries to the backend target groups/pools after you've joined them to the kURL cluster.

## AWS Network Load Balancer (Internal/Internet-Facing)
Internal NLBs in AWS do not support hairpinning or loopback, so in order to allow backend instances to access themselves through an internal load balancer, you must register instances in your target group by their IP and not the instance ID. If you are using an internet-facing load balancer, then both Instance and IP mode for the target group will work.

1. Create a target group for port 6443
    1. Set the target type to `IP Addresses` if using an internal load balancer, otherwise, you can optionally set the target type to `Instances`
    2. Set a name for the target group
    3. Set the Protocol to `TCP`
    4. Set the Port to `6443`
    5. Select the VPC where the kURL EC2 instances live
    6. Set the Health Check protocol to `TCP`
    7. The port for the health checks should be `Traffic Port` in the `Advanced health check settings` drop-down, otherwise, all other settings can be left to their defaults or set per your organization's requirements
    8. Add the first kURL primary to the target group
2. Create an AWS Network Load Balancer
    1. Set a name for the load balancer
    2. Set the scheme appropriately based on if the load balancer will be public or private
    3. Leave the address type as `IPv4`
    4. Select the VPC and subnets where the kURL EC2 instances live under the `Network mapping` section
    5. Add a Listener for 6443
        1. Set the Procotol to `TCP`
        2. Set the port to `6443`
        3. Set the default action to forward to your `6443` target group that includes your kURL instance IPs

**NOTE**: AWS Network Load Balancers do not have security groups associated with them. Ingress access to the IP addresses in your target group is defined by the security groups on the instances themselves. You need to ensure that the security group on your kURL EC2 instances allows traffic from the IP address of the AWS NLB. If the load balancer is public, you need to include the IP addresses of clients as well.

## Azure Load Balancer (Internet-Facing)
Internal Load Balancers in Azure do not support hairpinning. There are workarounds such as adding a second NIC with static routes or creating a loopback interface, but those are out of scope of this topic.

1. Create an Azure Load Balancer
    1. Set a name for the load balancer
    2. Set the region to where the kURL EC2 instances live
    3. Set the Type to `Public`
    4. Set the SKU to `Standard`
    5. Set the Tier to `Regional`
    6. Create a new Public IP address for the load balancer or use an existing one
2. Create a Backend Pool
    1. Set a name for the pool
    2. Set Backend Pool Configuration to `NIC`
    3. Set IP Version to `IPv4`
    4. Add the first kURL VM to the backend pool
3. Create a Health Probe
    1. Set a name for the probe
    2. Set the protocol to `TCP`
    3. Set the port to `6443`
    4. If needed per your organization's requirements, change the defaults for `Interval` and `Unhealthy Threshold`
4. Create a Load Balancer Rule
    1. Set a name for the rule
    2. Set IP Version to `IPv4`
    3. Select the frontend IP address for the kURL load balancer
    4. Set the protocol to `TCP`
    5. Set the port to `6443`
    6. Set the backend port to `6443`
    7. Set the backend pool to the kURL pool you created earlier
    8. Set `Outbound source network address translation` to `Outbound and inbound use the same IP`

**NOTE**: Ingress access for Azure Load Balancers is defined by the inbound port rules on the VMs in the backend pool. You need to ensure that your port rules are configured to allow traffic for destination port `6443` in your VM's networking settings.

## Google Cloud Platform (Internet-Facing)
Hairpinning is supported by default when using a machine image provided by GCP. VM instances are automatically configured to route traffic destined for the load balancer to the loopback address of the VM where the traffic originated.

**NOTE**: The below configuration does not cover the usage of instance groups.

1. Create a Health Check
    1. Set a name for the health check
    2. Set the scope
    3. Set the protocol to `TCP`
    4. Set the port to `6443`
    5. All other settings can be left to their defaults or set per your organization's requirements
2. Create a TCP Load Balancer
    1. For `Internet facing or internal only` set `From Internet to my VMs`
    2. For `Multiple regions or single region` set `Single region only`
    3. For `Backend type` set `Target Pool or Target Instance`
    4. Continue to the next page and set a name for the load balancer
    5. Create a Backend Configuration
        1. Set the region to where the kURL instances live
        2. Select your first kURL primary in the `Select existing instances` tab
        3. Under the health check drop-down select the health check you created earlier
    6. Create a Frontend Configuration
        1. Set the `Network Service Tier` per your requirements
        2. Create a new reserved IP address or use an existing one
        3. Set the port to `6443`
        4. Create the load balancer

**NOTE**: After the initial install is done, you need to join any additional masters to the kURL cluster before adding them to the backend configuration of your load balancer to ensure the join script runs successfully.

### Adding Backend Configuration for NodePort services
Due to GCP's workaround for hairpinning, traffic may blackhole when attempting to access NodePorts through the load balancer. This is because GCP automatically routes traffic destined for the load balancer to the loopback address of the VM the request was forwarded to, and kube-proxy does not listen on localhost. To workaround this and successfully access NodePorts through the load balancer, you will need to create an alias for the primary network interface that resolves to the load balancer's IP address e.g., `ifconfig eth0:0 <lb-ip> netmask 255.255.255.255 up`. To persist these changes you will need to add them to your network interfaces configuration file.
