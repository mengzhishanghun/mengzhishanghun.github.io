---
title: MCPBlueprint
description: Connect AI tools through MCP to edit Unreal Engine Blueprints, manage members and components, and read compilation feedback.
type: work
slug: mcp-blueprint
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 18
status: On sale
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/22073900-edb6-456b-b840-753db7205713
    - kind: docs
      href: /en/works/mcp-blueprint/docs/connect/
featured: false
draft: false
sitePublish: true
tags:
  - Blueprint discovery, editing and compilation feedback
  - MCP series
lang: en
translationKey: mcp-blueprint
sourceHash: f2571e3e640a9b6fbfbfe1deb2d76a07fae5578d7acb71adce59a60fcb07ab9b
generatedBodyHash: 901975f6dd9add8c5212e431ca842e24ff53f42d4246632e37dc998bc020f33a
translationStatus: translated
coverAlt: MCPBlueprint cover
websiteCoverUrl: /media/covers/works/mcp-blueprint-20261101.webp
docIds:
  - mcp-blueprint-connect
  - mcp-blueprint-asset-lifecycle
  - mcp-blueprint-graphs
  - mcp-blueprint-graph-screenshots
  - mcp-blueprint-variables
  - mcp-blueprint-members-and-types
  - mcp-blueprint-events-dispatchers
  - mcp-blueprint-interfaces
  - mcp-blueprint-user-defined-structs
  - mcp-blueprint-user-defined-enums
  - mcp-blueprint-components-and-inheritance
  - mcp-blueprint-class-defaults
  - mcp-blueprint-class-inheritance
---

## About this work

MCPBlueprint is an Unreal Engine Editor plugin that lets MCP-compatible AI clients read and edit Blueprints in your project. Once connected, you can ask the AI to find Blueprints, inspect graph structure, create nodes and connections, and adjust variables and functions. You can check the changes in the editor.

The plugin also manages components, class defaults, and user-defined Structs and Enums. Start with an existing Blueprint, make changes, check compilation, and save. You can also create Blueprint assets and functions to build the logic you need.

