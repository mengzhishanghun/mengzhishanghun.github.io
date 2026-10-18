---
title: 在 UE 中探索游戏公式的语法解析
description: 完整保留原笔记的 UE C++ 公式解析实现、说明与检测记录，补充校验、Token 拆分、游戏属性替换和优先级求值的讲解，并说明原实现的边界与改进方向。
type: blog
slug: ue-expression-parser-basics
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
translationKey: ue-expression-parser-basics
---

# 在 UE 中探索游戏公式的语法解析

游戏事件里有时需要把条件或计算规则写成字符串，再根据当前属性算出结果。这篇文章从我给自己游戏写的一个简单解析器出发，探索在 UE C++ 中怎样处理这样的公式。

下面保留原笔记的全部代码、原有说明和检测记录，补充各步骤的用途。源文件按职责拆成几段，代码顺序和内容保持原样；它仍是一份带有项目依赖和待完善之处的探索记录。

## 定义与使用场景

这个是给我的游戏写的一个简单解析，摘抄到这里以防不时之需

该解析可以识别判断，逻辑与或，加减乘除，括号和三目运算符

为了适配游戏需求，还额外添加了自定义属性的识别和替换

例如，想让一个事件只在力量和金币都达到要求时触发，可以约定这样的写法：

```text
[力量] >= 10 && [金币] >= 100
```

`[力量]`、`[金币]` 表示游戏属性，比较运算得到真假，再由 `&&` 合并条件。也可以用三目运算选择数值：

```text
[力量] >= 10 ? 100 : 50
```

这两个例子说明想支持的语法。实际解析器需要先读懂文本，再由游戏提供属性值，最后计算结果。原代码中的属性映射是固定的演示数据，还需要按项目情况接入角色或事件上下文。

这份实现的处理思路是：统一部分中文标点，校验字符串，拆分 Token，替换属性，再按优先级求值。结果使用 `int32`，比较与逻辑运算的真假以 1 和 0 表示。

## 实现：头文件与 UE 接口

**.h**

```cpp
// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Core/MyGameSubsystem.h"
#include "MyGameEventSubsystem.generated.h"

/**
 * 
 */
UCLASS()
class LIFESIMULATOR_API UMyGameEventSubsystem : public UMyGameSubsystem
{
	GENERATED_BODY()
	CREATETHISSUBSYSTEM(UMyGameEventSubsystem)
public:
	UFUNCTION(BlueprintCallable)
	static bool CheckStrIsValid(const FString& Str, FString& Error);
	UFUNCTION(BlueprintCallable)
	static int32 GetStrValue(FString const& Str);
};


```

头文件这里的基类是我游戏中新建的，需要修改
这里仅提供了两个简单接口，一个是检测这个字符串是否有效，会返回一个bool和错误信息，一个是获取这个字符串的值
具体实现全都在.cpp里，因为都是专门为了这个功能写的，所以全都放.cpp里来进行封装

`CheckStrIsValid` 对应校验入口，`GetStrValue` 对应求值入口。原来的基类 `UMyGameSubsystem`、`CREATETHISSUBSYSTEM` 宏、导出宏和相关头文件属于原工程，移到其他项目时需要适配。后面的代码也使用了项目日志分类 `MyGameLog`。

## 实现：源文件与解析过程

**.cpp：Token 类型与结构**

计算公式时，需要把 `123` 识别成一个数字，把 `>=` 识别成一个比较符，把 `[HHHH]` 识别成属性引用。这样的片段称为 Token。下面先定义 Token 的分类和保存方式。

```cpp
// Fill out your copyright notice in the Description page of Project Settings.


#include "GameEvent/MyGameEventSubsystem.h"

#include <regex>

#include "LifeSimulator.h"
#include "Misc/AutomationTest.h"

enum class ETokenType : uint8
{
	Number,
	Operator_Add,
	Operator_Mul,
	Parenthesis,
	Comparison,
	Logical_And,
	Logical_Or,
	Operator_Conditional,
	CustomProperty
};

struct FToken {
	ETokenType Type;
	FString Value;

	FToken();
	FToken(const ETokenType InType, const FString& InValue)
		: Type(InType), Value(InValue) {}
};

```

**字符串替换与中文标点转换**

