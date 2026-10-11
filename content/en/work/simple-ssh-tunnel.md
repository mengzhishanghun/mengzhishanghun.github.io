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
sourceHash: 248450978c76dc333bac86f46d0383b4e557ff9ae46df4f576fdc1b547607073
translationStatus: translated
generatedBodyHash: f209f3b36b62d5a471dc50782cff92505c1f8229429cea3deb308745bc9790fa
---

## Overview

SimpleSSHTunnel exposes SSH tunneling and port forwarding through interfaces callable from Unreal Engine Blueprints.

It uses libssh2 for the SSH protocol and OpenSSL for encryption, allowing UE projects that need remote services to initiate connections from Blueprints.

## Background and goals

Using a system SSH client to access remote services from UE involves executable paths, process management, and platform differences.

SimpleSSHTunnel integrates libssh2 and OpenSSL, leaving underlying connection work to the plugin and exposing Blueprint entry points to the project.

## Core capabilities

### SSH connection interfaces

The plugin wraps the low-level capabilities needed to establish SSH tunnels, allowing UE interface calls without scattering libssh2 session operations across business Blueprints. Connections require an accessible SSH service and appropriate authentication information.

### Port forwarding

Tunnels connect local access paths to remote service ports. Projects can call the interfaces where forwarding is needed, routing remote service access through SSH. Forwarding targets, credentials, and network reachability still depend on deployment.

### Blueprint calls

Blueprint interfaces reduce the need to write SSH library calls at each usage point. They expose tunnel operations; consuming remote business data after connection remains the responsibility of project communication and business logic.

## Use cases

It suits UE applications accessing remote services in restricted networks through SSH tunnels and managing connections in Blueprint workflows. Projects can integrate tunnel connections into their workflow and handle returned service data themselves.

## Scope and limitations

This version targets Windows. Check library files and build support before porting to other platforms.

Review SSH credential storage and usage, connection threads, error handling, and session/channel release on shutdown in the target project. The tunnel does not define the remote service protocol.
