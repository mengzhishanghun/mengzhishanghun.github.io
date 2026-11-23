---
title: Reuse the Dependency Environment
type: doc
slug: p4-case-sync-reuse-environment
draft: false
sitePublish: true
tags:
  - Perforce
  - Version Control
workIds:
  - p4-case-sync
documentKind: product-manual
websiteRoute: /en/works/p4-case-sync/docs/reuse-environment/
lang: en
translationKey: doc:p4-case-sync:reuse-environment
sourceHash: d38ecf752b5a99e281b3a69b32e5b751b957becf3594dae92efc2a49482c0a63
translationStatus: translated
generatedBodyHash: 9c9223d53e62cdb26ad94198fbdc980c4b4be04adde71a580511423293d5143d
docPage:
  work: p4-case-sync
  group: features
  slug: reuse-environment
  order: 3
---

## Export and Restore Environments

Activate the environment you want to reuse, then export its dependencies with the tool you used to set it up: Conda or pip. Use the matching commands to restore it.

## Conda

**Export the active environment:**
```bash
# 当前激活 p4casesync 环境
conda env export > environment.yml
```

To export only explicitly installed packages, use Conda’s history. The command above exports the active environment.

**Restore:**
```bash
conda env create -f environment.yml
conda activate p4casesync
```

## pip and venv

**Export:**
```bash
# 激活你的 venv 后
pip freeze > requirements.txt
```

**Restore:**
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
