---
title: Publishing Markdown Images Together with the Article
description: Reducing manual work when moving articles by converting local image paths into publishable text that can be copied.
type: case
slug: markdown-publishing
categoryId: desktop-automation
categoryName: Desktop & Automation
categoryOrder: 1
status: Completed
featured: true
draft: false
sitePublish: true
tags:
  - Markdown
  - Images
  - Writing tools
productIds:
  - md-blog-packer
coverAlt: Flowchart for publishing Markdown images together with an article
websiteCoverUrl: /assets/cases/markdown-publishing.png
lang: en
translationKey: markdown-publishing
sourceHash: 90a169d17e04bc16781b9d70b76295ab75dfbf2425188cd6daae92f8bec91aa0
translationStatus: translated
generatedBodyHash: ee7a0fe899c464a5eec55a1f0dfd874272ba87ad17501de4d4b48c19eeaa8a26
---

## Background

When copying local Markdown articles to other platforms, I found that the text could be transferred while the images still pointed to local files. To reduce the work of preparing each image individually, I created MDBlogPacker to include local images in the exported text.

Everyday writing can continue to use the original Markdown and separate images, with a copyable version generated when publishing across platforms.

## Reproduction Environment

The inputs are local Markdown and image files. Image references may use standard Markdown syntax or Obsidian Wiki image references.

The target publishing platform needs to allow Base64 embedded images and accept the resulting article size. The tool offers both GUI and command-line interfaces.

## Specific Problem

A local computer's ability to resolve a relative path does not mean the target platform can access the same file. When only text is copied, image files do not move with it, potentially leaving blank images or broken references after publication.

## Solution

Before selecting an export method, it is necessary to distinguish the appropriate uses of separate images, remote URLs, and Base64 embedding. A site that can manage its own assets may need a different approach from an editor that only accepts pasted content. For guidance on choosing an image publishing method, [read the image publishing approach details](https://mzsh.me/blog/markdown-images/).

MDBlogPacker recognizes standard Markdown image syntax and Wiki image references, reads local images, and converts them into Base64 embedded format. Remote images and images already embedded remain unchanged.

The converted result can be copied or exported to a file as a publishing copy. The original article and images remain the maintenance sources, so later changes do not require direct editing of long encoded blocks.

Embedding increases text size, so the target platform's acceptance rules and the final page appearance still need to be checked before publication.

## Final Summary

The work produced an image conversion tool usable through a GUI or CLI, allowing local images to move with exported text and reducing per-image preparation when transferring articles.

Successful display depends on the target platform's support for embedded images. For websites that can manage their own assets, synchronizing images separately remains useful for caching and later replacement.
