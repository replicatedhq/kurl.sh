---
path: "/docs/install-with-kurl/host-preflights/"
date: "2022-01-13"
weight: 24
linktitle: "Customizing Host Preflights"
title: "Customizing Host Preflights"
---

While there are [default host preflights](/docs/install-with-kurl/host-preflights) that kURL runs during an install or upgrade, these host preflights are customizable.
There are two mechanisms for customizing host preflights: supplying additional host preflights as part of the kURL installer spec, and disabling the default host preflights.
Combined, these two mechanisms allow you to add custom host preflights that will run in addition to the defaults, or disable the default host preflights and run your own in order to completely customize the host preflights checks.

## Adding Custom Host Preflights

In order to add custom host preflights to your installer, you can supply a `HostPreflight` spec in the kURL installer spec.
Specifically, those host preflight checks can be added in the kURL installer spec under `spec.kurl.hostPreflights`.
More information on that field can be found in the documentation on the [kURL add-on](/docs/add-ons/kurl).
For examples of host preflight specs, see the following sections on [general host preflight checks](#general-host-preflight-checks) and [add-on host preflight checks](#add-on-host-preflight-checks). These will show the host preflight specs that kURL uses by default.

## Excluding the Default Host Preflights

The default host preflight checks can be excluded by setting the `spec.kurl.excludeBuiltinPreflights` field to `true`. See the [kURL add-on docs](/docs/add-ons/kurl) for additional information.

The relevant YAML for the default built-in host preflight checks can be found in the [kURL](https://github.com/replicatedhq/kURL) repo:

## Modifying the Default Host Preflights

In order to modify the default host preflights, you should exclude the default host preflights and provide your own custom host preflights to replace them.
The best way to do this is to reproduce the default host preflights run by kURL, make your needed changes, and include that host preflight spec in your kURL installer spec.

### Reproducing the Default Host Preflights

In order to reproduce the default host preflights, you need to take the general host preflight checks that always run and combine them with any add-on host preflights that are needed for your installer.
The general host preflight checks that run with all installers can be found [here](https://github.com/replicatedhq/kURL/blob/main/pkg/preflight/assets/host-preflights.yaml). These run for all installers regardless of which add-ons are included.
The add-on host preflights can be found in directories that are specific to that add-on.

#### Finding the Add-On Host Preflights

For each of the following add-ons that you are using, go to the linked directory, choose the directory for the version of that add-on that you specify, and find the `host-preflight.yaml` file.
For example, if your installer includes KOTS version 1.59.0, you would find the host preflight file at this link: (https://github.com/replicatedhq/kURL/blob/main/addons/kotsadm/1.59.0/host-preflight.yaml).

Weave: https://github.com/replicatedhq/kURL/tree/main/addons/weave
Rook: https://github.com/replicatedhq/kURL/tree/main/addons/rook
OpenEBS: https://github.com/replicatedhq/kURL/tree/main/addons/openebs
Prometheus: https://github.com/replicatedhq/kURL/tree/main/addons/prometheus
Longhorn: https://github.com/replicatedhq/kURL/tree/main/addons/longhorn
Containerd: https://github.com/replicatedhq/kURL/tree/main/addons/containerd
KOTS: https://github.com/replicatedhq/kURL/tree/main/addons/kotsadm

#### Merging Host Preflights into One Spec

Once you have found the general host preflights and the add-on host preflights you need, you can merge these into one host preflight spec by combining the list of collectors and analyzers for each.
For example, the below YAML combines the host preflight checks for [Longhorn v1.2.2](https://github.com/replicatedhq/kURL/blob/main/addons/longhorn/1.2.2/host-preflight.yaml) and [Prometheus v0.49.0-17.1.3](https://github.com/replicatedhq/kURL/blob/main/addons/prometheus/0.49.0-17.1.3/host-preflight.yaml):
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
