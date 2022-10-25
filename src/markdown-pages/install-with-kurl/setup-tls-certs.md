---
path: "/docs/install-with-kurl/setup-tls-certs"
date: "2020-02-03"
weight: 13
linktitle: "TLS Certificates"
title: "Setting up TLS Certificates"
---

## Registry

The TLS certificate for the [registry add-on](/docs/add-ons/registry) will be renewed automatically at thirty days prior to expiration if the [EKCO add-on](/docs/add-ons/ekco) is enabled with version 0.5.0+.

To manually renew the certificate for the registry prior to automatic renewal, re-run the kURL install script.

## Kubernetes Control Plane

The certificates for Kubernetes control plane components are valid for one year.
These certificates are renewed whenever the Kubernetes version is upgraded.
Installations that do not routinely upgrade Kubernetes will need to rely on automatic certificate renewal provided by EKCO or manual renewal.

To check how long certificates have remaining until expiration, run this command on every primary node:
```bash
kubeadm alpha certs check-expiration
```

### Automatic Renewal

The certificates for the Kubernetes control plane will be renewed automatically at thirty days prior to expiration if the [EKCO add-on](/docs/add-ons/ekco) is enabled with version 0.5.0+.

Renewing the Kubernetes control plane certificates will trigger a restart of the Kubernetes API server, which may briefly affect applications running in the cluster.

### Manual Renewal

If running an HA cluster with a load balancer, use this procedure to manually rotate the certificates at any point prior to the automatic rotatation deadline.
This will prevent Kubernetes API servers from restarting while handling client traffic.

1. Remove the first primary node from your load balancer's target group.
1. Run `kubeadm alpha certs renew all` on the node.
1. Run `mv /etc/kubernetes/manifests/kube-apiserver.yaml /tmp/ && sleep 1 && mv /tmp/kube-apiserver.yaml /etc/kubernetes/manifests/`
1. Run `mv /etc/kubernetes/manifests/kube-controller-manager.yaml /tmp/ && sleep 1 && mv /tmp/kube-controller-manager.yaml /etc/kubernetes/manifests/`
1. Run `mv /etc/kubernetes/manifests/kube-scheduler.yaml /tmp/ && sleep 1 && mv /tmp/kube-scheduler.yaml /etc/kubernetes/manifests/`
1. Wait until `curl -k https://127.0.0.1:6443/healthz` reports ok
1. Add the node back to your load balanacer's target group.

Repeat this for each of the remaining primary nodes in your cluster.
