---
title: 复用依赖环境
type: doc
slug: p4-case-sync-reuse-environment
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-case-sync
docPage:
  work: p4-case-sync
  group: features
  slug: reuse-environment
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/p4-case-sync/docs/reuse-environment/
lang: zh
translationKey: doc:p4-case-sync:reuse-environment
---

## 导出与恢复环境

先激活要复用的环境，按原来使用的 Conda 或 pip 导出依赖。恢复时选择对应的命令。

## Conda

**导出当前环境：**
```bash
# 当前激活 p4casesync 环境
conda env export > environment.yml
```

如果只需要显式安装记录，可从 Conda 历史导出，避免把无关依赖也写进去。上面的命令导出的是当前环境。

**还原：**
```bash
conda env create -f environment.yml
conda activate p4casesync
```

## pip 与 venv

**导出：**
```bash
# 激活你的 venv 后
pip freeze > requirements.txt
```

**还原：**
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
