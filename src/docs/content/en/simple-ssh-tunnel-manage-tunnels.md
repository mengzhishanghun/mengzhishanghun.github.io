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
sourceHash: 48812307be9a043bfdbba944e9cd55e5564d7b59613fb16ade0c68ef68cc3b81
translationStatus: translated
generatedBodyHash: 204a84954024c8cb0cdfe61b556720bbc0a6b6c3749a374fea0fa151b8295f6f
docPage:
  work: simple-ssh-tunnel
  group: features
  slug: manage-tunnels
  order: 1
---

## Start and stop a configured tunnel

Keep the name you used when creating the tunnel and use it again when checking or closing that tunnel. Once the node reports that the tunnel is running, connect the app to the local forwarding endpoint to check that the service is reachable. If only one connection should stop, use the node that closes a named tunnel.

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
Give the SSH tunnel a name when you create it.

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