`RegexReplace` 封装正则替换。`ReplaceChinesePunctuationWithEnglish` 按映射把部分中文标点转换成英文符号，为后面的处理统一输入。映射只是替换规则，转换后的符号是否能用于公式，还需要由校验步骤判断。

```cpp
FString RegexReplace(FString const& Str, FString const& Regex, FString const& ReplaceStr)
{
	return 	UTF8_TO_TCHAR(std::regex_replace(std::string(TCHAR_TO_UTF8(*Str)),
		std::regex(std::string(TCHAR_TO_UTF8(*Regex))),
		std::string(TCHAR_TO_UTF8(*ReplaceStr))).c_str());
}

FString ReplaceChinesePunctuationWithEnglish(const FString& Expression) {
	// Define the mappings from Chinese punctuation to English punctuation
	TMap<FString, FString> PunctuationMap = {
		{TEXT("，"), TEXT(",")},
		{TEXT("。"), TEXT(".")},
		{TEXT("！"), TEXT("!")}, 
		{TEXT("？"), TEXT("?")},
		{TEXT("："), TEXT(":")},
		{TEXT("；"), TEXT(";")},
		{TEXT("（"), TEXT("(")},
		{TEXT("）"), TEXT(")")},
		{TEXT("【"), TEXT("[")},
		{TEXT("】"), TEXT("]")},
		{TEXT("“"), TEXT("\"")},
		{TEXT("”"), TEXT("\"")},
		{TEXT("‘"), TEXT("'")},
		{TEXT("’"), TEXT("'")},
		{TEXT("《"), TEXT("<")},
		{TEXT("》"), TEXT(">")},
		{TEXT("「"), TEXT("[")},
		{TEXT("」"), TEXT("]")},
		{TEXT("『"), TEXT("[")},
		{TEXT("』"), TEXT("]")},
		{TEXT("、"), TEXT(",")},
		{TEXT("﹃"), TEXT("{")},
		{TEXT("﹄"), TEXT("}")},
		{TEXT("〔"), TEXT("[")},
		{TEXT("〕"), TEXT("]")},
		{TEXT("——"), TEXT("-")},
		{TEXT("……"), TEXT("...")},
		{TEXT("—"), TEXT("-")},
		{TEXT("·"), TEXT(".")},
		{TEXT("（"), TEXT("(")},
		{TEXT("）"), TEXT(")")}
	};

	FString Result = Expression;

	// Replace each Chinese punctuation with the corresponding English punctuation
	for (const auto& Elem : PunctuationMap) {
		Result = RegexReplace(Result, Elem.Key, Elem.Value);
	}

	return Result;
}

```

**校验公式字符串**

`IsValidExpression` 先移除空白，再检查属性引用格式。为了检查属性以外的表达式，它临时把属性引用替换为 `0`，然后用一组正则排除非法字符和符号组合，并检查括号与三目符号的配对关系。下面保留全部校验规则和错误信息。

