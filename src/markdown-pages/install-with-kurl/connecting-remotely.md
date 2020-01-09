---
path: "/docs/install-with-kurl/connecting-remotely"
date: "2019-12-19"
weight: 14
linktitle: "Connecting Remotely"
title: "Connecting Remotely"
---

You can generate a kubeconfig to use from your local machine with:
```
curl -o install.sh https://kurl.sh
sudo bash install.sh task=generate-admin-user
```

This will use the load balancer or public address for the Kubernetes API server and generate a new user with full admin privileges.
Be sure to open TCP port 6443 to allow traffic from your local machine.
