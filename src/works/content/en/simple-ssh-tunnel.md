---
title: SimpleSSHTunnel
description: Expose SSH tunneling as UE Blueprint interfaces using libssh2 and OpenSSL.
type: work
slug: simple-ssh-tunnel
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 0
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - SSH
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165541
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165541
sourceDate: 2025-10-25
lang: en
translationKey: simple-ssh-tunnel
sourceHash: b2b7b9a9b590738642fac010fb61ec36bf5686d6bd6720a46207875c9c1bdee5
translationStatus: translated
generatedBodyHash: aeeac046f5b0bd0396581f926b853a3b24848e3462254d51ed6238504855e3bc
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/e86019ed-6e80-4f14-b70c-1fb2f0154721
    - kind: docs
      href: /en/works/simple-ssh-tunnel/docs/connect/
  compatibility:
    - platforms:
        - Windows (Win64)
      requirements:
        - UE 5.2–5.8
websiteCoverUrl: /media/covers/works/simple-ssh-tunnel-20261101.webp
coverAlt: SimpleSSHTunnel cover
docIds:
  - simple-ssh-tunnel-connect
  - simple-ssh-tunnel-manage-tunnels
  - simple-ssh-tunnel-cpp-tunnels
---

## Overview

SimpleSSHTunnel is an SSH tunneling plugin for Unreal Engine. It provides local port forwarding to access remote services.

The plugin uses libssh2 for SSH and OpenSSL for encryption, with Blueprint nodes to manage tunnel connections.

## Background and goals

Launching a system SSH client from UE requires additional handling for executable paths, process management, and platform differences.

SimpleSSHTunnel lets you manage tunnels from Blueprint without launching an external SSH process.

## Core capabilities

### SSH connection interfaces

The plugin establishes SSH tunnels without requiring projects to write libssh2 session operations directly. Connections require an accessible SSH service and appropriate authentication information.

### Port forwarding

The SSH tunnel forwards connections received on a local port to a remote service port. Forwarding targets, authentication information, and network reachability depend on the deployment environment.

For example, a UE app can connect to a local listening port and let the SSH tunnel forward that connection to a remote API port. The app still exchanges data using the API’s protocol.

### Blueprint calls

After configuring connection parameters in Project Settings, Blueprints can create tunnels, query their status, close a specific tunnel, or close all tunnels.

The remote service protocol and the sending, receiving, and processing of data remain the responsibility of the project's communication and business logic.

## Use cases

UE applications that access remote services in restricted networks through SSH can use this plugin to manage connections in Blueprints, then handle returned data in the project.

## Workflow

1. Open **Project Settings → Engine → Simple SSH Tunnel**. Set the local listen address and port, the remote target, and the SSH server details. The plugin saves the settings in `DefaultSimpleSSHTunnel.ini`.
2. Create a named tunnel with **Create SSHTunnel**, then check its status with **Check SSHTunnel Is Running**.
3. When you are done, use **Close SSHTunnel** to close that tunnel or **Close All SSHTunnel** to close all tunnels.

[See the Blueprint node reference](/en/works/simple-ssh-tunnel/docs/manage-tunnels/)

## Scope and limitations

Windows is currently supported. Check library files and build support before porting to other platforms.

The default subsystem closes all tunnels when it is destroyed. In the target project, review SSH credential storage and usage, connection threads, error handling, and whether sessions and channels are released correctly when connections close.

For connection configuration, see the [user guide](/en/works/simple-ssh-tunnel/docs/connect/).

When using SSH, verify the server’s identity, authentication, and local listen scope. If you replace the default **Subsystem Class**, check when the custom subsystem closes its tunnels.

## Libraries and source

SimpleSSHTunnel is implemented in C++ and exposes Blueprint interfaces.

- [libssh2](https://github.com/libssh2/libssh2) provides SSH2 connections, user authentication, and port forwarding under the BSD 3-Clause License.
- [OpenSSL](https://github.com/openssl/openssl) provides SSL/TLS and cryptographic algorithms under the Apache 2.0 License.

Follow the respective licenses and credit the libraries if you use them. The original technical notes were published on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19165541) on 2025-10-25.

## Support and feedback

[Contact and collaboration](https://mzsh.me/contact/)
