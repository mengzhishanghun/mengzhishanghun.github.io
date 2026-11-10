---
title: 批量拆开 Level Instance：范围明确，失败就停
description: 用 C++ 批量拆开场景中的 Level Instance，包括拆开后出现的嵌套实例，并分析循环退出条件。
type: blog
slug: ue-level-instance-break-safety
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
coverAlt: 批量拆开 Level Instance：范围明确，失败就停封面
websiteCoverUrl: /media/covers/blog/ue-level-instance-break-safety-20261101.webp
lang: zh
translationKey: ue-level-instance-break-safety
---

破坏所有LevelInstance
===

# 简介

这个函数用来递归破坏场景内的所有LevelInstance

# 实现

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


