---
title: Manage SSH Tunnels in Blueprint
type: doc
slug: simple-ssh-tunnel-manage-tunnels
draft: false
sitePublish: true
tags:
  - SSH
workIds:
  - simple-ssh-tunnel
documentKind: product-manual
websiteRoute: /en/works/simple-ssh-tunnel/docs/manage-tunnels/
lang: en
translationKey: doc:simple-ssh-tunnel:manage-tunnels
sourceHash: a46d9c841d68dcd1a1dbe119750101ee9bc8fac95bbca4da08f71a9d36fdae9a
translationStatus: translated
generatedBodyHash: 8882a071744a51d4d00e9ae1887bf4622e5ee76d1664bf5f9a22da1c57892fa7
docPage:
  work: simple-ssh-tunnel
  group: tunnels
  slug: manage-tunnels
  order: 1
---

## Start and stop a configured tunnel

1. Configure the SSH tunnel in **Project Settings**.
2. In Blueprint, call **Create SSHTunnel** to create a tunnel.
3. Use **Check SSHTunnel Is Running** to verify its status.
4. Call **Close SSHTunnel** or **Close All SSHTunnel** to shut down connections if needed.

## Blueprint nodes

After configuring the SSH connection, the following **four Blueprint functions** are available:

### Create SSH Tunnel

```blueprint
Create SSHTunnel (Tunnel Name: String) → Return Value: Bool
```
Creates a new SSH tunnel with the specified name.

### Check SSH Tunnel Status

```blueprint
Check SSHTunnel Is Running (Tunnel Name: String) → Return Value: Bool
```
Checks if the specified SSH tunnel is running.

### Close Specific SSH Tunnel

```blueprint
Close SSHTunnel (Tunnel Name: String) → Return Value: Bool
```
Closes the specified SSH tunnel.

### Close All SSH Tunnels

```blueprint
Close All SSHTunnel () → Return Value: Bool
```
Closes all active SSH tunnels.

## Tunnel cleanup on shutdown

The default subsystem closes all tunnels when the engine shuts down. If you set a custom **Subsystem Class**, that subsystem determines how tunnels are closed.
