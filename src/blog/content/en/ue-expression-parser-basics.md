---
title: Exploring syntax parsing for game formulas in UE
description: Exploring a UE C++ parser for game-event formulas, from arithmetic, conditions, and custom attributes to string validation, tokenization, attribute substitution, and evaluation by precedence.
type: blog
slug: ue-expression-parser-basics
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
translationKey: ue-expression-parser-basics
publishedAt: 2026-10-13
sourceHash: aabf23cc97995d9e1ec43e1e370870c1a54a2e269750d57ae5e19b16faf51abc
generatedBodyHash: 5b93e4544481df519a226b7adc37b019c4d3c23bbf12b356145b5d6b3a3fce6e
translationStatus: translated
---

Simple Formula Parsing for Events
===

# Definition
This is a simple parser I wrote for my game. I have copied it here in case I need it later.

The parser recognizes comparisons, logical AND/OR, addition, subtraction, multiplication, division, parentheses, and the ternary operator.

To meet the game's needs, I also added recognition and substitution of custom attributes.

# Implementation

## .h
```C++
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
The base class in this header is one I created in my game, so it needs to be changed.
Only two simple interfaces are provided here: one checks whether the string is valid and returns a bool and an error message; the other obtains the value of the string.
The entire implementation is in the .cpp file. Since it was all written specifically for this feature, I put everything in .cpp for encapsulation.
## .cpp
```C++
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

# Test
## [HHHH]>=+3-5
Result: 1
