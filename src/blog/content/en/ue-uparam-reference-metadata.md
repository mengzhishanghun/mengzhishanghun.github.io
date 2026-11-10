---
title: "Unreal Blueprint parameters: references and display names"
description: "Complete declaration examples for Blueprint reference parameters, display names, abstract-class selection, interface constraints and passing Lambdas to TFunctionRef."
type: blog
slug: ue-uparam-reference-metadata
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
translationKey: ue-uparam-reference-metadata
publishedAt: 2026-10-13
sourceHash: "6e5bc0eb65051833c033af10bd0954267dc9f1eb86d9afee48efe602a7f8cd83"
generatedBodyHash: "1676ef8a5bc5ba4065e087ee9aed773a7911eece2b0cbdb81a3836fbd651c00f"
translationStatus: translated
websiteCoverUrl: "/media/covers/blog/ue-uparam-reference-metadata-20261101.webp"
coverAlt: "Unreal Blueprint parameters: references and display names cover"
---

Less Common Function Parameters
===

# Blueprint Parameter References
```C++
UFUNCTION(BlueprintCallable)
static void DoSomething(UPARAM(ref) TArray<int> &InOutArray);
```

By declaring a reference parameter with UPARAM(ref) in a function, you can pass a reference to a Blueprint object and modify it in C++.
The UPARAM parameter must be in the first parameter position.

# Rename Blueprint Parameters

```C++
UFUNCTION(BlueprintCallable)
void MakeDog(
  UPARAM(DisplayName = "Years (dog years)") float Years,
  UPARAM(DisplayName = "Fur Color") FLinearColor Color);
```

# Allow Abstract Values as Input
```C++
UFUNCTION(BlueprintCallable, Category = "Composure", meta = (DeterminesOutputType = "OutputType"))
UCompositingElementOutput* FindOutputPass(UPARAM(meta = (AllowAbstract = "true"))TSubclassOf<UCompositingElementOutput> OutputType, FName OptionalPassName = NAME_None);
```

# Class Restrictions
```C++
UFUNCTION(unreliable, client, BlueprintCallable, Category="Game|Feedback")
void ClientSpawnGenericCameraLensEffect(UPARAM(meta=(MustImplement ="CameraLensEffectInterface")) TSubclassOf<class AActor>  LensEffectEmitterClass);
```
# Passing Lambda Functions
Example
```C++
void FXvpInputActionSet::ForEachAction(const TFunctionRef<void(FXvpInputActionBase*)>& Fn)
	{
	for (auto Property = GetStructType()->PropertyLink; Property; Property = Property->PropertyLinkNext)
		{
			if (const auto StructProperty = CastField<FStructProperty>(Property))
			{
			const auto ActionPtr = StructProperty->ContainerPtrToValuePtr<FXvpInputActionBase>(this);
				Fn(ActionPtr);
			}
		}
	}
```
