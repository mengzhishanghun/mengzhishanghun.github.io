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
sourceHash: 80e4b3b7ec99b2834a454ecd8d339f358265ba6e7d0dbe63c72ac826bb27abf3
translationStatus: translated
generatedBodyHash: 3d27540334728ded4c56c7c11d9617c46c865c0bc7c497e8ac317fd232c8968e
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

Tool behavior is based on [MDBlogPacker's public README](/docs/en/tools/md-blog-packer/). See the related documentation below for specific instructions.
