---
path: "/docs/install-with-kurl/connecting-remotely"
date: "2019-12-19"
weight: 14
linktitle: "Connecting Remotely"
title: "Connecting Remotely"
---

While connected to the machine where you installed kURL, you can generate a kubeconfig to use from your local machine with:

```
curl -o tasks.sh https://kurl.sh/latest/tasks.sh
sudo bash tasks.sh generate-admin-user
```

This will use the load balancer or public address for the Kubernetes API server and generate a new user with full admin privileges, and save the configuration into a file `<user>.conf` which you can then copy to another machine and use with `kubectl --kubeconfig=<user>.conf <command>`.
You can also add this config to your regular configuration with something like:

```
mv <user>.conf $HOME/config/.<user>.conf
export KUBECONFIG="$HOME/.kube/config:$HOME/config/.<user>.conf"
```

Or even merge them into your main config with:

```
KUBECONFIG=$HOME/.kube/config:<user>.conf kubectl config view --merge --flatten > $HOME/.kube/config
```

Be sure to open TCP port 6443 to allow traffic from your local machine.
