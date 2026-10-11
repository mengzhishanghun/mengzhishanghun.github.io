---
title: SimpleWebSocket
description: Use WebSocket communication in UE through named connections and message delegates.
type: work
slug: simple-websocket
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 2
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - WebSocket
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: en
translationKey: simple-websocket
sourceHash: 56807d61c21f370300bf6abb57c242dae9d5830b417c2fe6fb2cc51b67217a9f
translationStatus: translated
generatedBodyHash: a9f64ba2ca69b53bb54a880504929e937a3c0507ff85f3db05ecd5ff08223685
---

## Overview

SimpleWebSocket wraps WebSocket connection management in Unreal Engine. Projects distinguish peers using named connections, bind message delegates, and call interfaces from Blueprints.

It suits UE applications exchanging messages continuously with WebSocket services.

## Background and goals

With several WebSocket entry points, a project needs to identify the service for each connection, when it is established, and who handles incoming messages. SimpleWebSocket organizes these entry points with named connections and event delegates.

## Core capabilities

### Named connection management

Connections can be managed by name, associating services or purposes with explicit entries. Connections can also be established at project startup so persistent communication begins with the application workflow.

### Message delegates

Incoming messages can be passed to callers through delegates. Blueprints subscribe to events and interpret content using the business protocol. Delegates provide dispatch after arrival; they do not define message structure.

### Blueprint interfaces

Connection and messaging capabilities are exposed through Blueprint interfaces for project logic. Network addresses, reachability, and server behavior depend on deployment. Connection names do not automatically discover servers.

## Use cases

It suits UE projects exchanging real-time messages with existing WebSocket services, distinguishing connections by purpose, and responding in Blueprints. Connections may target external control systems or messaging services, with interaction determined by the peer's protocol.

## Scope and limitations

An accessible WebSocket service and agreed message format are required. Recovery after closure, authentication, and message reliability handling must be designed and verified for project needs.
