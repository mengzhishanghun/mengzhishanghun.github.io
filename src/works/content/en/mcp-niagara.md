---
title: MCPNiagara
description: MCPNiagara is an Unreal Editor MCP plugin in development, providing tool interfaces for Niagara systems, emitters and modules. Features and compatibility are still being verified.
type: work
slug: mcp-niagara
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 22
status: In development
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /en/works/mcp-niagara/docs/quickstart/
featured: false
draft: false
sitePublish: true
tags:
  - Niagara systems, emitters and modules
  - MCP series
lang: en
translationKey: mcp-niagara
sourceHash: 23f1e4bd1ec5b1a4db04b9f896a342b3b4ae4adfcdaa51ac2c3b785057f8bb41
generatedBodyHash: 931ad45d5acc12c8b3ac306d500ab03076da13dfe6f1523bca2d96750ef35585
translationStatus: translated
coverAlt: MCPNiagara cover
websiteCoverUrl: /media/covers/works/mcp-niagara-20261101.webp
docIds:
  - mcp-niagara-quickstart
  - mcp-niagara-inspect
  - mcp-niagara-niagara-system-assets
  - mcp-niagara-niagara-preview
  - mcp-niagara-edit-emitter
  - mcp-niagara-niagara-renderers
  - mcp-niagara-parameters-preview
---

## About this work

MCPNiagara is an Unreal Editor MCP plugin in development. It lets external AI tools inspect Niagara Systems, emitters, and module stacks and edit supported objects. Tool coverage and feedback may change during development.

## Development direction

### Inspect systems, emitters, and module stacks

Page through Systems, emitters, and visible module library assets, then inspect emitters, renderers, and user parameters in a System. Use an index to specify a module when names repeat in a Spawn, Update, or Event stage. Specify `UsageId` when there is more than one Event stage. Module details distinguish value sources such as graph overrides, dynamic bindings, and Rapid Iteration values. The tool does not guess a default when there is no override. [Assets and modules](/en/works/mcp-niagara/docs/inspect/)

### Adjust emitters, renderers, and user parameters

Copy an emitter into a System, edit supported properties, or replace and configure renderers. For a batch of property edits, the tool validates each name and new value before applying the changes. You can add, change, or remove supported value parameters. The value tools do not write object or Data Interface parameters, and removing a parameter does not update its graph references. [Emitters](/en/works/mcp-niagara/docs/edit-emitter/) · [Renderers](/en/works/mcp-niagara/docs/niagara-renderers/) · [User parameters](/en/works/mcp-niagara/docs/parameters-preview/)

## Workflow

To make a variant of an existing effect, [find and inspect the template](/en/works/mcp-niagara/docs/inspect/), then use `CreateNiagaraSystem` to copy it to a new writable package path. Existing assets are never overwritten. Check the returned canonical path, then configure the copy's renderers or user parameters. Review the result, call `SaveAsset`, and reopen the System in Unreal Editor to check it. [Creating and saving Systems](/en/works/mcp-niagara/docs/niagara-system-assets/) · [Exporting cached thumbnails](/en/works/mcp-niagara/docs/niagara-preview/)

Thumbnails come from memory or a saved package. They are not rendered live and cannot confirm that the latest edits are visible. On UE 5.2, if the tool warns that it could not clear the merge cache after you remove an emitter, refresh or reopen the System as advised before continuing with the merge workflow.

## Development status

Compatibility with UE 5.2–5.8 remains unconfirmed. Asset editing, saving, reopening, and packaging have not been fully verified in the target engine. Check them on a copy of your project first. [MCPNiagara user guide](/en/works/mcp-niagara/docs/inspect/)

## Support

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
