---
path: "/docs/install-with-kurl/connecting-remotely"
date: "2019-12-19"
weight: 14
linktitle: "Connecting Remotely"
title: "Connecting Remotely"
---

> Be sure to open TCP port 6443 to allow traffic from your local machine.

While connected to the machine where you installed kURL, you can generate a kubeconfig to use from your local machine with:

```
curl -o tasks.sh https://kurl.sh/latest/tasks.sh
sudo bash tasks.sh generate-admin-user
```

This will use the load balancer or public address for the Kubernetes API server and generate a new user with full admin privileges, and save the configuration into a file `$USER.conf`.
You can then copy to another machine and use with:

```
kubectl --kubeconfig=$USER.conf <command>
```

> Note this assumes the usernames on the local and remote machines are the same.
If not, replace $USER with the username on the **remote** machine.

You can add this config with your regular configuration with:

```
mv <user>.conf $HOME/.kube/$USER.conf
export KUBECONFIG="$HOME/.kube/config:$HOME/.kube/$USER.conf"
```

Or merge them into your main config with:

```
cp $HOME/.kube/config $HOME/.kube/config.bak
KUBECONFIG=$USER.conf:$HOME/.kube/config.bak kubectl config view --merge --flatten > $HOME/.kube/config
```

You can choose the kurl context with:

```
kubectl --context kurl <command>
```

Or set it permanently with:

```
kubectl config use-context kurl
```
