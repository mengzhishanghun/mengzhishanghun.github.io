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
sourceHash: 9d32c37528fcd5fc5d77215928fc69366d5f6b7aae94c310d81d15733fbdd9fe
translationStatus: translated
generatedBodyHash: 1c590e15aebca3f8761093a76234583cc8697e5a60ad6d9616d7f8d6259dcc01
docPage:
  work: simple-ssh-tunnel
  group: setup
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

All settings are saved in `DefaultSimpleSSHTunnel.ini` and automatically applied at engine startup.

## Interface language

Open **Edit → Project Settings**, select the SimpleSSHTunnel settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

[Manage SSH tunnels in Blueprint](/en/works/simple-ssh-tunnel/docs/manage-tunnels/)
