---
title: MCPMaterial
description: MCPMaterial is an Unreal Editor MCP plugin in development, providing tool interfaces for material graphs and material instances. Features and compatibility are still being verified.
type: work
slug: mcp-material
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 21
status: In development
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /en/works/mcp-material/docs/connect/
featured: false
draft: false
sitePublish: true
tags:
  - material graphs and material instances
  - MCP series
lang: en
translationKey: mcp-material
sourceHash: 98e982f54f4034c9348adb5280c1a5b7ca0a3df1cc1cab5f43cd7ca381111b98
generatedBodyHash: 0ee3b4376e9246f91f4dc2934c23d0a7c074791b0095d74c80d632ed26d33383
translationStatus: translated
coverAlt: MCPMaterial cover
websiteCoverUrl: /media/covers/works/mcp-material-20261101.webp
docIds:
  - mcp-material-connect
  - mcp-material-material-assets
  - mcp-material-material-preview
  - mcp-material-edit-graph
  - mcp-material-instance-parameters
  - mcp-material-material-compilation
---

## About this work

MCPMaterial is an Unreal Editor MCP plugin in development. External AI tools can use it to find and create material assets, edit material graphs, and adjust material instance parameters. Tool coverage and compilation feedback may change during development.

## Development direction

### Edit material graphs and nodes

Inspect nodes, connections, and editable properties, then use node GUIDs to change parameter defaults or texture references in place. You can also add nodes in batches, adjust connections, and arrange the graph. The general-purpose tools do not add or remove nodes that need dedicated structure management, including Composite, Function Input/Output, and Named Reroute nodes. [Material graphs](/en/works/mcp-material/docs/edit-graph/)

### Adjust material instance parameters

Inspect resolved values and local overrides. Use type, name, Association, and Index to identify a global, layer, or blend parameter, then update or clear that override. Textures must match the resource type required by the parent material's current compiled resources. Advanced parameters have their own engine version requirements. [Instance parameters](/en/works/mcp-material/docs/instance-parameters/)

## Workflow

To change a material expression's default value, follow the [connection guide](/en/works/mcp-material/docs/connect/), find the target asset, and read the node GUID. Deal with any unsaved changes, close the target asset’s editor, and update the node with `ApplyMaterialPatch`. Run `CompileMaterial` and check the status and errors. After checking the result, call `SaveAsset` explicitly. You can also [capture a material preview](/en/works/mcp-material/docs/material-preview/). If the tool returns `StateUnknown`, stop writing and inspect the asset. After a timeout, check the actual editor state before deciding whether to retry. [Closing and saving material assets](/en/works/mcp-material/docs/material-assets/) · [Compilation diagnostics](/en/works/mcp-material/docs/material-compilation/)

## Development status

Work on UE 5.2–5.8 is ongoing. Compatibility remains unconfirmed, and testing across those versions is incomplete. [MCPMaterial user guide](/en/works/mcp-material/docs/edit-graph/)

## Support

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
