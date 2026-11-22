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
sourceHash: c212a885d12fe9ab4292e5a36b7cd932081a3832851e5e2a8251b8d08baa6524
translationStatus: translated
generatedBodyHash: 3d50d0a0f1b6555a9559393591c0e07fc3ce83be97d8e0feacd2feb20013532f
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

SimpleSSHTunnel wraps these connection operations in the plugin so projects can call them from Blueprints.

## Core capabilities

### SSH connection interfaces

The plugin establishes SSH tunnels without requiring projects to write libssh2 session operations directly. Connections require an accessible SSH service and appropriate authentication information.

### Port forwarding

The SSH tunnel forwards connections received on a local port to a remote service port. Forwarding targets, authentication information, and network reachability depend on the deployment environment.

### Blueprint calls

After configuring connection parameters in Project Settings, Blueprints can create tunnels, query their status, close a specific tunnel, or close all tunnels.

The remote service protocol and the sending, receiving, and processing of data remain the responsibility of the project's communication and business logic.

## Use cases

UE applications that access remote services in restricted networks through SSH can use this plugin to manage connections in Blueprints, then handle returned data in the project.

## Scope and limitations

Windows is currently supported. Check library files and build support before porting to other platforms.

The default subsystem closes all tunnels when it is destroyed. In the target project, review SSH credential storage and usage, connection threads, error handling, and whether sessions and channels are released correctly when connections close.

For connection configuration, see the [user guide](/en/works/simple-ssh-tunnel/docs/connect/).

## Libraries and source

SimpleSSHTunnel is implemented in C++ and exposes Blueprint interfaces.

- [libssh2](https://github.com/libssh2/libssh2) provides SSH2 connections, user authentication, and port forwarding under the BSD 3-Clause License.
- [OpenSSL](https://github.com/openssl/openssl) provides SSL/TLS and cryptographic algorithms under the Apache 2.0 License.

Follow the respective licenses and credit the libraries if you use them. The original technical notes were published on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19165541) on 2025-10-25.

## Support and feedback

[Contact and collaboration](https://mzsh.me/contact/)
