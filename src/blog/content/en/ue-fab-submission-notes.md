---
title: "Fab submission notes: review the package and instructions together"
description: A feature working in the development project does not prove that a delivery package can be installed and reproduced. These notes distill past Unreal p
type: blog
slug: ue-fab-submission-notes
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: Published
featured: false
date: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: en
translationKey: ue-fab-submission-notes
publishedAt: 2026-10-13
sourceHash: 06ee03a174d2300633bb5f6ebcd1b82b127c7bd552647e9185959f1f115bc60f
generatedBodyHash: 458b387abdafb4df331422ca7b108d931a0718e63ac4cbbd7172c74b47213a4b
translationStatus: translated
---

Notes on Submitting to Fab
===

# Plugin Structure Template
Through testing, I have put together a plugin structure template that works best for me.
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
## Purpose of README.md in the Root Directory
It serves both as the introduction displayed in the GitHub repository and as the plugin description. When submitting to Fab, copy it into the product description, keeping it within 1,900 characters.

# Example .uplugin File
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

# Required Preparations Before Submission

## Delete Regenerable Folders
Usually, you need to delete folders that can be generated again, such as Binaries and Intermediate.
## Compilation in Blueprint-Only Projects
The plugin must be able to compile itself in a Blueprint-only project. Otherwise, you need to include Binaries and set the following in .uplugin:```
```
"Installed": true
```

## Write Config/FilterPlugin.ini

If other files need to be included, place them in a folder and specify them in Config/FilterPlugin.ini, as follows:```
```
[FilterPlugin]

Docs/...

ThirdParty/...

README.md
```
Here, I put LICENSE.md (license), README.md (plugin tutorial), and CHANGLOG.md (changelog) in the Docs folder, all third-party library files in ThirdParty, and also include README.md from the root directory.

## Notes on the .uplugin File

### Restrict Platforms
```
"SupportedTargetPlatforms": [
		"Win64"
	],
```
This tells Fab which platforms my plugin can be packaged for. Otherwise, the submission may fail review.

### Specify Documentation
```
"DocsURL": "See Docs/README.md included in plugin folder.",
```
If there is no online documentation, write it like this to specify documentation within the plugin. This entry is required; otherwise, the submission will fail review.

### Add FabURL
```
	"MarketplaceURL": "com.epicgames.launcher://ue/Fab/5a9111a1-2699-4ba9-bb00-7cb34a9f0ef7/",
	"FabURL": "com.epicgames.launcher://ue/Fab/5a9111a1-2699-4ba9-bb00-7cb34a9f0ef7/",
```
These are two versions of the URL. Fab's current packaging test script has a problem: after UBT, it ignores FabURL and only retains MarketplaceURL. However, Fab review requires FabURL, so for now I can only add it manually. I also retain MarketplaceURL to make copying and editing easier.
