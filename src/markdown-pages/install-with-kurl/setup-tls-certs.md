---
path: "/docs/install-with-kurl/setup-tls-certs"
date: "2020-02-03"
weight: 13
linktitle: "TLS Certificates"
title: "Setting up TLS Certificates"
---

After kURL install has completed, you'll be prompted to set up the KOTS Admin Console by directing your browser to `http://<ip>:8800`.   Only after initial install you'll be presented a warning page:
<br><br><br>
![tls-certs-insecure](/tls-certs-insecure.png)


The next page allows you to configure your TLS certificates:
<br><br><br>
![tls-certs-setup](/tls-certs-setup.png)

To continue with the preinstalled self-signed TLS certificates, click "skip & continue".  Otherwise upload your signed TLS certificates as describe on this page.  The hostname is an optional field, and when its specified, its used to redirect your browser to the specified host. 

Once you complete this process then you'll no longer be presented this page when logging into the KOTS Admin Console.  If you direct your browser to `http://<ip>:8800` you'll always be redirected to `https://<ip>:8800`.  
    
## KOTS TLS Secret

kURL will set up a Kubernetes secret called `kotsadm-tls`.  The secret stores the TLS certificate, key, and hostname.  Initially the secret will have an annotation set called `acceptAnonymousUploads`.  This indicates that a new TLS certificate can be uploaded as described above.  

## Uploading new TLS Certs

If you've already gone through the setup process once, and you want to upload new TLS certificates, you must run this command to restore the ability to upload new TLS certificates:

`kubectl -n default annotate secret kotsadm-tls acceptAnonymousUploads=1`

<span style="color:red">**Warning: adding this annotation will temporarily create a vulnerability for an attacker to maliciously upload TLS certificates.  Once TLS certificates have been uploaded then the vulnerability is closed again.**</span>

After adding the annotation, you will need to restart the kurl proxy server.  The simplest way is to delete the kurl-proxy pod (the pod will automatically get restarted): 

`kubectl delete pods PROXY_SERVER`

The following command should provide the name of the kurl-proxy server:

`kubectl get pods -A | grep kurl-proxy | awk '{print $2}'`

After the pod has been restarted direct your browser to `http://<ip>:8800/tls` and run through the upload process as described above.  
    
It's best to complete this process as soon as possible to avoid anyone from nefariously uploading TLS certificates.  After this process has completed, the vulnerability will be closed, and uploading new TLS certificates will be disallowed again.  In order to upload new TLS certificates you must repeat the steps above. 
<br><br><br>

### KOTS TLS Certificate Renewal

The certificate used to serve the KOTS Admin Console will be renewed automatically at thirty days prior to expiration if the [ecko add-on](/docs/add-ons/ekco) is enabled with version 0.7.0+.
Only the default self-signed certificate will be renewed.
If a custom certificate has been uploaded then no renewal will be attempted, even if the certificate is expired.

## Registry

The TLS certificate for the [registry add-on](/docs/add-ons/registry) will be renewed automatically at thirty days prior to expiration if the [ekco add-on](/docs/add-ons/ekco) is enabled with version 0.5.0+.

To manually renew the certificate for the registry prior to automatic renewal, re-run the kURL install script.

## Kubernetes Control Plane

The certificates for Kubernetes control plane components are valid for one year.
These certificates are renewed whenever the Kubernetes version is upgraded.
Installations that do not routinely upgrade Kubernetes will need to rely on automatic certificate renewal provided by ekco or manual renewal.

To check how long certificates have remaining until expiration, run this command on every primary node:
```bash
kubeadm alpha certs check-expiration
```

### Automatic Renewal

The certificates for the Kubernetes control plane will be renewed automatically at thirty days prior to expiration if the [ekco add-on](/docs/add-ons/ekco) is enabled with version 0.5.0+.

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
