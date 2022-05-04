---
path: "/docs/install-with-kurl/advanced-options"
date: "2019-12-19"
weight: 18
linktitle: "Advanced Options"
title: "Advanced Options"
---

## Syntax for Advanced Options

To include advanced options in the kURL installation script, use the following syntax with `-s` before the advanced option flag:

```
curl https://kurl.sh/latest | sudo bash -s ADVANCED_FLAG
```
Where `ADVANCED_FLAG` is the flag for the advanced option.

For more information about installing with kURL, see [Install with kURL](https://kurl.sh/docs/install-with-kurl/).

The install scripts are idempotent. Re-run the scripts with different flags to change the behavior of the installer.

## Reference

<table>
<tr>
  <th width="30%">Flag</th>
  <th width="70%">Description</th>
</tr>
<tr>
  <td><code>additional-no-proxy-addresses</code></td>
  <td>This indicates addresses that should not be proxied in addition to the private IP. Multiple addresses can be specified as a comma separated list of IPs or a range of addresses in CIDR notation.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s additional-no-proxy-addresses=192.1.1.1</code>
  </td>
</tr>
<tr>
  <td><code>airgap</code></td>
  <td>Do not attempt outbound Internet connections while installing.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s airgap</code>
  </td>
</tr>
<tr>
  <td><code>app-version-label</code></td>
  <td>A version label that indicates to KOTS which version of an application to install. KOTS will install the latest version if this flag is not passed.
  </td>
</tr>
<tr>
  <td><code>container-log-max-files</code></td>
  <td>Specifies the maximum number of container log files that can be present for a container. This does not work with Docker. For Docker, see <a href="https://docs.docker.com/config/containers/logging/json-file">JSON File logging driver</a>.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s container-log-max-files=2</code>
  </td>
</tr>
<tr>
  <td><code>container-log-max-size</code></td>
  <td>A quantity defining the maximum size of the container log file before it is rotated. For example: "5Mi" or "256Ki". This does not work with Docker. For Docker, see <a href="https://docs.docker.com/config/containers/logging/json-file">JSON File logging driver</a>.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s container-log-max-size=5Mi</code>
  </td>
</tr>
<tr>
  <td><code>exclude-builtin-host-preflights</code></td>
  <td>Skips the built-in host preflight checks from running and only runs the vendor-defined checks. See <a href="../create-installer/host-preflights/#adding-custom-host-preflight-checks">Customizing Host Preflights</a>.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s exclude-builtin-host-preflights</code>
  </td>
</tr>
<tr>
  <td><code>force-reapply-addons</code></td>
  <td>Reinstall add-ons, whether or not they have changed since the last time kurl was run.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s force-reapply-addons</code>
  </td>
</tr>
<tr>
  <td><code>ha</code></td>
  <td>Install will require a load balancer to allow for a highly available Kubernetes Control Plane.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s ha</code>
  </td>
</tr>
<tr>
  <td><code>host-preflight-ignore</code></td>
  <td>Ignore host preflight failures and warnings.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s host-preflight-ignore</code>
  </td>
</tr>
<tr>
  <td><code>ignore-remote-load-images-prompt</code></td>
  <td>Bypass prompt to load images on remotes. This is useful for automating upgrades.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s ignore-remote-load-images-prompt</code>
  </td>
</tr>
<tr>
  <td><code>ignore-remote-upgrade-prompt</code></td>
  <td>Bypass prompt to upgrade remotes. This is useful for automating upgrades.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s ignore-remote-upgrade-prompt</code>
  </td>
</tr>
<tr>
  <td><code>installer-spec-file</code></td>
  <td>This flag takes the path to a ‘patch’ yaml file. The config in this patch will be merged with the existing installer yaml, taking precedence where there is conflict, and will change the installation based on the final config.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s installer-spec-file="./patch.yaml"</code>
  </td>
</tr>
<tr>
  <td><code>kurl-install-directory</code></td>
  <td>Override the base directory where kURL will install its dependencies. The path will be suffixed with <code>"/kurl/"</code> (<code>"&#123;kurl-install-directory&#125;/kurl/"</code>). This directory must exist, be writeable by the kURL installer and must have sufficient disk space (5 GB).
  <br/>
  <br/>
  <strong>Note:</strong> The default is <code>/var/lib/</code>.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s kurl-install-directory="/some/dir"</code>
  </td>
</tr>
<tr>
  <td><code>labels</code></td>
  <td>Apply the given labels to the node. This flag can be used when initially creating a kURL cluster or when adding a node to an existing kURL cluster.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s labels=gpu=enabled,type=data</code>
  </td>
</tr>
<tr>
  <td><code>load-balancer-address</code></td>
  <td>The IP:port of a load balancer for the Kubernetes API servers in HA mode.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s load-balancer-address="34.124.10.32:80"</code>
  </td>
</tr>
<tr>
  <td><code>preserve-docker-config</code></td>
  <td>This flag will make the kURL installer keep the current docker config of the node, overriding any yaml config.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s preserve-docker-config</code>
  </td>
</tr>
<tr>
  <td><code>preserve-firewalld-config</code></td>
  <td>This flag will make the kURL installer keep the current Firewalld config of the node, overriding any yaml config.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s preserve-firewalld-config</code>
  </td>
</tr>
<tr>
  <td><code>preserve-iptables-config</code></td>
  <td>This flag will make the kURL installer keep the current Iptables config of the node, overriding any yaml config.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s preserve-iptables-config</code>
  </td>
</tr>
<tr>
  <td><code>preserve-selinux-config</code></td>
  <td>This flag will make the kURL installer keep the current SELinux config of the node, overriding any yaml config.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s preserve-selinux-config</code>
  </td>
</tr>
<tr>
  <td><code>private-address</code></td>
  <td>The private IP address of the host.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s private-address="10.128.0.26"</code>
  </td>
</tr>
<tr>
  <td><code>public-address</code></td>
  <td>The public IP address.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s public-address="34.139.108.74"</code>
  </td>
</tr>
<tr>
  <td><code>skip-system-package-install</code></td>
  <td>This flag will tell kURL to skip installing system packages. The user is responsible for installing the required packages beforehand.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s skip-system-package-install</code>
  </td>
</tr>
<tr>
  <td><code>velero-restic-timeout</code></td>
  <td>How long backups/restores of pod volumes should be allowed to run before timing out. Default is '4h0m0s'.
  <br/>
  <br/>
  <strong>Example:</strong>
  <br/>
  <code>curl https://kurl.sh/latest | sudo bash -s velero-restic-timeout=12h0m0s</code>
  </td>
</tr>
</table>
