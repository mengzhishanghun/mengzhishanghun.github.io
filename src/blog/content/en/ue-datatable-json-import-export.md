---
title: "Unreal DataTable and JSON: validate before replacing"
description: "Use C++ to import a folder of JSON files into a DataTable and export each row back to JSON. Covers the implementation and considerations for both directions."
type: blog
slug: ue-datatable-json-import-export
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
translationKey: ue-datatable-json-import-export
publishedAt: 2026-10-13
sourceHash: "8758be2647b0f7834cb99142139c0645bf070d090197fd9dd26b4f7a3ab59758"
generatedBodyHash: "c90bed1d2f46712c2525850c50aa35e007c25e99c9a34882752836aa8469c0a0"
translationStatus: translated
websiteCoverUrl: "/media/covers/blog/ue-datatable-json-import-export-20261101.webp"
coverAlt: "Unreal DataTable and JSON: validate before replacing cover"
---

Importing and Exporting DataTables with Json
===

# Importing a Json Folder into a DataTable
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
This implementation completely avoids the editor and works normally in packaged builds

# Exporting a DataTable to a Folder
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
This likewise completely avoids the editor and works normally in packaged builds
