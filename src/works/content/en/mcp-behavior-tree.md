---
title: MCPBehaviorTree
description: MCPBehaviorTree is an Unreal Editor MCP plugin in development, providing tool interfaces for Behavior Tree and Blackboard assets. Features and compatibility are still being verified.
type: work
slug: mcp-behavior-tree
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 17
status: In development
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /en/works/mcp-behavior-tree/docs/connect-and-inspect/
featured: false
draft: false
sitePublish: true
tags:
  - Behavior Tree and Blackboard assets
  - MCP series
lang: en
translationKey: mcp-behavior-tree
sourceHash: 61067886dbd38862932ae708b323f923afe1263049e40c1bfe1bddfe1f44340e
generatedBodyHash: 7faf0ca6a1c56d06946d2f036f8ff470aba8db70216b7cda0d258965f5900c5f
translationStatus: translated
coverAlt: MCPBehaviorTree cover
websiteCoverUrl: /media/covers/works/mcp-behavior-tree-20261101.webp
docIds:
  - mcp-behavior-tree-connect-and-inspect
  - mcp-behavior-tree-edit-tree
  - mcp-behavior-tree-blackboard-keys
---

## About this work

MCPBehaviorTree is an Unreal Editor MCP plugin in development. External AI tools can use it to create and inspect Behavior Trees and Blackboards, edit tree structures and manage keys, and validate Behavior Trees before saving. The available operations and diagnostics may change.

## Development direction

### Tree structure and nodes

Inspect the node hierarchy, root-level decorators, Blackboard, and subtree references. Use node IDs to locate and edit composites, tasks, decorators, and services. When editing the background subtree of a `SimpleParallel` node, specify its `Background` output pin. [Editing Behavior Trees](/en/works/mcp-behavior-tree/docs/edit-tree/)

### Blackboards and key bindings

Create a Blackboard, associate it with a Behavior Tree, and add or remove keys. Before removing a key, the tool scans the project’s Behavior Trees. If it finds references or cannot finish the scan, it rejects the removal by default. Set `bForce=true` only if you accept that risk. Validation reports invalid key bindings, structural errors, missing classes, invalid decorator abort modes, and disconnected nodes. [Blackboard keys](/en/works/mcp-behavior-tree/docs/blackboard-keys/)

## Workflow

To set up an enemy AI Behavior Tree, follow the [connection guide](/en/works/mcp-behavior-tree/docs/connect-and-inspect/) to connect to the editor, then create a Blackboard with the keys you need. Create a Behavior Tree that references it, put a composite under `Root`, and add tasks, decorators, and services. Check the nodes and properties with `GetBehaviorTreeDetail`. Run `ValidateBehaviorTree`, address reported issues, and call `SaveAsset` separately for each changed Behavior Tree or Blackboard. Changes stay in memory until you explicitly save them.

## Development status

Work on UE 5.2–5.8 is ongoing. Compatibility remains unconfirmed, and testing across those versions is incomplete. [MCPBehaviorTree user guide](/en/works/mcp-behavior-tree/docs/connect-and-inspect/)

## Support

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
