---
path: "/docs/create-installer/host-preflights/tcp-connect"
date: "2022-01-13"
weight: 40
linktitle: "TCP Connect"
title: "TCP Connect"
---
 
The TCP connect host preflight check is used to validate that the machine is able to connect to a certain TCP address.

## TCP Connect Collector

The `tcpConnect` collector will collect information about the ability to connect to the the specified TCP address.

### Parameters

In addition to the [shared collector properties](https://troubleshoot.sh/docs/collect/collectors/#shared-properties), the `tcpConnect` collector accepts the following parameters:

#### `address`

The address to check the connection to.

## TCP Connect Analyzer

The `tcpConnect` analyzer supports multiple outcomes:

`connection-refused`: Connection to the address was refused.<br/>
`connection-timeout`: Timed out connecting to the address.<br/>
`connected`: Successfully connected to the address.<br/>
`error`: Unexpected error connecting to the address.

## Example

Here is an example of how to use the TCP connect host preflight check:

```yaml
apiVersion: troubleshoot.sh/v1beta2
kind: HostPreflight
metadata:
  name: tcp-connect
spec:
  collectors:
    - tcpConnect:
        collectorName: "Kubernetes API TCP Connection Status"
        address: '{{kurl .Installer.Spec.Kubernetes.MasterAddress }}'
        # Run when joining nodes
        exclude: '{{kurl and .Installer.Spec.Kubernetes.Version .Installer.Spec.Kubernetes.MasterAddress .IsJoin | not }}'
  analyzers:
    - tcpConnect:
        checkName: "Kubernetes API TCP Connection Status"
        collectorName: "Kubernetes API TCP Connection Status"
        exclude: '{{kurl and .Installer.Spec.Kubernetes.Version .Installer.Spec.Kubernetes.MasterAddress .IsJoin | not }}'
        outcomes:
          - fail:
              when: "connection-refused"
              message: Connection to the Kubernetes API at address {{kurl .Installer.Spec.Kubernetes.MasterAddress }} was refused
          - fail:
              when: "connection-timeout"
              message: Timed out connecting to the Kubernetes API at address {{kurl .Installer.Spec.Kubernetes.MasterAddress }}
          - fail:
              when: "error"
              message: Unexpected error connecting to the Kubernetes API at address {{kurl .Installer.Spec.Kubernetes.MasterAddress }}
          - pass:
              when: "connected"
              message: Successfully connected to the Kubernetes API at address {{kurl .Installer.Spec.Kubernetes.MasterAddress }}
```
