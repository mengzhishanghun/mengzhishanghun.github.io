---
title: SimpleTCPServer
description: Provide multi-client TCP server sessions and connection event interfaces.
type: work
slug: simple-tcp-server
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 5
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - TCP
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: en
translationKey: simple-tcp-server
sourceHash: 7d96e6bd8df4d092dbd25c0e4bccfc22d8429ba463689f644c0fe5ee03af7c2b
translationStatus: translated
generatedBodyHash: 99ac8c190092a68ac9af112361f460102d94d912d968e6212295a658495b8484
---

## Overview

SimpleTCPServer provides multi-client TCP server session management for Unreal Engine.

It exposes client connection and disconnection events, sessions distinguished by IP:Port, and runtime channel configuration to Blueprints, allowing UE to accept external TCP clients.

## Background and goals

Server applications must continually distinguish clients and update state when clients leave. SimpleTCPServer wraps this work around sessions and connection events, giving business logic clear client identifiers and event entry points.

## Core capabilities

### Multi-client sessions

The server identifies connected clients by IP:Port so connections can be handled separately. Callers can associate business data with session identifiers. These identify network endpoints; persistent user identities still require a business protocol.

### Connection events

Notifications are available when clients connect and disconnect. Blueprints can maintain interface or business state from these events, such as displaying current connections and clearing records for offline clients.

### Channel configuration and Blueprint interfaces

The tool supplies runtime channel configuration and Blueprint calls to integrate server communication into UE projects. Message formats, client permissions, and sending policies must be designed around the project protocol.

## Use cases

It suits UE programs acting as TCP servers for several external programs or devices, with later processing distinguished by connection. It focuses on server connections and sessions rather than replacing higher-level business systems.

## Scope and limitations

Validate connection counts, session lifecycles, timeouts, and data handling in the target environment. TCP streams have no inherent business message boundaries, so projects define encoding and message splitting rules. IP:Port should not serve directly as security authentication.
