---
title: Configure and Manage SSH Tunnels
type: doc
slug: simple-ssh-tunnel-connect
draft: false
sitePublish: true
tags:
  - SSH
workIds:
  - simple-ssh-tunnel
documentKind: product-manual
websiteRoute: /en/works/simple-ssh-tunnel/docs/connect/
lang: en
translationKey: doc:simple-ssh-tunnel:connect
sourceHash: b87d26082519dafd625a35a96135fc4dc8e52515e548a285b21955cf675dafb3
translationStatus: translated
generatedBodyHash: ec7c7007bcd3616187c5f4aac7758d46ff8d723bb685ce33a9321abb83604124
docPage:
  work: simple-ssh-tunnel
  group: setup
  slug: connect
  order: 1
---

## SSH tunnels and remote services

A UE application may need access to a remote database, API, or private network service. Exposing that service directly to the internet adds risk. An SSH tunnel forwards connections from a local port to the remote service through SSH, so the project can access it locally. Security still depends on server identity verification, authentication, listening addresses, and credential management.

SimpleSSHTunnel provides the project settings and Blueprint interfaces below to manage these connections. The C++ examples explain lower-level integration and customization; you do not need to write them to use the plugin.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## 1. Configure SSH Connection

To use the SimpleSSHTunnel plugin, configure the SSH connection in **Project Settings → Engine → Simple SSH Tunnel**.

### 1.1 Access SSH Settings

1. Open **Project Settings** in Unreal Engine editor.
2. Navigate to **Engine → Simple SSH Tunnel** in the left panel.
3. Configure the following parameters:

   - **Local Address**
   - **Local Port**
   - **Remote Server Address**
   - **Remote Port**
   - **SSH Server Address**
   - **SSH Port** (default: 22)
   - **SSH Username**
   - **SSH Password**

Optional: **Subsystem Class** allows you to override the default behavior.

All settings are saved in `DefaultSimpleSSHTunnel.ini` and automatically applied at engine startup.

---

## 2. Blueprint API

After configuring the SSH connection, the following **four Blueprint functions** are available:

### 2.1 Create SSH Tunnel

```blueprint
Create SSHTunnel (Tunnel Name: String) → Return Value: Bool
```
Creates a new SSH tunnel with the specified name.

### 2.2 Check SSH Tunnel Status

```blueprint
Check SSHTunnel Is Running (Tunnel Name: String) → Return Value: Bool
```
Checks if the specified SSH tunnel is running.

### 2.3 Close Specific SSH Tunnel

```blueprint
Close SSHTunnel (Tunnel Name: String) → Return Value: Bool
```
Closes the specified SSH tunnel.

### 2.4 Close All SSH Tunnels

```blueprint
Close All SSHTunnel () → Return Value: Bool
```
Closes all active SSH tunnels.

📌 **Note**:
- The default subsystem automatically shuts down all tunnels when the engine closes.
- You may define custom behavior by specifying a custom **Subsystem Class**.

---

## 3. Example Workflow

1. Configure the SSH tunnel in **Project Settings**.
2. In Blueprint, call **Create SSHTunnel** to create a tunnel.
3. Use **Check SSHTunnel Is Running** to verify its status.
4. Call **Close SSHTunnel** or **Close All SSHTunnel** to shut down connections if needed.

---

## 4. Additional Notes

- Fully implemented in C++ with full Blueprint integration.
- Automatically cleans up SSH tunnels when the engine shuts down (unless customized).

---

## Acknowledgments and open-source libraries

This approach uses the following open-source projects:

- **libssh2** is an SSH2 client library for SSH connections, authentication, and port forwarding. Project: [https://github.com/libssh2/libssh2](https://github.com/libssh2/libssh2). License: BSD 3-Clause License. Thanks to the libssh2 team for its SSH implementation.
- **OpenSSL** provides SSL/TLS protocols and cryptographic algorithms. Project: [https://github.com/openssl/openssl](https://github.com/openssl/openssl). License: Apache 2.0 License. Thanks to the OpenSSL project for its work on network security.

Follow the licenses and acknowledge the sources when using these libraries.

The original technical record was published on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19165541) on 2025-10-25.

## Version History


Open **Edit → Project Settings**, select the SimpleSSHTunnel settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
