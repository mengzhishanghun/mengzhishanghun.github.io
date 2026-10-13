---
title: MDImageEmbed User Manual
description: Complete English product manual for MDImageEmbed
type: doc
slug: md-image-embed-guide
categoryId: obsidian-plugins
categoryName: Obsidian Plugins
categoryOrder: 3
draft: false
sitePublish: true
tags:
  - Images
  - Export
workIds:
  - md-image-embed
documentKind: product-manual
websiteRoute: /docs/zh/guides/writing-tools/md-image-embed-guide/
lang: en
translationKey: md-image-embed-guide
supplementSources:
  - docs/content/en/supplements/md-image-embed-guide-1.md
sourceHash: ec02d2e2e0c25ff11c57f5f0d45c0e02b74ecb5c7d74c106942538bcceb65177
translationStatus: translated
generatedBodyHash: bb0659c1bc6d124f4ba80328164ad2ef2484de215b7a8df04554a9c0d1d00b03
---

# MD Image Embed

MDImageEmbed is an Obsidian plugin that converts local images in Markdown files to embedded Base64. It is useful for exporting notes, publishing blog posts, or sharing documents without relying on external image files.

[License: MIT](https://opensource.org/licenses/MIT)
[Obsidian](https://obsidian.md)

## Features

- **One-click conversion**: Context menu → Copy as Base64 format to the clipboard
- **Smart path resolution**: Supports various Obsidian image path formats
- **Anti-reposting protection**: Adds custom prefixes/suffixes from template files (v1.1.0)
- **Format support**: PNG, JPG, JPEG, GIF, WebP, SVG, BMP
- **Wiki link support**: Converts `![[image.png]]` to standard Markdown containing Base64

## Installation Methods

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest Release
2. Create the folder `<Vault>/.obsidian/plugins/md-image-embed/`
3. Copy the files into that folder
4. Restart Obsidian and enable the plugin under Settings → Community Plugins

### Build from Source

```bash
git clone https://github.com/MZSH-ObsidianPlugins/MDImageEmbed.git
cd MDImageEmbed
npm install
npm run build
```

## How to Use

1. Right-click any `.md` file in the Obsidian file explorer
2. Select **Copy as Base64 format**
3. Paste the converted content wherever you need it

### Settings

Configure under **Settings → Community Plugins → MD Image Embed**:

- **Show conversion logs**: Display a conversion summary in notifications
- **Show detailed logs**: Display each image's status in notifications
- **Convert Wiki links**: Convert `![[image.png]]` to standard Markdown
- **Skip Base64 images**: Skip images already converted to Base64
- **Prefix/suffix file paths**: Add custom content before and after the article for anti-reposting protection

### Anti-Reposting Protection

Add copyright notices or author information:

1. Create template files such as `templates/prefix.md` and `templates/suffix.md`
2. Enter the file paths in the plugin settings
3. The content is added automatically when copying

## Notes

- Only local images are supported; remote URLs are skipped
- Base64 encoding increases file size by about 33%
- Recommended only for export/sharing

## License

MIT License

## Contact

Email: mengzhishanghun@outlook.com