```cpp
bool IsValidExpression(const FString& Expression, FString& ErrorMessage)
{
	FString CheckStr = Expression;

	// 去除空格以及换行等空白符号以简化正则表达式
	CheckStr = RegexReplace(CheckStr, TEXT(R"(\s)"), TEXT(""));
	
	// 自定义属性格式应为 [属性名]
	for (TArray<TPair<FString, FString>> InvalidPatterns = {
		{TEXT(R"(\[\])"), TEXT("属性名不能为空")},
		{TEXT(R"([\d)]\[|\][\d\(])"), TEXT("中括号的两边不能相邻数字或不同边括号")}, 
		{TEXT(R"(\]\[)"), TEXT("不允许连续的自定义属性")} 
	}; const auto& Pattern : InvalidPatterns) {
		FRegexPattern RegexPattern(Pattern.Key);
		FRegexMatcher Matcher(RegexPattern, CheckStr);
		if (Matcher.FindNext()) {
			ErrorMessage = Pattern.Value;
			return false;
		}
	}

	{// 检测[]是否成对出现
		int32 Count = 0;
		for (TCHAR Ch : CheckStr) {
			if (Ch == '[') {
				++Count;
			} else if (Ch == ']') {
				--Count;
			}

			if(Count < 0)
			{
				ErrorMessage = TEXT("]不匹配");
				return false;	
			}
			else if (Count > 1)
			{
				ErrorMessage = TEXT("[]不能嵌套");
				return false;		
			}
		}

		if(Count != 0)
		{
			ErrorMessage = TEXT("[不匹配");
			return false;		
		}
	}

	// 替换自定义属性，方便后续判断
	CheckStr = RegexReplace(CheckStr, TEXT(R"(\[.*?\])"), TEXT("0"));
	
    // 无效表达式的正则表达式模式及其错误信息
    for (TArray<TPair<FString, FString>> InvalidPatterns = {
    	{TEXT(R"([^0-9\+\-\*\/\(\)<>!=&|?:])"), TEXT("除了自定义属性外只能存在比较运算符、括号、数字、三目运算符、逻辑与或运算符和加减乘除运算符")},

    	// 括号判断
		{TEXT(R"(\(\))"), TEXT("包含空括号")},
		{TEXT(R"([0-9\)]\(|\)[\(0-9])"), TEXT("括号不能与数字和不同边括号相邻")},
    	
    	// 加减乘除判断
    	{TEXT(R"([\*\/]{2,})"), TEXT("不能有连续的乘除运算符")},
    	{TEXT(R"([\+\-]{3,})"), TEXT("不能有三个或更多连续加减运算符")},
    	{TEXT(R"([\+\-][\*\/])"), TEXT("加减后不能接乘除运算符")},
		{TEXT(R"([^0-9][\+\-]{2,})"), TEXT("两个加减号前只能是数字")},
    	{TEXT(R"([^0-9\)\*\/][\*\/])"), TEXT("乘除左边只能是数字和后括号")},
    	{TEXT(R"([\+\-\*\/][^0-9\(\+\-])"), TEXT("加减乘除右边只能是数字和前括号")},

    	// 逻辑运算符判定
		{TEXT(R"([^&\|][&\|][^&\|]|[&\|]{3,})"), TEXT("逻辑运算符错误")},
		{TEXT(R"(&&[^0-9\(-]|[^0-9\(\)]&&)"), TEXT("逻辑运算符&&前后必须是数字或括号")},
		{TEXT(R"(\|\|[^0-9\(\)-]|[^0-9\(\)-]\|\|)"),TEXT("逻辑运算符||前后必须是数字或括号")},
    	
    	// 比较操作符判定
    	{TEXT(R"([^=!><]=[^=])"), TEXT("不能使用赋值语句")},
		{TEXT(R"([!<>][!<>])"), TEXT("!<>不能搭配使用")},
		{TEXT(R"([!<>=]{3,})"), TEXT("比较操作符过多")},
		{TEXT(R"(![^=])"), TEXT("!不能单独使用")},
		{TEXT(R"(=[!<>])"), TEXT("比较操作符错误")},
		{TEXT(R"([^0-9\)][!<>]|[^0-9\)]==|[<>=][^\-\+=\(0-9])"), TEXT("比较操作符的错误结合")},	
    	
    	// 三目运算符判定
		{TEXT(R"([\?:][\?:])"), TEXT("三目运算符不能连续")},	
		{TEXT(R"([^0-9\)][\?:]|[\?:][^\-\+\(0-9])"), TEXT("三目运算符前后符号错误")},
    }; const auto& Pattern : InvalidPatterns) {
        FRegexPattern RegexPattern(Pattern.Key);
        FRegexMatcher Matcher(RegexPattern, CheckStr);
        if (Matcher.FindNext()) {
            ErrorMessage = Pattern.Value + FString::Printf(TEXT("	请检查:%s"), *Matcher.GetCaptureGroup(0));
            return false;
        }
    }

	{// 额外检查括号是否成对出现
		int32 Count = 0;
		for (TCHAR Ch : CheckStr) {
			if (Ch == '(') {
				++Count;
			} else if (Ch == ')') {
				--Count;
			}

			if(Count < 0)
			{
				ErrorMessage = TEXT(")不匹配");
				return false;	
			}
		}

		if (Count != 0) {
			ErrorMessage = TEXT("(不匹配");
			return false;
		}
	}

	{// 检测三目运算符拆分
		int32 Count = 0;
		int32 Depth = 0;
		for (const TCHAR Ch : CheckStr)
		{
			if(Ch == '?')
			{
				if(Depth < Count)
				{
					ErrorMessage = TEXT("被嵌套的三目运算符必须用括号包裹");
					return false;		
				}
				++Count;
			}
			else if(Ch == ':')
			{
				--Count;
				if(Count < 0)
				{
					ErrorMessage = TEXT("三目运算符:前面必须有?");
					return false;	
				}
			}
			else if(Ch == '(')
			{
				++Depth;
			}
			else if(Ch == ')')
			{
				--Depth;
				if(Count != 0)
				{
					ErrorMessage = TEXT("三目运算符不能被拆分");
					return false;		
				}
			}
		}

		if(Count != 0)
		{
			ErrorMessage = TEXT("三目运算符必须成对出现");
			return false;	
		}
	}

    return true;;
}

```

