---
title: 按配置更新文件
type: doc
slug: simple-file-updater-update-files
draft: false
sitePublish: true
tags:
  - 文件更新
  - 自动化
workIds:
  - simple-file-updater
docPage:
  work: simple-file-updater
  group: updates
  slug: update-files
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-file-updater/docs/update-files/
lang: zh
translationKey: doc:simple-file-updater:update-files
---

## 编写更新清单

默认配置文件为 **`.SimpleFileUpdater`**，内容格式如下：

```
# 每行一个映射：本地路径 = 远程 URL
Tools\MyTool.exe = https://example.com/releases/MyTool.exe
Docs\Manual.pdf  = https://cdn.example.com/docs/Manual.pdf
```

- 支持相对路径或绝对路径
- 自动创建所需文件夹
- 支持注释（以 `#` 开头）

## 运行更新并查看结果

将 `SimpleFileUpdater.exe` 与 `.SimpleFileUpdater` 放在同一目录，然后：

- **双击 `SimpleFileUpdater.exe`**，程序将自动读取配置文件并同步所需文件
- 或者通过命令行运行：

```bash
SimpleFileUpdater.exe MyConfig.txt
```

执行完成后程序会停留在命令行，等待用户按回车查看结果。

## 覆盖同名文件前核对

这是个人工具，使用风险由使用者承担。运行前核对远程 URL 是否可信、目标路径是否正确。更新可能覆盖同名文件，请提前备份。
