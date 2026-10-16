---
title: MDImageEmbed
description: Copy Markdown in Obsidian after converting its local images to embedded Base64.
type: work
slug: md-image-embed
categoryId: obsidian-plugins
categoryName: Obsidian plugins
categoryOrder: 3
order: 1
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Images
  - Export
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19379394
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19379394
docIds:
  - md-image-embed-guide
sourceDate: 2025-12-21
lang: en
translationKey: md-image-embed
sourceHash: f561b9bb1e66ef9ceaba98cdf7c7bd6744454598a6ba682e9d3336e56a042fe7
translationStatus: translated
generatedBodyHash: 1b7f65663af1d6aa02119958c86222eb9fa23d69f64f2a5e7a7b7836305a7d61
workInfo:
  channels:
    - kind: docs
      href: /docs/zh/guides/writing-tools/md-image-embed-guide/
  compatibility:
    - platforms:
        - Obsidian plugin (operating system to be verified)
      requirements: []
---
## Overview

MDImageEmbed is a local image export plugin for Obsidian.

Right-click a Markdown file and choose Copy as Base64 format to copy its body with local images converted to embedded Base64. This makes it easier to repost an article to a platform accepting that image format.

## Background and goals

Obsidian notes can reference images within the vault, a convenient arrangement for daily editing. However, copying only Markdown text into an external editor does not carry the image files along, and the original paths usually cannot be resolved there.

The plugin performs the conversion inside Obsidian, generating a copy containing image data from the selected Markdown file for reposting.

## Core capabilities

### Right-click copy action

Right-click a `.md` file in Obsidian and choose Copy as Base64 format. The plugin processes that file and places the result on the clipboard.

The original note retains its normal editable image references, while the copied version is used for subsequent pasting and publishing.

### Parsing and filtering two reference formats

The plugin recognizes standard Markdown image syntax and Obsidian Wiki image references, resolving local image paths.

Online images and Base64 images already embedded are skipped, avoiding repeated processing of remote addresses or existing data.

### Publishing text templates

Configurable prefix and suffix templates add copyright notices or author information around the copied result. Templates supply fixed additional text; its presentation still depends on the destination editor and rendering rules.

## Use cases

It suits users who write mainly in Obsidian and occasionally repost articles with local images to blogs or other platforms supporting embedded images. Conversion and copying are available from the file context menu, making it convenient for manual publication of individual articles.

## Scope and limitations

The destination must support Base64 images or provide a feature that extracts embedded images. Check body length and upload size limits as well.

Embedding images makes text substantially larger. Successful copying does not guarantee that a platform can save or display it. Preview the actual result before publishing.