这种写法把校验规则集中在一起，便于对照阅读。不过，排除已知错误的模式不等于定义了完整语法，求值时仍然需要检查操作数和结构。

**把公式拆成 Token**

`Tokenize` 按字符扫描字符串，识别括号、运算符和属性名，并把连续数字合并。它还尝试根据前一个 Token 判断正负号的含义：一元正号不作为加法保留，一元负号转换为乘以 `-1`。

```cpp
TArray<FToken> Tokenize(const FString& Expression)
{
	FString CheckStr = RegexReplace(Expression, TEXT(R"(\s)"), TEXT(""));
	TArray<FToken> Tokens;
	for (int32 i = 0; i < CheckStr.Len(); ++i)
	{
		TCHAR Ch = CheckStr[i];
		if (Ch == '(' || Ch == ')')
		{
			Tokens.Emplace(ETokenType::Parenthesis, FString(1, &Ch));
		}
		else if (Ch == '+' || Ch == '-')
		{
			if(const FToken& Token = Tokens.Last();
				(Token.Type == ETokenType::Parenthesis && Token.Value == "(")
				|| Token.Type == ETokenType::Operator_Add
				|| Token.Type == ETokenType::Operator_Mul
				|| Token.Type == ETokenType::Comparison)
			{
				if(Ch == '-')
				{
					Tokens.Emplace(ETokenType::Number, "-1");	
					Tokens.Emplace(ETokenType::Operator_Mul, "*");	
				}
			}
			else
			{
				Tokens.Emplace(ETokenType::Operator_Add, FString(1, &Ch));		
			}
		}
		else if(Ch == '*' || Ch == '/')
		{
			Tokens.Emplace(ETokenType::Operator_Mul, FString(1, &Ch)); 
		}
		else if (Ch == '=' || Ch == '!' || Ch == '>' || Ch == '<')
		{
			FString Comparison(1, &Ch);
			if (i + 1 < CheckStr.Len() && CheckStr[i + 1] == '=') {
				Comparison += '=';
				++i;
			}
			Tokens.Emplace(ETokenType::Comparison, Comparison);
		}
		else if (Ch == '&' && i + 1 < CheckStr.Len() && CheckStr[i + 1] == '&')
		{
			Tokens.Emplace(ETokenType::Logical_And, TEXT("&&"));
			++i;
		}
		else if (Ch == '|' && i + 1 < CheckStr.Len() && CheckStr[i + 1] == '|')
		{
			Tokens.Emplace(ETokenType::Logical_Or, TEXT("||"));
			++i;
		}
		else if (Ch == '?' || Ch == ':')
		{
			Tokens.Emplace(ETokenType::Operator_Conditional, FString(1, &Ch));
		}
		else if (Ch == '[')
		{
			++i;
			FString CustomProperty;
			while (i < CheckStr.Len() && CheckStr[i] != ']') {
				CustomProperty += CheckStr[i];
				++i;
			}
			Tokens.Emplace(ETokenType::CustomProperty, CustomProperty);
		}
		else
		{
			if(Tokens.Last().Type != ETokenType::Number)
			{
				Tokens.Emplace(ETokenType::Number, FString(1, &Ch));
			}
			else
			{
				Tokens.Last().Value.Append(FString(1, &Ch));
			}
		}
	}
	return Tokens;
}

```

