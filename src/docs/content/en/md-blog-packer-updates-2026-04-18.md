---
title: 2026-04-18
type: doc
slug: md-blog-packer-updates-2026-04-18
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - md-blog-packer
docPage:
  work: md-blog-packer
  group: changelog
  slug: updates-2026-04-18
  order: 79739582
documentKind: product-manual
websiteRoute: /en/works/md-blog-packer/docs/updates-2026-04-18/
lang: en
translationKey: doc:md-blog-packer:updates-2026-04-18
sourceHash: 3740d1661755592ff0dbdde0352462bf7f232be09ec3be731594edc11a3f35d8
translationStatus: translated
generatedBodyHash: 7f3ef467649cd6abf090decd03748d8dd5bc1e21c90892b60a7263f112801944
---

## v1.0.0

This is the first stable release. It converts local images referenced in Markdown to inline Base64 images in batches. The tool copies the result to the clipboard so you can paste it into a blog platform that supports Base64 images.

- The GUI lets you pick a file, edit multiline text to add before and after it, then convert and copy the result with one click. The CLI supports pipes, file output, and template files for the text before and after the document.
- Both standard Markdown and Obsidian image syntax work. The tool looks up the directory tree for `.obsidian/` to find the vault root and resolve paths such as `/附件/xxx.png`.
- This version saves the Markdown file path and the text before and after it in `%LOCALAPPDATA%\MDBlogPacker\Config.json` and restores them at startup.
- The single EXE supports Windows 10 and later and requires no separate Python installation.

Published on [GitHub Release](https://github.com/MZSH-Tools/MDBlogPacker/releases/tag/v1.0.0).
