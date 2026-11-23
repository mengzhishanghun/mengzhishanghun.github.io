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
sourceHash: 2b84706559dd4a2aeb8649a01179773eb31784d0669defa9df2ddbeeceb0504f
translationStatus: translated
generatedBodyHash: 87d90526dbe2033521077cb1f57ed3119426310d75845b34e06bf90d31384daf
docPage:
  work: simple-file-updater
  group: getting-started
  slug: setup
  order: 1
---

## Use the EXE

Place `SimpleFileUpdater.exe` and the default `.SimpleFileUpdater` configuration file in the same directory.

## Run from Source

To run from source, open a terminal in the project directory that contains `Main.py`. Install the dependencies with either method below, then run `Main.py`.

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
