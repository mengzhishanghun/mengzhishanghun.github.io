---
title: "Local Images in Markdown: What Should You Do When Publishing?"
description: Relative paths, separate image files, and Base64 embedding each suit different scenarios. Check the target platform before choosing an export method.
type: blog
slug: markdown-images
categoryId: notes
categoryName: Essays
categoryOrder: 4
status: 已发布
featured: true
date: 2026-09-12
draft: false
sitePublish: true
tags:
  - Markdown
  - Writing tools
productIds:
  - md-blog-packer
workIds:
  - markdown-publishing
docIds:
  - md-blog-packer
lang: en
translationKey: markdown-images
sourceHash: fb711dc5f822162e3f5a93704c98a699cdd2accc5a577407706c660f18d13206
translationStatus: translated
generatedBodyHash: 0d97c42a0754784570ca3b5cfee41935cae8a97e133eab9a5e69640bf27ab916
---

A Markdown article displaying correctly on your computer does not mean its images will appear after you copy the text to another website. Relative paths in image syntax only specify file locations; the images themselves do not move with the text.

## Your Own Website: Keep Images as Separate Files

If you control the website files, you can usually keep the article and images in the repository together and let the build process generate accessible image URLs. Separate images are easy to replace, compress, and cache, and easier to maintain during everyday writing.

## Copying to Another Platform: Check How It Accepts Images

Some platforms require image uploads, some accept remote image URLs, and others allow Base64 embedding. Before publishing, test one small image in the target editor and final page; do not rely only on the preview shown while pasting.

Base64 places image data in the text, removing dependence on the original local path. The tradeoff is that encoded data is usually about one-third larger than the original binary, and cannot be cached separately as conveniently. Large numbers of high-resolution images are better kept as separate files or uploaded using the platform's own method.

## Where MDBlogPacker Fits

MDBlogPacker reads standard Markdown image references and Wiki image references, converts local images to Base64, and copies the result or exports it to a file. Remote and already embedded images remain unchanged by default.

You can therefore retain the original Markdown and images for daily writing and generate export text only when publishing across platforms. Editing the original image does not require changing a long encoded string, and the publishing copy does not replace the original.

## A Short Pre-Publication Check

- Confirm that the target platform allows embedded images and inspect the final preview.
- Control image dimensions to avoid oversized export text.
- Keep the original article and image files to simplify later changes.

Tool behavior is based on [MDBlogPacker's public README](/en/docs/tools/md-blog-packer/). See the related documentation below for specific instructions.
