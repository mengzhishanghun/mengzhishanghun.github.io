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
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165541
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165541
sourceDate: 2025-10-25
lang: en
translationKey: simple-ssh-tunnel
sourceHash: 84952a71323215aca3c35a3f1d1c91ea212b3383af08f574371ade499f94fa3b
translationStatus: translated
generatedBodyHash: 37a7425fac84fdc7e0fd49d499f69b436d76962698c4a2732c7e57a76f7130da
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/e86019ed-6e80-4f14-b70c-1fb2f0154721
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-ssh-tunnel-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
      requirements:
        - UE 5.2–5.8
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

For operation steps and parameter details, see the [user guide](/en/docs/guides/ue-tools/simple-ssh-tunnel-guide/).
