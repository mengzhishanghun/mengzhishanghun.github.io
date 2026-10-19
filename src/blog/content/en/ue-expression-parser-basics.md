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
sourceHash: 8d4a2b018912d33fe11e7e63dc45d07cdb3623c22e22f2d4213651cf93bd6534
generatedBodyHash: b5b309cca38620f6e661e3dc3d6162f363f8529dc620756b1558301136ef5a1c
translationStatus: translated
---

# Exploring syntax parsing for game formulas in UE

Game events sometimes need conditions or calculations stored as strings, evaluated against current attributes. This article starts with a simple parser I wrote for my own game and explores how to handle such formulas in UE C++.

The parser processes formulas through string validation, tokenization, attribute substitution, and evaluation by precedence. It depends on classes, macros, and logging from the game project, and several edge cases still need work.

## Definition and use cases

I wanted game events to express conditions and calculations as text, so I wrote a simple parser.

The intended syntax covers comparisons, logical AND and OR, arithmetic, parentheses, and ternary expressions.

I also added recognition and substitution of custom properties so formulas can use data from the game.

For example, an event could require both strength and gold to meet a threshold:

```text
[Strength] >= 10 && [Gold] >= 100
```

`[Strength]` and `[Gold]` denote game attributes. Comparisons produce Boolean results, which `&&` combines. A ternary expression could also select a value:

```text
[Strength] >= 10 ? 100 : 50
```

These illustrate the intended syntax. The parser must recognize the text, obtain attribute values from the game, and evaluate the result. The code uses a fixed demonstration map; character or event data still needs to be connected for a real project.

The implementation normalizes selected Chinese punctuation, validates the string, tokenizes it, substitutes attributes, and evaluates by precedence. Results use `int32`, with true and false represented as 1 and 0.

## Implementation: header and UE entry points

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

The header’s base class comes from my game project and needs adapting in another project. Two interfaces are exposed: one checks string validity and returns a bool and an error message; the other evaluates the string. The implementation stays together in the .cpp file to handle formula parsing.

`CheckStrIsValid` is the validation entry point and `GetStrValue` is the evaluation entry point. `UMyGameSubsystem`, `CREATETHISSUBSYSTEM`, the export macro, and project headers require adaptation in another project. The code also uses the game project's `MyGameLog` category.

## Implementation: source file and parsing steps

**.cpp: token types and structure**

Evaluation needs to recognize `123` as one number, `>=` as one comparison operator, and `[HHHH]` as a property reference. These pieces are tokens. The following definitions classify and store them.

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

**String replacement and punctuation normalization**

`RegexReplace` wraps regular-expression replacement. `ReplaceChinesePunctuationWithEnglish` maps selected Chinese punctuation to English symbols to normalize input. These mappings only replace characters; validation still determines which resulting symbols are legal in a formula.

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

**Validating the formula string**

`IsValidExpression` removes whitespace and checks property-reference syntax. It temporarily substitutes `0` for properties when checking the rest of the expression. It then rejects invalid characters and symbol combinations with regular expressions and checks parentheses and ternary punctuation for matching pairs. Each rule has an error message to help identify invalid input.

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

This groups validation rules for inspection. Rejecting known invalid patterns does not define a complete grammar, however; evaluation still needs to check operands and structure.

**Tokenizing the formula**

`Tokenize` scans characters, recognizes parentheses, operators, and property names, and combines consecutive digits. It also attempts to interpret signs using the previous token: unary plus is omitted and unary minus becomes multiplication by `-1`.

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

For `[HHHH]>=+3-5`, the intended tokens are property `HHHH`, comparison `>=`, number `3`, subtraction, and number `5`. Here `+3` denotes a positive number rather than addition with a missing left operand.

**Operator categories and individual calculations**

`CheckPrecedence` determines whether an operator belongs to the category currently being processed. `Evaluate` supplies the actual category order. `ApplyOperator` takes two integers and an operator, then performs one calculation. Integer division follows C++ integer-division rules; comparisons and logical operations return 1 or 0.

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

Division by zero currently returns 0. An unrecognized operator writes a log message and returns 0. Consequently, a zero result alone does not tell the caller whether an error occurred.

**Reducing parentheses and evaluating by precedence**

`Evaluate` finds parentheses, recursively evaluates the enclosed tokens, and replaces the segment with a number. It then processes multiplication and division, addition and subtraction, comparisons, logical AND, logical OR, and finally ternary selection.

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

The intended evaluation order can be illustrated with:

```text
1 + 2 * 3      → evaluate 2 * 3, then add 1; expected result: 7
(1 + 2) * 3    → evaluate 1 + 2 inside parentheses, then multiply by 3; expected result: 9
```

These are examples of intended semantics and have not been verified by running the code. Operators at the same precedence also need preserved order: left-to-right evaluation of `8 / 2 / 2` should yield 2.

**Validation, attribute substitution, and evaluation entry points**

The two Blueprint-callable functions complete the implementation. Validation normalizes punctuation and checks the string. Evaluation tokenizes the input, changes property tokens into numbers, and calls `Evaluate`.

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

The fixed `TMap` demonstrates substituting attribute names with values. A game can supply these values from its current character or event. Unknown attributes currently become 0, so a misspelled name may continue through evaluation as an ordinary value.

## Recorded check

**[HHHH]>=+3-5**

Result: 1

The previously recorded result for this formula is 1. The example map gives `HHHH` a value of 555, so the intended semantics are equivalent to `555 >= (3 - 5)`, consistent with that result. It has not been rechecked by compiling and running the UE project.

## Limitations and directions for improvement

Reading the code reveals several issues to address before taking this parser further.

**The first token.** `Tokenize` uses `Tokens.Last()` for signs and ordinary numbers, but the array may be empty for the first number or a leading sign. It must check whether a previous token exists before using it to interpret a character.

**Expression order.** Parenthesis reduction uses `RemoveAtSwap`, which does not preserve the order of remaining elements. Formulas require that order. An order-preserving operation or a parser cursor would avoid this problem. Access to left and right operands also needs valid indices and operand types.

**Validation versus evaluation.** `GetStrValue` does not call `CheckStrIsValid` first. Callers should validate input, but the evaluator should not depend solely on external validation. Empty input, unknown characters, missing operands, and incomplete ternary expressions all need explicit handling.

**Short-circuiting and branches.** Operations are reduced before ternary selection, so C++ short-circuit semantics cannot be assumed. With `[Count] != 0 && 100 / [Count] > 2`, short-circuit semantics would skip the right operand when count is zero. A ternary should likewise evaluate only the selected branch. This requires retaining branch structure during parsing.

**Results and errors.** Division by zero, unknown attributes, and some errors produce 0, which is also a valid result. A future interface should distinguish evaluation success, value, and error information. Integer overflow, input length, nesting depth, and legal nested ternary syntax also need explicit rules.

Further exploration can retain the UE string and Blueprint entry points while letting a parser consume tokens according to a defined grammar and obtain attributes from the game context. Recursive descent, for example, can assign precedence levels to separate parsing functions. Supporting short-circuiting also requires controlling which branches execute while still checking their syntax.
