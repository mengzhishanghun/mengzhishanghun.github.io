---
title: MCPDevTools
description: MCPDevTools is an Unreal Editor MCP plugin in development, providing tool interfaces for asset tools and read-only development diagnostics. Features and compatibility are still being verified.
type: work
slug: mcp-dev-tools
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 19
status: In development
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /en/works/mcp-dev-tools/docs/connect/
featured: false
draft: false
sitePublish: true
tags:
  - asset tools and read-only development diagnostics
  - MCP series
lang: en
translationKey: mcp-dev-tools
sourceHash: ad9039add6571ee7b471d41aa262bc0982bf21da26051cf7587406c5bff40faa
generatedBodyHash: e65c87e857eaabe3bc7329d800afce9bc9053c166bb1fcdc1f1b91bdd629a651
translationStatus: translated
coverAlt: MCPDevTools cover
websiteCoverUrl: /media/covers/works/mcp-dev-tools-20261101.webp
docIds:
  - mcp-dev-tools-connect
  - mcp-dev-tools-inspect-editor
  - mcp-dev-tools-asset-registry
  - mcp-dev-tools-primary-asset-labels
  - mcp-dev-tools-data-assets
  - mcp-dev-tools-data-tables
  - mcp-dev-tools-curves
  - mcp-dev-tools-curve-tables
  - mcp-dev-tools-string-tables
  - mcp-dev-tools-enhanced-input
---

## About this work

MCPDevTools is an Unreal Editor MCP plugin in development. External AI tools can use it over HTTP to query project assets, edit supported data assets, and inspect the current editor session, plugin state, and diagnostic logs. Tools and diagnostics may change. Check the target editor’s `tools/list` and tool results.

## Development direction

### Inspect the editor and asset references

Confirm which editor instance the client is connected to, then check plugin status, the listening address, or logs captured by MCPDevTools. The diagnostic tools are read-only: they do not start test jobs, change settings, or save packages. Asset queries can inspect Asset Registry records, types, and references. PrimaryAssetLabel has its own editing tools; derived bundle data is read-only. [Editor diagnostics](/en/works/mcp-dev-tools/docs/inspect-editor/) · [Asset references](/en/works/mcp-dev-tools/docs/asset-registry/) · [PrimaryAssetLabel](/en/works/mcp-dev-tools/docs/primary-asset-labels/)

### Edit project data and input settings

Create DataAssets and edit writable properties. Use an existing row struct for a DataTable, then add, remove, or update rows. Curves, CurveTables, and StringTables have separate tools for editing channels, rows, and entries. If the project has Enhanced Input enabled, you can also configure InputAction and InputMappingContext assets. Use the parameter format for the target engine. [DataAsset](/en/works/mcp-dev-tools/docs/data-assets/) · [DataTable](/en/works/mcp-dev-tools/docs/data-tables/) · [Curve](/en/works/mcp-dev-tools/docs/curves/) · [CurveTable](/en/works/mcp-dev-tools/docs/curve-tables/) · [StringTable](/en/works/mcp-dev-tools/docs/string-tables/) · [Enhanced Input](/en/works/mcp-dev-tools/docs/enhanced-input/)

## Workflow

To change a row in an existing DataTable, follow the [connection guide](/en/works/mcp-dev-tools/docs/connect/) and read the current row struct and the full original row. Give the tool the old and new values for a dry run. If the preview passes, set `bDryRun=false` to apply the change. The tool rejects the write if the original values have changed. Check the result and call `SaveAsset` separately for the target asset. The tools do not check out files or overwrite assets on creation. Saving the target does not save its references.

## Development status

Work on UE 5.2–5.8 is ongoing. Compatibility remains unconfirmed, and testing across those versions is incomplete. [MCPDevTools user guide](/en/works/mcp-dev-tools/docs/inspect-editor/)
