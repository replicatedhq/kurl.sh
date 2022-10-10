---
path: "/docs/create-installer/host-preflights/block-devices"
date: "2022-01-13"
weight: 31
linktitle: "Block Devices"
title: "Block Devices"
---
 
The block devices host preflight check is used to detect and validate the block devices attached to the machine.

## Block Devices Collector

The `blockDevices` collector will collect information about the block devices.

### Parameters

The `blockDevices` collector accepts the [shared collector properties](https://troubleshoot.sh/docs/collect/collectors/#shared-properties).

## Block Devices Analyzer

The `blockDevices` analyzer supports multiple parameters for filtering:

`includeUnmountedPartitions`: Include unmounted partitions in the analysis. Disabled by default.<br/>
`minimumAcceptableSize`: The minimum acceptable size to filter the available block devices during analysis. This parameter is disabled by default.

Example outcomes:

`.* == 1`: One available block device detected.<br/>
`.* > 1`: Multiple available block devices detected.

## Example

Here is an example of how to use the block devices host preflight check:

```yaml
apiVersion: troubleshoot.sh/v1beta2
kind: HostPreflight
metadata:
  name: block-devices
spec:
  collectors:
    - blockDevices:
        # cStor is enabled and not upgrade
        exclude: '{{kurl and (and .Installer.Spec.OpenEBS.Version .Installer.Spec.OpenEBS.IsCstorEnabled) (not .IsUpgrade) | not }}'
  analyzers:
    - blockDevices:
        includeUnmountedPartitions: true
        minimumAcceptableSize: 10737418240 # 1024 ^ 3 * 10, 10GiB
        exclude: '{{kurl and (and .Installer.Spec.OpenEBS.Version .Installer.Spec.OpenEBS.IsCstorEnabled) (not .IsUpgrade) | not }}'
        outcomes:
        - pass:
            when: ".* == 1"
            message: One available block device
        - pass:
            when: ".* > 1"
            message: Multiple available block devices
        - fail:
            message: No available block devices
```