例如 `[HHHH]>=+3-5` 的分词意图是识别属性 `HHHH`、比较符 `>=`、数字 `3`、减号和数字 `5`。这里的 `+3` 表示正数，并不是缺少左操作数的加法。

**运算符分类与单步计算**

`CheckPrecedence` 判断运算符是否属于当前要处理的类别，实际的优先级顺序由后面的 `Evaluate` 决定。`ApplyOperator` 接收两个整数和运算符，完成一次计算；整数除法采用 C++ 整数除法规则，比较和逻辑运算返回 1 或 0。

```cpp
bool CheckPrecedence(const ETokenType& Precedence, const FString& Op) {
	switch (Precedence) {
	case ETokenType::Operator_Add:
		return Op == "+" || Op == "-";
	case ETokenType::Operator_Mul:
		return Op == "*" || Op == "/";
	case ETokenType::Comparison:
		return Op == ">" || Op == "<" || Op == ">=" || Op == "<=" || Op == "==" || Op == "!=";
	case ETokenType::Logical_And:
		return Op == "&&";
	case ETokenType::Logical_Or:
		return Op == "||";
	default: 
		return false;
	}
}

int32 ApplyOperator(const int32 A, const int32 B, const FString& Op)
{
	if (Op == "+") return A + B;
	if (Op == "-") return A - B;
	if (Op == "*") return A * B;
	if (Op == "/") return B == 0 ? 0 : A / B;
	if (Op == "==") return A == B;
	if (Op == "!=") return A != B;
	if (Op == ">") return A > B;
	if (Op == "<") return A < B;
	if (Op == ">=") return A >= B;
	if (Op == "<=") return A <= B;
	if (Op == "&&") return A && B;
	if (Op == "||") return A || B;
	// 错误处理
	UE_LOG(MyGameLog, Error, TEXT("Invalid operator"));
	return 0;
}

```

原实现遇到除零会返回 0，遇到无法识别的运算符会写日志并返回 0。这是当前代码的行为，调用方不能仅凭结果为 0 判断是否出错。

**按括号和优先级归约公式**

`Evaluate` 先找括号，将括号内部递归求值，再把相应片段替换成数字。随后依次处理乘除、加减、比较、逻辑与、逻辑或，最后处理三目选择。

```cpp
int32 Evaluate(const TArray<FToken>& Tokens) {
	
	TArray<FToken> HandleTokens = Tokens;
	{
		// 先找出括号，直接用递归处理,将所有括号都转变为数字
		int32 Index = 0;
		while (Index < HandleTokens.Num())
		{
			if(HandleTokens[Index].Type == ETokenType::Parenthesis && HandleTokens[Index].Value == ")")
			{
				for(int32 i = Index - 1; i >= 0; --i)
				{
					if(HandleTokens[i].Type == ETokenType::Parenthesis && HandleTokens[i].Value == "(")
					{
						TArray<FToken> Parenthesis;
						for(int32 j = i + 1; j < Index; ++j)
						{
							Parenthesis.Emplace(HandleTokens[j]);	
						}
						HandleTokens.RemoveAtSwap(i, Index - i);
						Index = i;
						HandleTokens[Index].Type = ETokenType::Number;
						HandleTokens[Index].Value = FString::FromInt(Evaluate(Parenthesis));
						break;
					}
				}
			}
			++Index;
		}
	}

	auto f = [&](ETokenType const TokenType)
	{
		int32 Index = 0;
		while (Index < HandleTokens.Num())
		{
			if(HandleTokens[Index].Type == TokenType && CheckPrecedence(TokenType, HandleTokens[Index].Value))
			{
				
				HandleTokens[Index + 1].Value = FString::FromInt(ApplyOperator(FCString::Atoi(*HandleTokens[Index - 1].Value),
					FCString::Atoi(*HandleTokens[Index + 1].Value),
					HandleTokens[Index].Value));
				HandleTokens[Index].Type = ETokenType::Number;
				HandleTokens.RemoveAt(Index - 1, 2);
				--Index; 	
			}
			++Index;
		}	
	};

	f(ETokenType::Operator_Mul);
	f(ETokenType::Operator_Add);
	f(ETokenType::Comparison);
	f(ETokenType::Logical_And);
	f(ETokenType::Logical_Or);

	{// 最后处理三目运算
		if(HandleTokens.Num() == 5)
		{
			return FCString::Atoi(*HandleTokens[0].Value) 
			? FCString::Atoi(*HandleTokens[2].Value)
			: FCString::Atoi(*HandleTokens[4].Value);
		}
	}
    
	return HandleTokens.Num() ? FCString::Atoi(*HandleTokens[0].Value) : 0;
}

```

