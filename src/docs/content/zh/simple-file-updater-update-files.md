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
  group: features
  slug: update-files
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-file-updater/docs/update-files/
lang: zh
translationKey: doc:simple-file-updater:update-files
---

## 编写更新清单

在默认配置文件 **`.SimpleFileUpdater`** 中，每行写一组映射。等号左侧是本地保存路径，右侧是下载地址：

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

![SimpleFileUpdater 更新文件的运行输出](/media-occurrence/doc%3Asimple-file-updater%3Aupdate-files%3Amedia%3A1)

图中将 settings.json 更新为下载到的内容，完成后显示“已更新”。下载地址使用本机演示服务；实际使用时请填写自己的下载 URL。

![SimpleFileUpdater 文件已是最新的运行输出](/media-occurrence/doc%3Asimple-file-updater%3Aupdate-files%3Amedia%3A2)

再次运行同一份清单，下载内容与本地文件一致时，程序显示“已是最新”，并保留现有文件。

## 覆盖同名文件前核对

这是个人工具，使用风险由使用者承担。运行前先确认远程 URL 可信、目标路径正确；目标位置已有同名文件时，请先备份，更新可能覆盖它。
