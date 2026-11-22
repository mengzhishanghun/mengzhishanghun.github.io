---
title: Connect to MCP Behavior Tree
type: doc
slug: mcp-behavior-tree-connect-and-inspect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-behavior-tree
documentKind: product-manual
websiteRoute: /en/works/mcp-behavior-tree/docs/connect-and-inspect/
lang: en
translationKey: doc:mcp-behavior-tree:connect-and-inspect
sourceHash: fd85341e0317557be4856352faeb9372ebd8f271112b0868e230ae9f10c3b509
translationStatus: translated
generatedBodyHash: 887e7fa55ac3516aa932e2f0f1419d06db5c97654fb4996ce034aed15f0895fc
docPage:
  work: mcp-behavior-tree
  group: setup
  slug: connect-and-inspect
  order: 1
---

MCP Behavior Tree is a self-contained Unreal Editor plugin for creating, inspecting, editing, validating, and saving Behavior Tree and Blackboard assets through the Model Context Protocol. It supports Unreal Engine 5.2 and later and does not depend on another user plugin.

## Connection

The plugin starts an MCP HTTP server in the Unreal Editor. Its default port is `8767`; when that port is unavailable, use the actual port reported by the running plugin instead of assuming the default.

## First behavior tree edit

1. Create a Blackboard with `CreateBlackboard`.
2. Add keys with `AddBlackboardKey`.
3. Create a tree with `CreateBehaviorTree`, passing the Blackboard path.
4. Add a composite under `Root`, then add tasks, decorators, and services.
5. Use `GetBehaviorTreeDetail` to discover node IDs and editable properties.
6. Run `ValidateBehaviorTree`.
7. Call `SaveAsset` for each dirty Behavior Tree or Blackboard asset.

## Differences from the official UE 5.8 toolset

Unreal Engine 5.8's Epic `AIModuleToolset` exposes seven read-only Behavior Tree helpers: get the Blackboard, root decorators, node list, one/all node depths, children, and a referenced subtree. MCP Behavior Tree covers the Blackboard, decorators, hierarchy, children, and depth through `GetBehaviorTreeDetail`, and also provides creation and editing operations.

The Epic toolset is Experimental and tied to UE 5.8's Toolset/MCP infrastructure. This plugin cannot depend on it while remaining self-contained and compatible with UE 5.2+. Any official-only behavior not available through the plugin's documented tools must be queried in UE 5.8 with the Epic toolset rather than assumed to exist on earlier engines.

## Scope and versions

- The plugin is editor-only and does not provide runtime or packaged-game control.
- Private Behavior Tree editor graph APIs vary by engine version. The plugin contains compatibility paths for UE 5.2+, but projects should still validate assets in their target editor version.
- Source changes do not imply that an existing packaged plugin has been rebuilt or published.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
