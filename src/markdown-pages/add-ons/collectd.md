---
path: "/docs/add-ons/collectd"
date: "2020-11-02"
linktitle: "Collectd"
weight: 33
title: "Collectd Add-On"
addOn: "collectd"
---
[collectd](https://collectd.org/) gathers system statistics on kURL hosts to track system health and find performance bottlenecks.

## Host Package Requirements

The following host packages are required for Red Hat Enterprise Linux 9 and Rocky Linux 9:

- bash
- glibc
- libcurl
- libcurl-minimal
- libgcrypt
- libgpg-error
- libmnl
- openssl-libs
- rrdtool
- systemd
- systemd-libs
- yajl

## Advanced Install Options

```yaml
spec:
  collectd:
    version: 0.0.1
```

flags-table
