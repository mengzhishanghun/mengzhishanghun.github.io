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
sourceHash: a9062dc9ed9766e571148f81ccb071a41b63e40cd135bdc0807f5953e6e12a4d
translationStatus: translated
generatedBodyHash: 08288e6ef86ae56732dc9a42c8ba4cb968c9d2624d8836c5ef8ebde9641613b7
---

## Overview

MDBlogPacker prepares Markdown containing local images as text that is easier to copy across platforms or export.

It recognizes standard Markdown image syntax and Obsidian Wiki image references, converting local images into embedded Base64 while preserving online images and images already embedded. Users can process articles through a graphical interface or command line, then copy the result or export a file.

## Background and goals

Images in local notes usually use relative paths or vault references. If only the Markdown body is copied to another publishing platform, that platform may be unable to access the local files, leaving the images broken.

Platforms accept images in different ways: some require uploads, some accept remote image URLs, and others allow Base64 embedding. MDBlogPacker is designed for individual publishing or migration operations to platforms accepting embedded images. It carries image data with exported text and reduces the need to reprocess each local image.

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

Keep the original Markdown and separate image files for everyday writing, and generate an export only when publishing across platforms. Editing the original image then does not require changing a long encoded string, and the publishing copy does not replace the original.

## Scope and limitations

The destination platform must accept Base64 images. Some platforms also limit article or image size. Before publishing, test one small image in the target editor and final page; do not rely only on the preview shown while pasting.

Base64-encoded image data is usually about one-third larger than the original binary and cannot be cached separately as conveniently. Control image dimensions and check platform rules and final file size before exporting. Large numbers of high-resolution images are better kept as separate files or uploaded using the platform's own method.

For sites where you control resources, the build process can publish the article and images together. Separate images are easier to replace, compress, cache, and maintain.
