---
title: What happens to local images when you publish Markdown?
description: Choose between separate image files and Base64 embedding based on where your article will be published.
lang: en
slug: markdown-images
categoryId: writing
categoryName: Writing and publishing
categoryOrder: 0
order: 0
status: Published
featured: true
translationKey: markdown-images
date: 2026-09-12
draft: false
tags: [Markdown, Writing tools]
productIds: [md-blog-packer]
workIds: [markdown-publishing]
docIds: [md-blog-packer]
---

A Markdown document can display correctly on your computer and lose its images when copied into another website. A relative image path describes a file location; it does not carry the file with the text.

## On your own website: keep separate images

When you control the website files, you can keep articles and images in the repository and let the build produce accessible image URLs. Separate files are easier to replace, compress, cache, and maintain during writing.

## On another platform: check the supported format

Some platforms require uploads, some accept remote URLs, and some allow Base64 images. Try a small image and check the final preview, not only the editor immediately after pasting.

Base64 puts the image data inside the text, removing the dependency on a local path. Encoded data is usually about one third larger than the original binary data, and images cannot be cached separately in the same way. For many large images, separate files or the platform's upload workflow are usually a better fit.

## Where MDBlogPacker fits

MDBlogPacker reads standard Markdown and wiki image references, embeds local images as Base64, and can copy or export the result. Remote images and existing embedded images are preserved by default.

Keep the original Markdown and images while writing, then generate an export when a destination requires it. This keeps image editing practical and prevents a publishing copy from replacing your source material.

## Before publishing

- Check that the destination accepts embedded images and inspect its final preview.
- Keep image sizes reasonable so the exported text does not become too large.
- Retain the original document and image files for later updates.

Tool behavior is based on the [public MDBlogPacker README](https://github.com/MZSH-Tools/MDBlogPacker#readme). The related guide below covers practical steps.
