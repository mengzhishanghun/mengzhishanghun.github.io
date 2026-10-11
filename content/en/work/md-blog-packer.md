---
title: MDBlogPacker
description: Convert local Markdown images to embedded Base64 for export and copying to compatible platforms.
type: work
slug: md-blog-packer
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
order: 0
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Markdown
  - Images
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/MDBlogPacker
lang: en
translationKey: md-blog-packer
sourceHash: c94cfee3466159f854dff9490c12902ceb4fbdbba2854bfa9470f60ba707addb
translationStatus: translated
generatedBodyHash: 265da1f38372ee8ff276d21bba7e5468b610079f76dcf5e52a03e1202f49faef
---

## Overview

MDBlogPacker prepares Markdown containing local images as text that is easier to copy across platforms or export.

It recognizes standard Markdown image syntax and Obsidian Wiki image references, converting local images into embedded Base64 while preserving online images and images already embedded. Users can process articles through a graphical interface or command line, then copy the result or export a file.

## Background and goals

Images in local notes usually use relative paths or vault references. If only the Markdown body is copied to another publishing platform, that platform may be unable to access the local files, leaving the images broken.

Designed for individual publishing or migration operations, the tool carries image data with exported text and reduces the need to reprocess each local image on the destination platform.

## Core capabilities

### Recognizing local image references

The tool handles both standard Markdown image syntax and Obsidian Wiki image references, covering two common note-writing styles.

Only local images are embedded after recognition. Online image URLs and content already in Base64 remain unchanged, avoiding repeated rewriting of every image reference in an article.

### Batch conversion and output

Several local images in an article can be embedded in a single operation. The graphical interface suits manual inspection and copying; the CLI suits workflows already using the command line. Results can be copied directly or exported as a file for later publishing.

### Prefix and suffix templates

Prepared content, such as copyright notices or author information, can be appended before and after the exported text. This is additional publishing text: it does not change the images' origin or replace the destination platform's copyright or content settings.

## Use cases

It suits authors maintaining Markdown locally who need to copy illustrated articles to platforms supporting Base64 images, or create a portable text copy of an individual article.

Long-term source manuscripts can continue using separate image files, with exports generated as needed for publishing.

## Scope and limitations

The destination platform must accept Base64 images. Some platforms also limit article or image size.

Embedding images significantly increases text length, so check platform rules and final file size before exporting. For sites where you control resources, synchronizing separate images is usually easier for caching and ongoing maintenance.
