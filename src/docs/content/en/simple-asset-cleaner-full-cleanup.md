---
title: Run a Full Cleanup
type: doc
slug: simple-asset-cleaner-full-cleanup
draft: false
sitePublish: true
tags:
  - Asset Management
  - Reference Analysis
workIds:
  - simple-asset-cleaner
documentKind: product-manual
websiteRoute: /en/works/simple-asset-cleaner/docs/full-cleanup/
lang: en
translationKey: doc:simple-asset-cleaner:full-cleanup
sourceHash: 9171506e26354a4d2c0271f81ed0e441c884e60c5099483ceff7bd89b8025576
translationStatus: translated
generatedBodyHash: e40f99a5f8e53e89e8cc99900e88a903024569cf7a44e698cba96dbc81d5b9cc
docPage:
  work: simple-asset-cleaner
  group: cleanup
  slug: full-cleanup
  order: 2
---

## Scan the Whole Project

Full cleanup is useful for periodic maintenance, taking over a legacy project, or preparing a major release. It deletes committed files that are no longer referenced. Make sure you have a recoverable commit, try it on a test branch, and tell your team beforehand.

1. Open `Editor > Project Settings > General > Simple Asset Cleaner`.
2. Click `Clean All Source Control Assets` and wait for the progress bar to finish.
3. Review the log to see which assets were cleaned up.

## Cleanup Results by File Status

| Asset status | Automatic cleanup (submission) | Manual full cleanup |
| --- | --- | --- |
| Newly added unreferenced asset | Revert (retain local copy) | Revert (retain local copy) |
| Submitted unreferenced asset | No action | Delete (server + local) |
| Referenced asset | Submit normally | Retain |
| Plugin and engine assets | No action | No action |
