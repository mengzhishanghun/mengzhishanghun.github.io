---
title: "Saving Unreal editor assets: checkout, dirty state and results"
description: "An automation tool may change an asset without updating its file. Possible causes include a clean package, an incorrect target path or source-control "
type: blog
slug: ue-editor-asset-saving
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
translationKey: ue-editor-asset-saving
publishedAt: 2026-10-13
sourceHash: "b5dc2a4afbcdd6586370f4270b2d7f24ec84fd86379428346231c1b4df3e9323"
generatedBodyHash: 3049ef36c2b5044b925341194c62e32e50621beb1a56bc35ae8c1ce3962e86b3
translationStatus: translated
websiteCoverUrl: "/media/covers/blog/ue-editor-asset-saving-20261101.webp"
coverAlt: "Saving Unreal editor assets: checkout, dirty state and results cover"
---

Asset Saving
===

# Introduction


Automatic saving of custom assets

Before saving, the read-only status of read-only files is removed. Designed for Perforce to prevent crashes caused by assets being unwritable

# Implementation

```C++
UFUNCTION(BlueprintCallable)  
static bool SaveLoadedAsset(UObject* AssetObject, FString AssetPath);
```

```C++
bool UMyBlueprintFunctionLibrary::SaveLoadedAsset(UObject* AssetObject, FString AssetPath)
{
	if(!AssetObject || AssetPath.IsEmpty())return false;
	UPackage* Package = AssetObject->GetPackage();
	if(!Package)
	{
		Package = CreatePackage(*AssetPath);	
	}
	
	if(Package)
	{
		Package->FullyLoad();
		Package->SetDirtyFlag(true);
		FAssetRegistryModule::AssetCreated(AssetObject);
		const FString PackageFileName = FPackageName::LongPackageNameToFilename(Package->GetPathName(), FPackageName::GetAssetPackageExtension());
		IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();
		PlatformFile.SetReadOnly(*PackageFileName, false);
		FSavePackageArgs SavePackageArgs;
		return UPackage::SavePackage(Package, AssetObject, *PackageFileName, SavePackageArgs);
	}
	
	return false;
}
```