这段代码想表达的求值顺序，可以用下面两条公式说明：

```text
1 + 2 * 3      → 先算 2 * 3，再加 1，预期结果为 7
(1 + 2) * 3    → 先算括号里的 1 + 2，再乘 3，预期结果为 9
```

这些是语义示例，并非本次运行代码得到的测试结果。同级运算也需要保持顺序，例如 `8 / 2 / 2` 按从左到右计算应得到 2。

**校验入口、属性替换与求值入口**

最后回到蓝图可以调用的两个函数。校验入口先转换标点，再校验字符串；求值入口先分词，再把属性 Token 转为数字，交给 `Evaluate`。

```cpp
bool UMyGameEventSubsystem::CheckStrIsValid(const FString& Str, FString& Error)
{
	return IsValidExpression(ReplaceChinesePunctuationWithEnglish(Str), Error);
}

int32 UMyGameEventSubsystem::GetStrValue(FString const& Str)
{
	const TMap<FString, int32> CustomProperties = {
		{TEXT("123"), 123},
		{TEXT("HHHH"), 555}, 
	};
	
	TArray<FToken> Tokens = Tokenize(ReplaceChinesePunctuationWithEnglish(Str));
	for(auto& It : Tokens)
	{
		if(It.Type == ETokenType::CustomProperty)
		{
			It.Type = ETokenType::Number;
			It.Value = FString::FromInt(CustomProperties.Contains(It.Value) ? CustomProperties[It.Value] : 0);
		}
	}
	return Evaluate(Tokens);
}

```

这里的固定 `TMap` 只演示属性名如何变为数值。实际游戏中，可以由当前角色或事件提供对应属性。原代码把未知属性当作 0，这也意味着拼错属性名可能被当作正常数值参与计算。

## 检测

**[HHHH]>=+3-5**

结果：1

这是原笔记保存的检测记录。示例映射里 `HHHH` 为 555，公式按预期语义相当于 `555 >= (3 - 5)`，所以结果为 1。本次只整理文章，没有重新编译或运行原 UE 工程。

## 阅读代码时的边界与改进方向

以上保留的是原实现，下面是结合代码补充的阅读说明。要继续完善这个解析器，需要分别处理这些问题。

**首次读取 Token 的边界。** `Tokenize` 在处理正负号和普通数字时使用 `Tokens.Last()`，但遇到第一个数字或开头的正负号时，数组可能为空。需要先判断是否存在前一个 Token，再决定当前字符的含义。

**公式顺序。** 括号归约使用了 `RemoveAtSwap`，它不保证剩余元素的顺序。公式依赖顺序，应改用保序处理，或通过解析位置消费 Token。求值时访问左右操作数，也需要确认索引和操作数类型有效。

**校验与求值的关系。** `GetStrValue` 没有先调用 `CheckStrIsValid`。调用方应先校验输入，但求值器也不能只依赖外部校验：空输入、未知字符、缺少操作数和不完整的三目表达式，都需要明确的处理方式。

**短路与分支。** 当前实现先计算运算，再选择三目结果，不能假定它具有 C++ 的短路语义。例如 `[数量] != 0 && 100 / [数量] > 2`，如果约定短路，在数量为 0 时应跳过右侧求值；三目也应只计算选中的分支。这要求解析过程保留分支结构。

**结果与错误。** 除零、未知属性和部分错误都会得到 0，而 0 也是合法结果。后续接口应区分求值是否成功、结果值和错误信息。整数溢出、输入长度、嵌套深度，以及嵌套三目的合法写法也需要明确规则。

继续探索时，可以保留 UE 的字符串和蓝图调用入口，让解析部分按明确语法读取 Token，再由游戏上下文提供属性。递归下降等方法可以把不同优先级交给不同的解析函数；如果要支持短路，还需要在完成语法检查的同时，控制哪些分支真正执行计算。
