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
sourceHash: d5ee100146ca99356831cdb19501bfbdf6d521860af8a4126c8ee6dec23921f0
translationStatus: translated
generatedBodyHash: b765fda6740efb4146a4857d0108dea2525662d71267196201eb6037734e61ca
docPage:
  work: p4-case-sync
  group: distribution
  slug: reuse-environment
  order: 2
---

## Export and Restore Environments

Export the dependency list from the existing environment, then restore it with the matching tool.

## Conda

**Export the active environment:**
```bash
# 当前激活 p4casesync 环境
conda env export > environment.yml
```

For an export limited to explicitly installed packages, use Conda?s history. The command above exports the active environment.

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
