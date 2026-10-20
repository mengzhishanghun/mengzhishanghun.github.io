---
title: 批量拆开 Level Instance：范围明确，失败就停
description: 拆开 Level Instance 可能暴露更多嵌套实例。每轮只要找到实例就继续循环，遇到无法拆开的实例会一直重复。本文仅讨论 UE5 编辑器中的批量展开流程，不能作为运行时操作教程。
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


