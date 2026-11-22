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
sourceHash: 6a7ad277da8ae237e90566d6cf58c4c3ab75dde51a3ddf2e2aaaaa6a2b123c07
translationStatus: translated
generatedBodyHash: 38aecbf6c1f7b73517879eff37e8bff9dae51f34694406bc7e0f0218b84128be
docPage:
  work: md-blog-packer
  group: setup
  slug: setup
  order: 1
---

## Create the Conda Environment

```bash
# 用 environment.yml 创建 conda 环境
conda env create -f environment.yml
```

## Start the Tool

Double-click `MDBlogPacker.exe` to open the GUI. From source, run `Main.py` without arguments for the GUI or with arguments for the command line.
