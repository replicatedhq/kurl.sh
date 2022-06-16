---
path: "/docs/add-ons/prometheus"
date: "2020-05-13"
linktitle: "Prometheus"
weight: 51
title: "Prometheus Add-On"
addOn: "prometheus"
---

Prometheus is an open-source instrumentation framework. Prometheus can absorb massive amounts of data every second, making it well suited for complex workloads.

## Advanced Install Options

```yaml
spec:
  prometheus:
    version: "0.33.0"
```

flags-table

## Changing the Grafana admin password

The Grafana admin password is stored in the `grafana-admin` secret in the `monitoring` namespace. To change that, first run:
```
kubectl edit secret grafana-admin --namespace monitoring
```

The password is stored as plain text. Edit the `admin-password` field and save the changes.
Then, for Grafana to detect the password change, the `grafana` pod needs to be restarted/deleted.
