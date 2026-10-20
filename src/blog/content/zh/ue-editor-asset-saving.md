---
title: UE 编辑器资产保存：签出、脏标记与保存结果
description: 自动化工具修改了资产，磁盘文件却未更新，常见原因包括包未标脏、目标路径错误或版本控制阻止写入。本文限于 UE5 编辑器资产保存；不把编辑器 API 当成游戏运行时的通用存档方案。
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
