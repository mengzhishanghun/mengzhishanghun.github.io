---
title: UE 编辑器资产保存：签出、脏标记与保存结果
description: 给出 SaveLoadedAsset 的完整声明与实现，说明包标脏、路径转换和保存结果，并区分文件只读属性与 Perforce 签出权限。
type: blog
slug: ue-editor-asset-saving
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
coverAlt: UE 编辑器资产保存：签出、脏标记与保存结果封面
websiteCoverUrl: /media/covers/blog/ue-editor-asset-saving-20261101.webp
lang: zh
translationKey: ue-editor-asset-saving
---

资产保存
===

# 简介


自定义资产的自动保存

在保存前回把只读文件的只读状态取消，针对Perforce设计，防止资产因不能写入而崩溃

# 实现

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
