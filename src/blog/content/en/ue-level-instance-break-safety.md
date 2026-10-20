---
title: "Breaking Level Instances in batches: bound the work and stop on failure"
description: Breaking a Level Instance may expose nested instances. A loop that continues whenever it finds an instance can repeat forever when one cannot be broke
type: blog
slug: ue-level-instance-break-safety
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
translationKey: ue-level-instance-break-safety
publishedAt: 2026-10-13
sourceHash: 8690940c8d7dc9b6e3cf9b989b3366195192ccb601650cdebe7e23eb22ccb649
generatedBodyHash: 419af752b561a69ac513db660f75df48995cf1838aeabaa27dfb14c7c40fabb3
translationStatus: translated
---

Break All LevelInstances
===

# Introduction

This function recursively breaks all LevelInstances in the scene.

# Implementation

```C++
UFUNCTION(BlueprintCallable, meta=(WorldContext="WorldContextObject", CallableWithoutWorldContext))  
static void BreakAllLevelInstance(UObject* WorldContextObject);
```

```C++
void UMyBlueprintFunctionLibrary::BreakAllLevelInstance(UObject* WorldContextObject)
{
	if(WorldContextObject)
	{
		TArray<AActor*> OutActor;
		bool Stop;
		do
		{
			Stop = true;
			OutActor.Empty();
			UGameplayStatics::GetAllActorsOfClass(WorldContextObject, ALevelInstance::StaticClass(), OutActor);
			for(const auto& It : OutActor)
			{
				if(ILevelInstanceInterface* LevelInstance = Cast<ILevelInstanceInterface>(It))
				{
					if(!LevelInstance || !Cast<AActor>(LevelInstance))continue;
					UE_LOG(LogTemp, Log, TEXT("BreakLevelInstance::%s"), *It->GetPathName());
					WorldContextObject->GetWorld()->GetSubsystem<ULevelInstanceSubsystem>()->BreakLevelInstance(LevelInstance, 1);
					Stop = false;
				}
			}	
		}
		while (!Stop);
	}
}
```
