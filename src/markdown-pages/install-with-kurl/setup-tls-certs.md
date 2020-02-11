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

Once you complete this process then you'll no longer be presented this page when logging into the KOTS Admin console.  If you direct your browser to `http://<ip>:8800` you'll always be redirected to `https://<ip>:8800`.  
    
## KOTS TLS Secret

kURL will set up a Kubernetes secret called `kotsadm-tls`.  The secret stores the TLS certificate, key, and hostname.  Initially the secret will have an annotation set called `acceptAnonymousUploads`.  This indicates that a new TLS certificate can be uploaded as described above.  

## Uploading new TLS Certs

If you've already gone through the setup process once, and you want to upload new TLS certificates, you must run this command to re-add the ability to upload new TLS certificates:

`kubectl -n default annotate secret kotsadm-tls acceptAnonymousUploads=1`

<span style="color:red">**Warning: adding this annotation opens the door for anyone to upload TLS certificates.**</span>

After adding the annotation, you will need to restart the kurl proxy server.  The simplest way to do this is to delete the kurl-proxy pod (the pod will automatically get restarted): 

`kubectl delete pods PROXY_SERVER`

The following command should provide the name of the kurl-proxy server:

`kubectl get pods -A | grep kurl-proxy | awk '{print $2}'`

After the pod has been restarted direct your browser to `http://<ip>:8800` and run through the upload process as described above.  Its best to complete this process as soon as possible to avoid anyone uploading a TLS cert.  
<br><br><br>