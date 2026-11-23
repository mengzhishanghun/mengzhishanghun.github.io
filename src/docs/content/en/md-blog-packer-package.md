---
title: Package Markdown and Images
type: doc
slug: md-blog-packer-package
draft: false
sitePublish: true
tags:
  - Markdown
  - Images
workIds:
  - md-blog-packer
documentKind: product-manual
websiteRoute: /en/works/md-blog-packer/docs/package/
lang: en
translationKey: doc:md-blog-packer:package
sourceHash: 61f23c7bab1fa524b570538b0e8146a03fbee67abc2876408d1da69533c3e355
translationStatus: translated
generatedBodyHash: 8518e2c3b98dee0e901c0f26704f3f8e8ccb862db499466065a40470bdafd0bc
docPage:
  work: md-blog-packer
  group: features
  slug: package
  order: 1
---

## What Gets Converted

MDBlogPacker converts local images referenced with `![](</path>)` or Obsidian `![[image.png]]` to `data:image/...;base64,...`. By default, it leaves remote images and existing Base64 images unchanged. You can copy the result, save it to a file, or pipe it to another command.

## GUI

1. Check the input article. On startup the GUI selects the first `.md` file in the EXE directory.
2. Optionally add a prefix and suffix, such as a copyright notice or a reposting policy. The GUI remembers these fields.
3. Click **Convert and Copy to Clipboard**, then paste the result into a platform that accepts Base64 images.

## Command Line

Pass arguments to use command-line mode. Replace `博客.md` with the path to your article. Use `-c` to copy the result to the clipboard or `-o` to write it to a file:

```bash
# 最常用：转换 + 复制到剪贴板
conda run -n MDBlogPacker python Main.py 博客.md -c

# 带版权前后缀
conda run -n MDBlogPacker python Main.py 博客.md -c -p 前缀.md -s 后缀.md

# 输出到文件（不走剪贴板）
conda run -n MDBlogPacker python Main.py 博客.md -o 博客-内嵌版.md

# 查看详细转换日志
conda run -n MDBlogPacker python Main.py 博客.md -c -v
```

## CLI Arguments

| Argument | Description |
|---|---|
| `input` | Input Markdown file path (required) |
| `-c / --clipboard` | Copy to clipboard (primary usage) |
| `-o / --output` | Write to a file |
| `-p / --prefix` | Template file inserted before the article body |
| `-s / --suffix` | Template file inserted after the article body |
| `--no-wiki-links` | Do not convert Obsidian `![[]]` Wiki links |
| `--no-skip-base64` | Do not skip existing Base64 images |
| `-v / --verbose` | Detailed logs showing the processing status of each image |

Without `-c` or `-o`, output goes to standard output and can be piped.

## Image Path Resolution

The following are tried in order:

1. Absolute paths
2. Paths relative to the source MD file's directory
3. Paths relative to the Obsidian vault root (such as `/附件/xxx.png`; the tool searches upward for `.obsidian/` to locate the vault root)

URL-encoded characters such as `%20` are automatically decoded.

## Supported Image Formats

PNG、JPG、JPEG、GIF、WebP、SVG、BMP

## Before Publishing

- Base64 increases file size by about 33%; use with care when images are numerous or large
- Remote images (`http://` / `https://`) are left unchanged
- Use it for export and publication; keep separate image files for everyday writing and maintenance
