---
title: 部署附加文件
type: doc
slug: ue-package-manager-deploy-additional-files
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 打包
  - 自动化
workIds:
  - ue-package-manager
docPage:
  work: ue-package-manager
  group: output
  slug: deploy-additional-files
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/ue-package-manager/docs/deploy-additional-files/
lang: zh
translationKey: doc:ue-package-manager:deploy-additional-files
---

## 设置复制规则

在图形界面的“附加文件”中选择文件或文件夹，并按规则设置包内目标子目录和递归忽略项。命令行可用 `copy-list` 查看规则、`copy-add` 添加规则、`copy-remove --index 0` 删除示例中的第一条规则。`--no-copy` 跳过本次部署。

## 复制时机与路径限制

附加复制只在 UE 打包成功后执行。目录复制会跳过 `.trash`、`.svn`、`.git`、`.codex`、`.agents`、`.vs`、`.idea`、`__pycache__` 和 `.pyc`，复制后检查文件完整性。用分号分隔名称模式，可以忽略任意层级的文件或文件夹。模式支持 `*` 和 `?`，例如 `README*.md; Cache`。目标位置必须是包根目录内的相对目录，禁止绝对路径、盘符和 `..`；递归忽略项只填写名称模式，不能包含路径。

[查看 CLI 的完整示例](/zh/works/ue-package-manager/docs/package-project/)
