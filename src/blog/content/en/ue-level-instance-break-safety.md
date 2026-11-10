---
title: "Breaking Level Instances in batches: bound the work and stop on failure"
description: "Break Level Instances in a scene with C++, including nested instances exposed during the process, and examine the loop's exit conditions."
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
sourceHash: "24db9d75aa1f4f15fdda454d7aed48ebf50de39d1ad4dbf234844c25f4dc240a"
generatedBodyHash: "419af752b561a69ac513db660f75df48995cf1838aeabaa27dfb14c7c40fabb3"
translationStatus: translated
websiteCoverUrl: "/media/covers/blog/ue-level-instance-break-safety-20261101.webp"
coverAlt: "Breaking Level Instances in batches: bound the work and stop on failure cover"
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
