---
title: Prepare to Run
type: doc
slug: simple-file-updater-setup
draft: false
sitePublish: true
tags:
  - File updates
  - Automation
workIds:
  - simple-file-updater
documentKind: product-manual
websiteRoute: /en/works/simple-file-updater/docs/setup/
lang: en
translationKey: doc:simple-file-updater:setup
sourceHash: 10d85709da5ecc7d491fc773b093aba4977fddafaa9bf92b6dd7046a5734e133
translationStatus: translated
generatedBodyHash: a3b030c7c929f30c74a32d7ff3f5aadaa8b59762c3762b0be3ad5dbe29e41088
docPage:
  work: simple-file-updater
  group: setup
  slug: setup
  order: 1
---

## Use the EXE

Place `SimpleFileUpdater.exe` and the default `.SimpleFileUpdater` configuration file in the same directory.

## Run from Source

If you are running from source, set up dependencies with either Conda or pip and then run `Main.py`.

## Use Conda

```bash
conda env create -f environment.yml
conda activate SimpleFileUpdater
python Main.py
```

## Use pip

```bash
pip install -r requirements.txt
python Main.py
```
