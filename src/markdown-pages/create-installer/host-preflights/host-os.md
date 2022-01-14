---
path: "/docs/create-installer/host-preflights/operating-system"
date: "2022-01-13"
weight: 30
linktitle: "Operating System"
title: "Operating System"
---
 
The operating system host preflight check can be used to detect and validate the name and version of the OS installed on the machine.

## Operating System Collector

The `hostOS` collector will collect information about the OS installed on the machine.

### Parameters

The `hostOS` collector accepts the [shared collector properties](https://troubleshoot.sh/docs/collect/collectors/#shared-properties).

## Operating System Analyzer

The `hostOS` analyzer supports multiple outcomes by validating the name and version of the detected operating system. For example:

`centos = 7`: The detected OS is CentOS 7.<br/>
`ubuntu = 20.04`: The detected OS is Ubuntu 20.04.

## Example

Here is an example of how to use the host OS host preflight check:

```yaml
apiVersion: troubleshoot.sh/v1beta2
kind: HostPreflight
metadata:
  name: operating-system
spec:
  collectors:
    - hostOS: {}
  analyzers:
    - hostOS:
        outcomes:
          - pass:
              when: "centos = 7"
              message: "CentOS 7 is supported"
          - pass:
              when: "centos = 8"
              message: "CentOS 8 is supported"
          - fail:
              when: "ubuntu = 16.04"
              message: "Ubuntu 16.04 is not supported"
          - pass:
              when: "ubuntu = 18.04"
              message: "Ubuntu 18.04 is supported"
          - pass:
              when: "ubuntu = 20.04"
              message: "Ubuntu 20.04 is supported"
```