[Install and connect MCPBlueprint](/en/works/mcp-blueprint/docs/connect/) · [Buy on Fab](https://www.fab.com/listings/22073900-edb6-456b-b840-753db7205713)

## Main features

The Fab release has 55 tools covering the Blueprint editing tasks below. Check the editor session's `tools/list` for available tools and parameters.

### Find and manage Blueprint assets

Find Blueprints by path and inspect their parent classes, graphs, variables, components, and interfaces. Read the structure before editing to identify the assets and members you want to change.

Create, duplicate, rename, or move assets, open the Blueprint editor, read compilation diagnostics, and explicitly save changes. Reloading from disk and deleting assets have additional impact checks and approval requirements.

[Read about asset management and compilation](/en/works/mcp-blueprint/docs/asset-lifecycle/)

### Edit nodes, connections, and graph layouts

Read nodes, Pins, connections, and positions, search for nodes available to create, then apply graph edits. Add, move, or remove nodes, change connections, and set default values on unconnected input Pins.

Use Balanced, Straight, or Compact layouts to arrange existing graphs, add comment boxes, and add or remove Pins on nodes that support editable Pins. Capture a full graph or focus on a node to inspect and share the result.

[Read about graph editing](/en/works/mcp-blueprint/docs/graphs/) · [Read about graph screenshots](/en/works/mcp-blueprint/docs/graph-screenshots/)

### Manage variables and functions

Add or remove member variables and function-local variables. Adjust member variable names, types, declaration defaults, categories, tooltips, and instance-editable settings. Existing references and other conditions restrict some changes.

Create, rename, or remove user functions. Add, rename, or remove function parameters, or change parameter types. When an edit affects call sites, inspect the impact first and explicitly approve reference updates as required by the tool.

[Read about variables](/en/works/mcp-blueprint/docs/variables/) · [Read about functions](/en/works/mcp-blueprint/docs/members-and-types/)

### Add events, dispatchers, and interfaces

Create custom events, add supported event nodes, and add bound events for components or delegates. Create event dispatchers with signatures, and remove dispatchers when reference and recovery checks allow it.

Inspect the interfaces a Blueprint already implements, then supply an interface class path to add an interface. Signature editing for events and dispatchers differs from ordinary functions; see the relevant documentation for the supported operations.

[Read about events and dispatchers](/en/works/mcp-blueprint/docs/events-dispatchers/) · [Read about interfaces](/en/works/mcp-blueprint/docs/interfaces/)

### Create and modify Structs and Enums

Create and read user-defined Structs, then add, adjust, or remove fields. Create and read user-defined Enums, inspect entries, values, and display names, and modify them.

Preview reference impact before modifying existing types. Operations that may lose data or change the meaning of existing serialized values require explicit approval.

[Read about Structs](/en/works/mcp-blueprint/docs/user-defined-structs/) · [Read about Enums](/en/works/mcp-blueprint/docs/user-defined-enums/)

### Manage components, class defaults, and inheritance

Inspect an Actor Blueprint's component tree. Add, rename, duplicate, or remove local SCS components, change SceneComponent attachment parents, and set the root component. Read and modify template properties on components added by that Blueprint.

Class default tools edit the Blueprint generated class's default properties, including editable inherited properties. A separate tool previews and changes the Blueprint parent class. Changing component attachments and changing a Blueprint's parent class use different tools.

[Read about components](/en/works/mcp-blueprint/docs/components-and-inheritance/) · [Read about class defaults](/en/works/mcp-blueprint/docs/class-defaults/) · [Read about class inheritance](/en/works/mcp-blueprint/docs/class-inheritance/)

## Examples

### Create a calculation function

The `CalculateScore` function below combines three inputs: add the base score and bonus, multiply by the multiplier, then pass the result to the return node.

```text
FinalScore = (BaseScore + Bonus) × Multiplier
```

![CalculateScore calculation function in the Unreal Engine Blueprint editor](/media-occurrence/work%3Amcp-blueprint%3Amedia%3A1)

This example covers function creation, node search, node and connection edits, and graph layout. [Follow the full example](/en/works/mcp-blueprint/docs/graphs/).

### Modify existing business logic

You can also change an existing Blueprint. For example, replace a fixed order discount of `500` with 5% of the subtotal. Read the existing graph, then change its calculation nodes and connections so the discount becomes `SubtotalCents / 20`.

Before the change, the calculation returns a fixed discount of `500`:

![Before: the order uses a fixed discount of 500](/media-occurrence/work%3Amcp-blueprint%3Amedia%3A2)

After the change, the discount is 5% of the subtotal:

![After: the order discount is calculated as SubtotalCents / 20](/media-occurrence/work%3Amcp-blueprint%3Amedia%3A3)

The graph documentation also includes examples of free shipping for a first order and excluding shipping from reward points. [Follow the node and connection edits](/en/works/mcp-blueprint/docs/graphs/), or [view the complete order settlement graph](/en/works/mcp-blueprint/docs/graph-screenshots/).

## Workflow

1. **Connect your AI client.** Install the package matching your engine version, then give the client the actual MCP endpoint shown in the editor toolbar.
2. **Read and locate the target.** Find the Blueprint and inspect its overview and graph details to identify the asset, nodes, or members to edit.
3. **Preview and apply changes.** Use dry-run when the tool supports it to inspect the impact and restrictions. Explicitly approve reference updates or data changes as required.
4. **Check, compile, and save.** Inspect the result in the editor and read compilation feedback. Fix any issues, then explicitly save the changes you want to keep.

Ordinary edits mark assets as modified without writing them to disk. Call `SaveAsset` when you want to save. A preview does not replace checking the final result; inspect the modified Blueprint in the editor.

## Requirements and scope

- UE 5.2–5.8 Editor. The release package must match your engine minor version.
- Windows (Win64), macOS, and Linux.
- An MCP client that supports a local HTTP service. The service binds only to the local machine.
- Install the plugin once per engine in its Marketplace plugin directory. You do not need to copy it into each project or add a project dependency.
- The plugin edits assets and Blueprints in the editor. It has no Runtime / Shipping module.

Component tools primarily edit local SCS component templates in Actor Blueprints. Changing class defaults does not retroactively override existing scene instances. The plugin currently has no general tool for calling an arbitrary Blueprint function and returning its runtime result.

## Purchase and documentation

The plugin is available on [Fab](https://www.fab.com/listings/22073900-edb6-456b-b840-753db7205713). For your first session, start with [installing and connecting MCPBlueprint](/en/works/mcp-blueprint/docs/connect/).

The documentation covers assets and graphs, members and types, and class structure. Each guide explains the relevant operations, required parameters, and restrictions. The website documentation covers the published release.

## Support

For questions or feedback, use the [contact page](https://mzsh.me/contact/).
