---
title: Install and Start
type: doc
slug: md-blog-packer-setup
draft: false
sitePublish: true
tags:
  - Markdown
  - Images
workIds:
  - md-blog-packer
documentKind: product-manual
websiteRoute: /en/works/md-blog-packer/docs/setup/
lang: en
translationKey: doc:md-blog-packer:setup
sourceHash: 316b5fd002901bba208823899d5dfbce0cae41dbc4cb7eb6266fdc07633e5cb8
translationStatus: translated
generatedBodyHash: 1229be19ca12d6a00e219c6e6eae345b03767e3ceb6b23ea7740a829a37c5170
docPage:
  work: md-blog-packer
  group: getting-started
  slug: setup
  order: 1
---

## Create the Conda Environment

To run from source, open a terminal in the directory that contains `environment.yml` and create the Conda environment with this command.

```bash
# 用 environment.yml 创建 conda 环境
conda env create -f environment.yml
```

## Start the Tool

Double-click `MDBlogPacker.exe` to open the GUI. When running from source, launch `Main.py` without arguments to open the GUI, or pass arguments to use command-line mode.
