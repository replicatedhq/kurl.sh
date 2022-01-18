---
path: "/docs/create-installer/host-preflights/"
date: "2022-01-13"
weight: 24
linktitle: "Customizing Host Preflights"
title: "Customizing Host Preflights"
---

While there are [default host preflight checks](/docs/install-with-kurl/host-preflights) that kURL runs during an installation or upgrade, these host preflight checks are customizable.
There are two mechanisms for customizing host preflight checks: 
* Supplying additional host preflight checks as part of the kURL installer spec
* Disabling the default host preflight checks
Combined, these two mechanisms let you add custom host preflight checks that will run in addition to the defaults, or disable the default host preflight checks and run your own customized host preflight checks.

## Adding Custom Host Preflight Checks

To add custom host preflight checks to your installer, you can supply a `HostPreflight` spec in the kURL installer spec.
Specifically, those host preflight checks can be added in the kURL installer spec under `spec.kurl.hostPreflights`.
For more information about `HostPreflight` field,  see the [kURL add-on](/docs/add-ons/kurl) documentation.
For examples of host preflight specs, see the following sections on [reproducing the default host preflights](#reproducing-the-default-host-preflights) and [finding the add-on host preflights](#finding-the-add-on-host-preflights). These will show the host preflight specs that kURL uses by default.

## Excluding the Default Host Preflight Checks

The default host preflight checks can be excluded by setting the `spec.kurl.excludeBuiltinPreflights` field to `true`. See the [kURL add-on docs](/docs/add-ons/kurl) for additional information.

## Modifying the Default Host Preflight Checks

To modify the default host preflight checks, exclude the default host preflight checks and [provide your own custom host preflight checks](#adding-custom-host-preflights) to replace them.
The best practice is to reproduce the default host preflight checks run by kURL, make your changes, and include that host preflight spec in your kURL installer spec.

### Reproducing the Default Host Preflight Checks

To reproduce the default host preflight checks, you must combine the general host preflight checks that always run with any add-on host preflight checks that are needed for your installer.
For more information about the general host preflight checks that run with all installers, see [the kURL host preflights YAML](https://github.com/replicatedhq/kURL/blob/main/pkg/preflight/assets/host-preflights.yaml). These run for all installers, regardless of which add-ons are included.
The add-on host preflight checks can be found in directories that are specific to that add-on.

#### Finding the Add-On Host Preflights Checks

For each of the add-ons that you are using that have default host preflight checks: 
    1. Go to the add-on directory linked below
    1. Choose the directory for the appropriate version of that add-on
    1. Find the `host-preflight.yaml` file

For example, if your installer includes KOTS version 1.59.0, you would find the host preflight file at this link: https://github.com/replicatedhq/kURL/blob/main/addons/kotsadm/1.59.0/host-preflight.yaml.

Weave: https://github.com/replicatedhq/kURL/tree/main/addons/weave<br>
Rook: https://github.com/replicatedhq/kURL/tree/main/addons/rook<br>
OpenEBS: https://github.com/replicatedhq/kURL/tree/main/addons/openebs<br>
Prometheus: https://github.com/replicatedhq/kURL/tree/main/addons/prometheus<br>
Longhorn: https://github.com/replicatedhq/kURL/tree/main/addons/longhorn<br>
Containerd: https://github.com/replicatedhq/kURL/tree/main/addons/containerd<br>
KOTS: https://github.com/replicatedhq/kURL/tree/main/addons/kotsadm

#### Merging Host Preflight Checks into One Spec

After you have found the general host preflight checks and the add-on host preflight checks that you need, you can merge these into one host preflight spec by combining the list of collectors and analyzers for each.
For example, the following YAML combines the host preflight checks for [Longhorn v1.2.2](https://github.com/replicatedhq/kURL/blob/main/addons/longhorn/1.2.2/host-preflight.yaml) and [Prometheus v0.49.0-17.1.3](https://github.com/replicatedhq/kURL/blob/main/addons/prometheus/0.49.0-17.1.3/host-preflight.yaml):
```yaml
apiVersion: troubleshoot.sh/v1beta2
kind: HostPreflight
metadata:
  name: longhorn-and-prometheus
spec:
  collectors:
    - diskUsage:
        collectorName: "Longhorn Disk Usage"
        path: /var/lib/longhorn
    - tcpPortStatus:
        collectorName: "Node Exporter Metrics Server TCP Port Status"
        port: 9100
        exclude: '{{kurl .IsUpgrade }}'

  analyzers:
    - diskUsage:
        checkName: "Longhorn Disk Usage"
        collectorName: "Longhorn Disk Usage"
        exclude: '{{kurl .IsUpgrade }}' # only run if this is not an upgrade
        outcomes:
          - fail:
              when: "total < 50Gi"
              message: The disk containing directory /var/lib/longhorn has less than 50Gi of total space
          - fail:
              when: "used/total > 80%"
              message: The disk containing directory /var/lib/longhorn is more than 80% full
          - warn:
              when: "used/total > 60%"
              message: The disk containing directory /var/lib/longhorn is more than 60% full
          - pass:
              message: The disk containing directory /var/lib/longhorn has at least 20Gi disk space available and is at least 50Gi in size
    - tcpPortStatus:
        checkName: "Node Exporter Metrics Server TCP Port Status"
        collectorName: "Node Exporter Metrics Server TCP Port Status"
        exclude: '{{kurl .IsUpgrade }}'
        outcomes:
          - fail:
              when: "connection-refused"
              message: Connection to port 9100 was refused. This is likely to be a routing problem since this preflight configures a test server to listen on this port.
          - warn:
              when: "address-in-use"
              message: Another process was already listening on port 9100.
          - fail:
              when: "connection-timeout"
              message: Timed out connecting to port 9100. Check your firewall.
          - fail:
              when: "error"
              message: Unexpected port status
          - pass:
              when: "connected"
              message: Port 9100 is available
          - warn:
              message: Unexpected port status
```
