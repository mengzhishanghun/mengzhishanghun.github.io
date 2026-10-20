---
title: Fab 提交经验：把发布包和使用说明一起检查
description: 功能在开发工程里能用，不等于交付包能安装和复现。这份记录提炼过去的 UE 内容发布经验，不介绍具体插件产品，也不声称代表当前 Fab 审核规则。
type: blog
slug: ue-fab-submission-notes
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: 已发布
featured: false
date: 2026-10-13
publishedAt: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: zh
translationKey: ue-fab-submission-notes
---

上传Fab须知
===

# 插件结构模板
经过测试我总结出来一套最适合自己使用的插件结构模板
```
MyPlugin/
		Binaries/
		Config/
		Docs/
			LICENSE.md
			CHANGLOG.md
			README.md
		Resources/
		Source/
		ThirdParty/
		README.md
		MyPlugin.uplugin
```
## 根目录README.md作用
一方面，在github仓库中展示，一方面作为插件的介绍使用，上传Fab时拷贝到产品描述中，限定为1900字符以内

# .uplugin文件示例
```
{
	"FileVersion": 3,
	"Version": 1,
	"VersionName": "1.0.0",
	"FriendlyName": "SimpleSSHTunnel",
	"Description": "A lightweight SSH tunnel plugin for Unreal Engine, developed by mengzhishanghun. Free to use in commercial projects. Redistribution or resale is not allowed.",
	"Category": "Networking",
	"CreatedBy": "mengzhishanghun",
	"DocsURL": "See Docs/README.md included in plugin folder.",
	"FabURL": "com.epicgames.launcher://ue/Fab/5a9111a1-2699-4ba9-bb00-7cb34a9f0ef7/",
	"CanContainContent": false,
	"IsBetaVersion": false,
	"Installed": true,
	"SupportedTargetPlatforms": [ 
		"Win64"
	],
	"Modules": [
		{
			"Name": "SimpleSSHTunnel",
			"Type": "Runtime",
			"LoadingPhase": "Default",
			"PlatformAllowList": [ 
				"Win64"
			]
		}
	]
}
```

# 上传前必须的准备

## 删除可生成文件夹
通常情况下需要删除Binaries，Intermediate等能自己生成的文件夹
## 纯蓝图项目编译
必须让插件在纯蓝图项目中可以自己编译，否则需要提交Binaries且在.uplugin中设置```
```
"Installed": true
```

## 编写Config/FilterPlugin.ini

如果有需要包含的其他文件，放置到一个文件夹中，并且需要在Config/FilterPlugin.ini中说明，如下```
```
[FilterPlugin]

Docs/...

ThirdParty/...

README.md
```
这里我将LICENSE.md（许可证），README.md（插件教程）,CHANGLOG.md（更新日志）都放置在Docs文件夹中，将第三方库相关文件都放置在ThirdParty，以及再加上根目录的README.md

## .uplugin文件注意事项

### 限定平台
```
"SupportedTargetPlatforms": [
		"Win64"
	],
```
这里是告诉Fab我的插件只能在哪些平台上打包，否则可能出现审核不通过的原因

### 指定文档
```
"DocsURL": "See Docs/README.md included in plugin folder.",
```
如果没有在线文档就像这样写，需要指定插件中的文档，这条必须加上不然审核不通过

### 添加FabURL
```
	"MarketplaceURL": "com.epicgames.launcher://ue/Fab/5a9111a1-2699-4ba9-bb00-7cb34a9f0ef7/",
	"FabURL": "com.epicgames.launcher://ue/Fab/5a9111a1-2699-4ba9-bb00-7cb34a9f0ef7/",
```
这里是两个版本的URL，现在Fab的打包测试脚本有问题，在UBT后会将FabURL忽略，只保留MarketplaceURL，但是Fab审核必须要有FabURL，所以目前只能自己手动添加，我还保留MarketplaceURL的原因是为了方便复制修改

