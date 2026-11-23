---
title: Configure SSH Connections
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
sourceHash: 0cfefbd71056bbd7c34012e522566962545c2150c7abd07d867e55404fcf68cf
translationStatus: translated
generatedBodyHash: a6d4774c1fb9782f4240fa878052ffc76b19090bceddbf64d5d98c7cd4221ee5
docPage:
  work: simple-ssh-tunnel
  group: getting-started
  slug: connect
  order: 1
---

## SSH tunnels and remote services

A UE application may need access to a remote database, API, or private network service. Exposing that service directly to the internet adds risk. An SSH tunnel forwards connections from a local port to the remote service through SSH, so the project can access it locally. Security still depends on server identity verification, authentication, listening addresses, and credential management.

Set the connection parameters in Project Settings and manage tunnels in Blueprint. See the [C++ examples](/en/works/simple-ssh-tunnel/docs/cpp-tunnels/) for integration and customization. You do not need to write this code to use the plugin.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Connection parameters

Distinguish the three endpoints. The local settings tell the UE app where to connect, the remote settings identify the service it needs, and the SSH settings identify the server and account used to open the tunnel. Once the tunnel is running, connect the app to the local endpoint and check that it can reach the service.

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

Set **Subsystem Class** if you need to replace the default subsystem.

The plugin saves these settings in `DefaultSimpleSSHTunnel.ini`. The engine applies them at startup.

## Interface language

Open **Edit → Project Settings**, select the SimpleSSHTunnel settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

[Manage SSH tunnels in Blueprint](/en/works/simple-ssh-tunnel/docs/manage-tunnels/)
