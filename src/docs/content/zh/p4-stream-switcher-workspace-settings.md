---
title: 配置工作区与本机选项
type: doc
slug: p4-stream-switcher-workspace-settings
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: features
  slug: workspace-settings
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/workspace-settings/
lang: zh
translationKey: doc:p4-stream-switcher:workspace-settings
---

## 工作区命名、目录与同步选项

| 功能 | 用法与影响 |
| --- | --- |
| 工作区标识 | 输入个人标识并点击保存，生成“标识_项目_分支”；O 表示有效，X 表示为空或冲突。更换标识时，确认提示可能批量重命名旧工作区。 |
| 项目与分支 | 项目列表来自 mainline 流，分支列表来自所选项目；不支持任意深度流结构。 |
| 工作区目录 | 点击选择目录；按流缓存路径，界面区分路径来源，自动生成的默认路径需要确认。 |
| 创建 P4CONFIG | 默认启用，切换时创建或更新根目录 .p4config，写入服务器、用户、客户端。其他命令要读取它，仍需相应的 P4CONFIG 环境配置。 |
| 自动删除空文件夹 | 默认启用；修改时会更新当前标识下本地工作区的 rmdir 选项，同步时清理空目录。 |
| 换行符 | 按团队客户端规范选择 local、unix、mac、win 或 share，默认 win。新建工作区使用已保存的设置。工具启动时也会按该设置检查并修正当前标识下已有本地工作区的换行符设置。 |
| 状态与日志 | 查看服务器、用户、已用/最大工作区数、进度及信息、警告、错误日志。 |

![P4StreamSwitcher 的通用配置与工作区选项](/media-occurrence/doc%3Ap4-stream-switcher%3Aworkspace-settings%3Amedia%3A1)

通用配置位于窗口上方，工作区选项位于中部。图中展示各配置项的位置，项目、分支和目录尚未填入，也未执行切流。

## 本机配置保存与标识排查

工具在用户缓存目录保存标识、池上限、选项、使用时间戳，以及每个流的目录、离线选项和同步状态。Windows 通常位于 %LOCALAPPDATA% 下；不要把这些本机记录作为项目共享配置。

- 提示标识未保存：点击保存，再执行切换；处理可能出现的重命名提示。
