---
title: MCPAnimation
description: MCPAnimation is an Unreal Editor MCP plugin in development, providing tool interfaces for Animation Blueprints, state machines and animation assets. Features and compatibility are still being verified.
type: work
slug: mcp-animation
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 16
status: In development
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /en/works/mcp-animation/docs/connect/
featured: false
draft: false
sitePublish: true
tags:
  - Animation Blueprints, state machines and animation assets
  - MCP series
lang: en
translationKey: mcp-animation
sourceHash: 57c31892c496056ab3fa5613b7d0208a8327cf1bbaaf512ff75c2a53ce6656e2
generatedBodyHash: d7f18ceed1af3fd53287c5ae64f7d913759fa10f84e002f2db4f7cf2e3a57fa4
translationStatus: translated
coverAlt: MCPAnimation cover
websiteCoverUrl: /media/covers/works/mcp-animation-20261101.webp
docIds:
  - mcp-animation-connect
  - mcp-animation-find-assets
  - mcp-animation-animation-blueprint
  - mcp-animation-montage-and-blendspace
  - mcp-animation-animation-notifies
  - mcp-animation-animation-blend-spaces
---

## About this work

MCPAnimation is an Unreal Editor MCP plugin in development. It gives external AI tools a local HTTP interface for finding, inspecting, and editing animation assets. The available operations and diagnostics are still being tested and may change.

## Development direction

### Animation Blueprints and state machines

Inspect an existing blueprint’s AnimGraph, states, transitions, and conduits, or create a new Animation Blueprint for a given Skeleton. The tools can add or remove states, add transitions, and set supported transition rules. They replace a state's animation only when they can identify a single Sequence Player that drives the state result directly. Edit more complex state graphs in Unreal Editor. [Animation Blueprints and state machines](/en/works/mcp-animation/docs/animation-blueprint/)

### Animation assets and samples

Inspect a Skeleton's bones, virtual bones, and slot groups, or read an AnimSequence's duration, sample rate, and notifies. Curve and compression data are available as read-only summaries. The tools do not export full keyframes or per-bone tracks. [Animation assets](/en/works/mcp-animation/docs/find-assets/)

Create a Montage from an AnimSequence, then add, remove, or adjust sections. You can also find notify classes and add or remove notifies on a Montage or AnimSequence. BlendSpace has separate tools for editing sample points. [Montage sections](/en/works/mcp-animation/docs/montage-and-blendspace/) · [Animation notifies](/en/works/mcp-animation/docs/animation-notifies/) · [BlendSpace samples](/en/works/mcp-animation/docs/animation-blend-spaces/)

## Workflow

To replace the animation on a state, follow the [connection guide](/en/works/mcp-animation/docs/connect/) and point your client at the address shown by Unreal Editor. Read the state machine using the canonical asset path and confirm the target. After editing, compile the Animation Blueprint and check the graph diagnostics. Call `SaveAsset` once you are ready to write the changes to disk. Writes require a valid `/Game` path and are rejected during PIE, saving, or garbage collection.

## Development status

Work on UE 5.2–5.8 is ongoing. Compatibility remains unconfirmed, and testing across those versions is incomplete. The tools operate on animation assets in Unreal Editor. They do not handle Sequencer or Control Rig, runtime network replication, project builds, or plugin packaging.

## Support

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
