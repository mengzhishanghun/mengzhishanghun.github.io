---
title: UE DataTable 与 JSON：先验证，再替换
description: 文件夹中的 JSON 行可以汇成 DataTable，但“先清空表再逐文件解析”会在中途失败时丢失旧数据。适用于 UE5 C++ 的编辑器导入工具；运行时修改内存表与保存编辑器资产是两件事。下面给出流程和生命周期片段，未编译为完整工具。
type: blog
slug: ue-datatable-json-import-export
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
translationKey: ue-datatable-json-import-export
---

Json导入导出DataTable
===

# Json文件夹导入DataTable
```C++
	DataTable->EmptyTable();
    TArray<FString> JsonFiles;
    IFileManager::Get().FindFilesRecursive(JsonFiles, *JsonFolderPath, TEXT("*.json"), true, false, true);
    for(const auto JsonFilePath : JsonFiles)
    {
        FString JsonFileString;
        FFileHelper::LoadFileToString(JsonFileString, *JsonFilePath);
        const TSharedRef<TJsonReader<>> JsonReader = TJsonReaderFactory<>::Create(JsonFileString);
        TSharedPtr<FJsonObject> JsonObject;
        FJsonSerializer::Deserialize(JsonReader, JsonObject);
        if(JsonObject.IsValid() == false)
        {
            UE_LOG(DataTableDynamicSync, Error, TEXT("Failed to read file %s, please check if the Json object is correct"), *JsonFilePath);
            continue;	
        }
        void* RowData = FMemory::Malloc(DataTable->GetRowStruct()->GetStructureSize());
        FJsonObjectConverter::JsonObjectToUStruct(JsonObject.ToSharedRef(), DataTable->GetRowStruct(), RowData);	
        DataTable->AddRow(FName(JsonFilePath.RightChop(JsonFolderPath.Len()).LeftChop(5)), *static_cast<FTableRowBase*>(RowData));
    }
#if WITH_EDITOR
    DataTable->Modify(true);
#endif
    return true;
```
这是完全规避编辑器的写法，可以正常打包使用

# DataTable导出到文件夹
```C++
IFileManager::Get().DeleteDirectory(*JsonFolderPath, true, true);
for(auto const& It : DataTable->GetRowMap())
{
    FString JsonFileString;
    FJsonObjectConverter::UStructToJsonObjectString(DataTable->GetRowStruct(), It.Value, JsonFileString);
    FFileHelper::SaveStringToFile(JsonFileString, *(JsonFolderPath + It.Key.ToString() + TEXT(".json")));	
}
return true
```
同样是完全规避了编辑器，可以正常打包使用