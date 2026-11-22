---
title: MDBlogPacker
description: The Python version of MDImageEmbed exports Markdown with local images embedded as Base64. Future maintenance will focus on MDBlogPacker.
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
sourceHash: 62e488ce828b741475950004789da9b3e88520de570cf104e07e84063f957ba7
translationStatus: translated
generatedBodyHash: d04ca898d8b4f57f4e0d65e59f6731a66cef6fac5ed2fac0d0b01e99967b91ae
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/MDBlogPacker
    - kind: docs
      href: /en/works/md-blog-packer/docs/setup/
  compatibility:
    - platforms:
        - Markdown tool (operating system to be verified)
      requirements: []
websiteCoverUrl: /media/covers/works/md-blog-packer-20261101.webp
coverAlt: MDBlogPacker cover
docIds:
  - md-blog-packer-setup
  - md-blog-packer-package
---

## Overview

MDBlogPacker is the Python version of MDImageEmbed. It exports Markdown with local images embedded as Base64. Future maintenance of MDImageEmbed will focus solely on its Python version, MDBlogPacker.

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

See the [usage guide](/en/works/md-blog-packer/docs/package/) for steps and parameters.

## License

MIT License
