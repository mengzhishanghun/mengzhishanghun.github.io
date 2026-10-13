---
title: MDBlogPacker User Manual
description: Complete English product manual for MDBlogPacker
type: doc
slug: md-blog-packer
categoryId: open-source-tools
categoryName: Open Source Tools
categoryOrder: 1
draft: false
sitePublish: true
tags:
  - Markdown
  - Images
workIds:
  - md-blog-packer
documentKind: product-manual
websiteRoute: /docs/zh/tools/md-blog-packer/
lang: en
translationKey: md-blog-packer
sourceHash: b81bc9c402bc6032d786dc122f20f2ba244d0b0d34fd8408d9a06af8eeaa5496
translationStatus: translated
generatedBodyHash: a90872962947b374d07c837bf0d8232a09d816b954988872cda8b57125d9cafb
---

# MDBlogPacker

A blogging productivity tool: batch-convert local images in Markdown to embedded Base64, automatically copy the result to the clipboard, and paste it into platforms supporting Base64 images, such as CNBlogs, CSDN, and Juejin, to publish directly — without uploading images one by one.

> 💡 **Obsidian users**: I also made an Obsidian plugin with the same functionality. Right-click a note for one-click conversion → [MDImageEmbed](https://github.com/MZSH-ObsidianPlugins/MDImageEmbed)

## Why This Tool

Images are the most tedious part of publishing a blog post: local images cannot be published directly, while image hosting requires individual uploads, copied links, and path replacement. Base64 embedding packs every image into the Markdown text, so you can simply copy and publish.

## Features

- Scans all local images in Markdown, supporting both `![](</path>)` and Obsidian `![[image.png]]` syntax
- Automatically converts them to embedded `data:image/...;base64,...` format
- Copies the result directly to the clipboard for immediate publication
- Supports prefix/suffix content such as copyright notices and anti-reposting notices; enter it in GUI mode or specify template files in CLI mode
- Leaves remote images and existing Base64 images unchanged

## Installation

```bash
# 用 environment.yml 创建 conda 环境
conda env create -f environment.yml
```

## Usage

### GUI Mode (Recommended)

Double-click `MDBlogPacker.exe` (or run `Main.py` without arguments) to open the graphical interface:

- Automatically selects the first `.md` file in the executable's directory
- Enter prefix/suffix content (optional; content is cached)
- Click “Convert and Copy to Clipboard,” then paste into your blogging platform

### CLI Mode

Running with arguments activates command-line mode:

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

### CLI Arguments

| Argument | Description |
|---|---|
| `input` | Input Markdown file path (required) |
| `-c / --clipboard` | Copy to clipboard (primary usage) |
| `-o / --output` | Write to a file |
| `-p / --prefix` | Prefix template file, appended before the body |
| `-s / --suffix` | Suffix template file, appended after the body |
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

## Notes

- Base64 increases file size by about 33%; use with care when images are numerous or large
- Remote images (`http://` / `https://`) are left unchanged
- Use it for export and publication; keep separate image files for everyday writing and maintenance

## License

MIT License
