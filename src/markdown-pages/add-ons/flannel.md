---
path: "/docs/add-ons/flannel"
date: "2022-10-19"
linktitle: "Flannel"
weight: 38
title: "Flannel Add-On"
addOn: "flannel"
---

[Flannel](https://github.com/flannel-io/flannel) implements the Container Network Interface (CNI) to enable pod networking in a Kubernetes cluster.
Flannel runs a small, single binary agent called flanneld in a Pod on each host, and is responsible for allocating a subnet lease to each host out of a larger, preconfigured address space.
Flannel uses the Kubernetes API directly to store the network configuration, the allocated subnets, and any auxiliary data (such as the host's public IP).
Packets are forwarded using VXLAN encapsulation.

## Advanced Install Options

```yaml
spec:
  flannel:
    version: "0.20.0"
    podCIDR: "10.32.0.0/22"
    podCIDRRange: "/22"
```

flags-table

## System Requirements

The following additional ports must be open between nodes for multi-node clusters:

#### Primary Nodes:

| Protocol | Direction | Port Range | Purpose                 | Used By |
| -------  | --------- | ---------- | ----------------------- | ------- |
| UDP      | Inbound   | 8472       | Flannel VXLAN           | All     |

#### Secondary Nodes:

| Protocol | Direction | Port Range | Purpose                 | Used By |
| -------  | --------- | ---------- | ----------------------- | ------- |
| UDP      | Inbound   | 8472       | Flannel VXLAN           | All     |

## Firewalls

When using a stateless packet filtering firewall, to allow for outgoing TCP connections, it is common to configure the firewall to allow packets with TCP flags "ack" with destination port range 32768-65535 as this is the default range specified by the kernel /proc/sys/net/ipv4/ip_local_port_range.

Flannel uses a larger range when doing SNAT, thus this range must be expanded to 1024-65535.

An example rule is as follows:

```
| Name               | Source IP   | Destination IP | Source port | Destination port | Protocol | TCP flags | Action |
| ----               | ---------   | -------------- | ----------- | ---------------- | -------- | --------- | ------ |
| Allow outgoing TCP | 0.0.0.0/0   | 0.0.0.0/0      | 0-65535     | 1024-65535       | tcp      | ack       | accept |
```

## Custom Pod Subnet

The Pod subnet will default to `10.32.0.0/20` if available.
If not available, the installer will attempt to find an available range with prefix bits 20 in the `10.32.0.0/16` or `10.0.0.0/8` address spaces.
This can be overridden using the `podCIDR` to specify a specific address space, or `podCIDRRange` to specify a different prefix bits.

## Limitations

* Flannel is not compatible with the Docker container runtime
* Network Policies are not supported
* IPv6 and dual stack networks are not supported
* Encryption is not supported

## Migration from Weave

You must use the Containerd CRI runtime when migrating from Weave to Flannel. For more information about limitations, see [Limitations](#limitations).

The migration process results in downtime for the entire cluster because Weave must be removed before Flannel can be installed.
Every pod in the cluster is also deleted and then recreated, to receive new IP addresses allocated by Flannel.

The migration is performed by rerunning the installer with Flannel v0.20.2+ as the configured CNI.
The user is presented with a prompt to confirm the migration:

```bash
The migration from Weave to Flannel will require whole-cluster downtime.
Would you like to continue? (Y/n)
```

If there are additional nodes in the cluster, the user is prompted to run a command on each node.

For additional primary nodes, the command looks similar to the following example:

```bash
Moving primary nodes from Weave to Flannel requires removing certain weave files and restarting kubelet.
Please run the following command on each of the listed primary nodes:

<additional primary node 1>
<additional primary node 2>

	curl -fsSL https://kurl.sh/version/<version>/<installer>/tasks.sh | sudo bash -s weave-to-flannel-primary cert-key=<generated>

Once this has been run on all nodes, press enter to continue.
```

For secondary nodes, the command looks similar to the following example:

```bash
Moving from Weave to Flannel requires removing certain weave files and restarting kubelet.
Please run the following command on each of the listed secondary nodes:

<secondary node 1>
<secondary node 2>
<secondary node 3>

	curl -fsSL https://kurl.sh/version/<version>/<installer>/tasks.sh | sudo bash -s weave-to-flannel-secondary

Once this has been run on all nodes, press enter to continue.
```

After these scripts run, the migration takes several additional minutes to recreate the pods in the cluster.

**Important:** Migrating from Weave to Flannel requires careful attention. There will be a period during the migration when the cluster operates without a Container Network Interface.
In the event of an unexpected error leading to the migration's interruption, the cluster may end up in an unhealthy state.
In such cases, users have the option to reattempt the installation, which will ensure the completion of any pending tasks.
If the migration encounters failures and re-running the installation process fails during initial cluster health assessment, users can utilize the `-s host-preflight-ignore` option.
This option instructs the installer to disregard host preflight failures and warnings, offering a potential workaround for overcoming migration obstacles.
