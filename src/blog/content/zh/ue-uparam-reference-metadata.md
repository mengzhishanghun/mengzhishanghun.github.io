---
title: UE 蓝图函数参数：引用方向与显示名称
description: UE C++ 的引用参数在蓝图节点上不一定呈现为预期的输入引脚。声明类型、`const` 和参数元数据共同影响节点表现。以下示例用于 UE5 的反射函数声明，未在引擎中编译。
type: blog
slug: ue-uparam-reference-metadata
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
translationKey: ue-uparam-reference-metadata
---

不常见的函数参数
===

# 蓝图参数引用
```C++
UFUNCTION(BlueprintCallable)
static void DoSomething(UPARAM(ref) TArray<int> &InOutArray);
```

可以通过在函数中声明引用参数，UPARAM(ref) 来传送蓝图对象的引用，并且在C++中修改
UPARAM参数 必须放在第一个参数位置

# 重命名蓝图参数

```C++
UFUNCTION(BlueprintCallable)
void MakeDog(
  UPARAM(DisplayName = "Years (dog years)") float Years,
  UPARAM(DisplayName = "Fur Color") FLinearColor Color);
```

# 允许传入抽象值
```C++
UFUNCTION(BlueprintCallable, Category = "Composure", meta = (DeterminesOutputType = "OutputType"))
UCompositingElementOutput* FindOutputPass(UPARAM(meta = (AllowAbstract = "true"))TSubclassOf<UCompositingElementOutput> OutputType, FName OptionalPassName = NAME_None);
```

# 类限制
```C++
UFUNCTION(unreliable, client, BlueprintCallable, Category="Game|Feedback")
void ClientSpawnGenericCameraLensEffect(UPARAM(meta=(MustImplement ="CameraLensEffectInterface")) TSubclassOf<class AActor>  LensEffectEmitterClass);
```
# Lambda函数传递
示列
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