---
title: Diagnose an Unreal Editor Instance
type: doc
slug: mcp-dev-tools-inspect-editor
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/inspect-editor/
lang: en
translationKey: doc:mcp-dev-tools:inspect-editor
sourceHash: 8737be830b190d922bdfcbb75ed120561856b18c6de09b0eddb1572447c36e44
translationStatus: translated
generatedBodyHash: aa085f3cf9f28edba9d5543f67a10404e3fe2bcb92f9b8a3441cfc5f323b7fd1
docPage:
  work: mcp-dev-tools
  group: diagnostics
  slug: inspect-editor
  order: 1
---

## Session, plugins, and logs

| Type | Tools | Purpose and main parameters |
|---|---|---|
| Development context | `GetDevContext` | Read the project, actual engine/plugin versions, instance and session identifiers, server status, actual port, and listener observations. `IncludePaths` defaults to false. Explicitly set it to true to return absolute paths to the current project file and engine directory. |
| Project plugins | `ListProjectPlugins` | Read allowlisted fields from loaded plugin-manager information. `Scope` defaults to `enabled` and also accepts `discovered`. Results use stable sorting and pagination. |
| Plugin logs | `ReadDevLog` | Read only `LogMCPDevTools` entries captured after module registration completes. Page using `Cursor`, `Limit`, and optional `VerbosityFilter`. |

The three diagnostic tools do not start processes or test jobs, load assets, save packages, or change configuration. Their inputs reject extra fields. Missing context returns a specific reason for unavailability.

## Plugin and log pagination

`ListProjectPlugins` and `ReadDevLog` default to 100 items per page, with a maximum of 200. Continue with the returned `NextCursor`. Log pages also reserve a serialization budget for worst-case JSON escaping, with a maximum `TextContent` length of 512 Ki TCHAR. A page may therefore contain fewer entries than `Limit`; matching entries that were not returned remain available on the next page. Plugin lists return only the name, friendly name, version number/name, enabled state, source, and type. They do not return arbitrary descriptor JSON or plugin paths. List cursors are bound to a snapshot, Scope, and Limit. If the information or query conditions change, restart the query without Cursor.

## Log retention and gaps

Logs exist only in the current process's memory, with limits of 2,048 entries, 2 MiB of total text, and 8,192 TCHAR per entry. `VerbosityFilter` accepts `Fatal`, `Error`, `Warning`, `Display`, `Log`, `Verbose`, and `VeryVerbose`; omitting it or passing an empty array disables level filtering. Output includes `CaptureStartUtc`, `CaptureSession`, `NextCursor`, coverage-gap fields `bGap` / `DroppedSinceCursor`, and the truncation flag `bTruncated`. Even when no logs match, the cursor advances to the position already examined. Cursors from an earlier capture session are rejected, and the first read may already have a coverage gap. Module shutdown stops capture and unregisters the output device. The tool provides no disk logs, history from before registration, or guarantee of complete capture during a crash. Plugin logs produced by HTTP queries may appear on subsequent pages. Messages in this category may contain project names or paths; logs are not guaranteed to be free of private information.

## Listener observations

On Windows, listener results come from read-only `GetExtendedTcpTable` observations of the current PID and ActualPort for IPv4/IPv6. `observed_loopback` requires both address-family queries to succeed and every matching address to be in IPv4 127/8 or IPv6 ::1; wildcard addresses produce `observed_non_loopback`. Query failure, ambiguous ownership, no matches, or a state change produces `unknown`; a stopped server produces `not_running`. Other platforms return the reason `unsupported_platform`. A returned 127.0.0.1 URL does not itself prove the actual binding. OS observations describe only the sampling instant and provide neither authentication nor an ongoing security guarantee. The tools do not change listeners, HTTP settings, firewalls, or permissions.
