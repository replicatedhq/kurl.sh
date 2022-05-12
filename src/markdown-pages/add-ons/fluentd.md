---
path: "/docs/add-ons/fluentd"
date: "2019-02-20"
linktitle: "Fluentd Add-On"
weight: 39
title: "Fluentd Add-On"
addOn: "fluentd"
---

The [Fluentd](https://www.fluentd.org/) add-on is used as a unified logging layer.

It is implemented as a Daemonset, reading logs by all nodes and by default sends all output to stdout.
This can be changed by editing the fluent.conf to collect logs from various sources, filter and tag according to rules, and send to various aggregators.
To use a vendor supplied fluent.conf, simply create a configuration and include it in a fluent.conf file on your machine, adding the path to the spec as shown below.

There is also an optional [Elasticsearch](https://www.elastic.co/elasticsearch/) and [Kibana](https://www.elastic.co/kibana) integration for complete EFK logging stack and visualization.

Elasticsearch requires 1gb of memory for stability. Default storage is set to 20GB. Log rotation is not done by default. It uses the existing Rook/Ceph setups to handle the persistent volume claims.

## Advanced Install Options

```yaml
spec:
  fluentd:
    version: "1.7.4"
    fullEFKStack: true
    fluentdConfPath: /mnt/replicated/fluent.conf
```

flags-table
