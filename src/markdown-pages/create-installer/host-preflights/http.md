---
path: "/docs/create-installer/host-preflights/http"
date: "2022-01-13"
weight: 36
linktitle: "HTTP"
title: "HTTP"
---
 
The HTTP host preflight check is used to validate that the machine is able to connect to a certain HTTP address.

## HTTP Collector

The `http` collector will collect information about the ability to connect to the specified HTTP address.

### Parameters

In addition to the [shared collector properties](https://troubleshoot.sh/docs/collect/collectors/#shared-properties), the `http` collector accepts the following parameters:

#### `get`

The `get` parameter accepts the following fields:

`url` (string): The URL to issue the GET request to.<br/>
`insecureSkipVerify` (boolean): Whether to enable insecure TLS verification.<br/>
`headers` (map): A map of the headers to send with the request.

#### `post`

The `post` parameter accepts the following fields:

`url` (string): The URL to issue the POST request to.<br>
`insecureSkipVerify` (boolean): Whether to enable insecure TLS verification.<br>
`headers` (map): A map of the headers to send with the request.<br>
`body` (string): The body to send with the request as a string.

#### `put`

The `put` parameter accepts the following fields:

`url` (string): The URL to issue the PUT request to.<br>
`insecureSkipVerify` (boolean): Whether to enable insecure TLS verification.<br>
`headers` (map): A map of the headers to send with the request.<br>
`body` (string): The body to send with the request.

## HTTP Analyzer

The `http` analyzer supports multiple outcomes. For example:

`error`: Error occurred connecting to the URL.<br>
`statusCode == 200`: Successfully connected to the URL.

## Example

Here is an example of how to use the HTTP host preflight check:

```yaml
apiVersion: troubleshoot.sh/v1beta2
kind: HostPreflight
metadata:
  name: http
spec:
  collectors:
    - http:
        collectorName: Can Access Replicated API
        get:
          url: https://replicated.app
        # Only run for online installs
        exclude: '{{kurl .Installer.Spec.Kurl.Airgap }}'
  analyzers:
    - http:
        checkName: Can Access Replicated API
        collectorName: Can Access Replicated API
        exclude: '{{kurl .Installer.Spec.Kurl.Airgap }}'
        outcomes:
          - warn:
              when: "error"
              message: Error connecting to https://replicated.app
          - pass:
              when: "statusCode == 200"
              message: Connected to https://replicated.app
          - warn:
              message: "Unexpected response"
```
