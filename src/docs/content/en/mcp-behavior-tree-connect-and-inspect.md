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
sourceHash: f06833c1cc62c2beaa0f3ac728cb73c4cb7a10f9bab3a96362ac1e0412d049aa
translationStatus: translated
generatedBodyHash: 2d6d6af96e8a2d4504a643bfef9b3aa14dbee65b15a342381c63c2b215dba24e
docPage:
  work: mcp-behavior-tree
  group: getting-started
  slug: connect-and-inspect
  order: 1
---

MCP Behavior Tree is a self-contained Unreal Editor plugin for creating, inspecting, editing, validating, and saving Behavior Tree and Blackboard assets through the Model Context Protocol. It does not depend on other user plugins. Development and compatibility checks are ongoing for UE 5.2–5.8.

## Connection

Enable the plugin in Unreal Editor. Once the MCP HTTP server starts, enter the address reported by the plugin in your client. The default port is `8767`; if it’s occupied, use the reported address.

## First behavior tree edit

1. Create a Blackboard with `CreateBlackboard`.
2. Add keys with `AddBlackboardKey`.
3. Create a tree with `CreateBehaviorTree`, passing the Blackboard path.
4. Add a composite under `Root`, then add tasks, decorators, and services.
5. Use `GetBehaviorTreeDetail` to discover node IDs and editable properties.
6. Run `ValidateBehaviorTree` and fix any reported problems.
7. Call `SaveAsset` separately for each Behavior Tree or Blackboard asset you changed.

## Differences from the official UE 5.8 toolset

Unreal Engine 5.8's Epic `AIModuleToolset` exposes seven read-only Behavior Tree helpers: get the Blackboard, root decorators, node list, one/all node depths, children, and a referenced subtree. MCP Behavior Tree covers the Blackboard, decorators, hierarchy, children, and depth through `GetBehaviorTreeDetail`, and also provides creation and editing operations.

The Epic toolset is Experimental and tied to UE 5.8's Toolset/MCP infrastructure. This plugin cannot depend on it while remaining self-contained and compatible with UE 5.2+. Any official-only behavior not available through the plugin's documented tools must be queried in UE 5.8 with the Epic toolset rather than assumed to exist on earlier engines.

## Scope and versions

- The plugin is editor-only and does not provide runtime or packaged-game control.
- Private Behavior Tree editor graph APIs vary by engine version. The plugin contains compatibility paths for UE 5.2+, but projects should still validate assets in their target editor version.
- Source changes do not imply that an existing packaged plugin has been rebuilt or published.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
