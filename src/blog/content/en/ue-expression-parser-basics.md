---
title: Exploring syntax parsing for game formulas in UE
description: Following a UE C++ game-event formula implementation from FString tokenization and attribute lookup to precedence-based evaluation, including validation, short-circuiting, and error-handling limits.
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
sourceHash: d2cd012875764845eed6301fb0e8d72b89188e365eee22f45ebe4dad50c25a9f
generatedBodyHash: 15cae3ebf090d1d8927c26b79194b8984d76a959456cb89e5dc9bcdd2265424f
translationStatus: translated
---

# Exploring syntax parsing for game formulas in UE

I wrote a simple formula parser for my game to turn rules stored as strings into results. The original note mostly preserved the code. This article follows that UE C++ implementation, explaining how a formula moves from text to a result and what still needs work.

## Why a game might use text formulas

An event may need to check character attributes before it can trigger, or calculate a value based on a condition. One approach is to store the rule as text and let the game evaluate it. Consider this illustrative event rule:

```text
[Strength] >= 10 && [Gold] >= 100
```

Square brackets denote game attributes. The parser identifies each attribute name, the game supplies its current value, and the evaluator performs comparisons and logical operations. With strength at 12 and gold at 80, this rule is false.

The same notation could select a numeric value:

```text
[Strength] >= 10 ? 100 : 50
```

This chooses 100 when strength reaches 10, and 50 otherwise. These examples illustrate the intended notation. The original attribute map contains demonstration data and is not connected to a character attribute system.

The aim is to give a string a defined computational meaning inside UE. That includes arithmetic, parentheses, comparisons, logical AND and OR, ternary expressions, and game-specific attributes.

## Following the UE entry points

The original implementation exposes two static Blueprint functions through `UMyGameEventSubsystem`:

```cpp
UFUNCTION(BlueprintCallable)
static bool CheckStrIsValid(const FString& Str, FString& Error);

UFUNCTION(BlueprintCallable)
static int32 GetStrValue(FString const& Str);
```

`CheckStrIsValid` checks the string and supplies an error message on failure. `GetStrValue` calculates a result. Results use `int32`; comparison and logical results become 1 or 0.

These are separate entry points. `GetStrValue` does not call validation first, so Blueprint exposure alone does not make arbitrary input safe. The caller needs to validate input, and evaluation still needs its own error handling.

The base class `UMyGameSubsystem` and the `CREATETHISSUBSYSTEM` macro belong to the original project. They cannot simply be copied into another UE project. The formula-processing flow is:

```text
Input FString
  → normalize selected Chinese punctuation
  → check allowed characters and symbol combinations
  → tokenize
  → replace attributes with values
  → evaluate by precedence
  → return int32
```

Both original entry points normalize punctuation. Validation also checks square brackets, parentheses, and ternary punctuation for matching pairs.

## Splitting the string into meaningful pieces

A character loop sees individual characters. Evaluation needs to recognize `123` as one number, `>=` as one operator, and `[HHHH]` as an attribute reference. These meaningful pieces are tokens.

The original `ETokenType` distinguishes numbers, addition and subtraction, multiplication and division, parentheses, comparisons, logical AND, logical OR, ternary punctuation, and custom properties. Each token stores a type and text value:

```cpp
struct FToken {
    ETokenType Type;
    FString Value;

    FToken();
    FToken(const ETokenType InType, const FString& InValue)
        : Type(InType), Value(InValue) {}
};
```

Take the formula recorded at the end of the original note:

```text
[HHHH]>=+3-5
```

The intended tokenization produces the property `HHHH`, comparison `>=`, number `3`, subtraction, and number `5`. The `+` after `>=` is a unary positive sign rather than a separate addition. A minus sign likewise needs to be distinguished from binary subtraction; the implementation attempts to represent unary negation as multiplication by `-1`.

Tokenization must recognize every part of the input and pass meaningful pieces to evaluation. Signs at the beginning, after parentheses, or after operators need explicit rules too.

**Replacing attributes with game data**

An attribute token cannot participate in arithmetic until it has a value. The original `GetStrValue` contains this example map:

```cpp
const TMap<FString, int32> CustomProperties = {
    {TEXT("123"), 123},
    {TEXT("HHHH"), 555},
};
```

It walks the tokens, changes `CustomProperty` tokens to `Number`, and substitutes the looked-up value. The example formula then means:

```text
555 >= +3 - 5
```

Under the intended semantics, `3 - 5` produces `-2`, and `555 >= -2` produces 1. The original note also records a result of 1. That is a historical result from the note, not a fresh UE execution for this article.

In a real game, the evaluation context needs to supply attribute values. A character event should use that character's data. The fixed `TMap` only demonstrates substitution. Defaulting an unknown property to 0 also needs reconsideration: a misspelled attribute could otherwise continue through evaluation as an ordinary value.

## Evaluation order defines the formula

Recognizing numbers and operators is only part of the work. The evaluator must decide what to calculate first.

```text
1 + 2 * 3      → 7
(1 + 2) * 3    → 9
```

These examples show the intended precedence. The original `Evaluate` finds parentheses, recursively evaluates the enclosed tokens, and replaces that segment with a number. It then processes multiplication and division, addition and subtraction, comparisons, logical AND, logical OR, and finally ternary selection.

For `(1 + 2) * 3`, the intended process reduces the parentheses to `3`, leaving `3 * 3`, then returns `9`. This explains the algorithm's intent; it does not establish that the current implementation correctly handles every parenthesized expression.

Operators at the same precedence also need associativity. For example, `8 / 2 / 2` conventionally evaluates left to right and yields 2. Evaluation must preserve that order as well as arithmetic precedence.

## What still needs exploration

The original code illustrates the processing stages, but several implementation details affect correctness and safety. It should not be treated as a complete formula parser.

**Do not read a previous token from an empty array**

`Tokenize` accesses `Tokens.Last()` while handling signs and ordinary numbers. The array may still be empty for the first number or a leading sign. It needs to establish whether a previous token exists before using it to interpret the current character.

**Preserve order when removing parentheses**

The implementation uses `RemoveAtSwap` to remove a parenthesized segment. This operation does not preserve the order of remaining elements, while expression meaning depends on that order. An order-preserving operation or a parser cursor would avoid this problem.

**Define short-circuit behavior for logic and ternaries**

The implementation reduces operations before selecting a ternary result. It therefore cannot be assumed to provide C++ short-circuit behavior. Consider this intended rule:

```text
[Count] != 0 && 100 / [Count] > 2
```

With short-circuit semantics, a zero count should skip evaluation of the right operand. A ternary expression should likewise evaluate only its selected branch. The language needs to define this behavior, and the evaluator needs to retain branch structure to implement it.

**Separate validation from evaluation errors**

The validator mainly rejects invalid patterns with regular expressions and checks matching punctuation. This catches some input errors, but a complete grammar also needs to establish whether operands are present, whether an operator is legal at the current position, and how ternary branches nest.

Division by zero, unknown attributes, and some errors currently produce 0, which is also a valid result. A more complete evaluation interface needs to distinguish success, result, and error reason. Integer division, overflow, input length, and nesting depth also need explicit rules.

**Continuing the implementation**

A useful next step is to implement a complete grammar for integers, arithmetic, and parentheses in UE C++, then add attributes, comparisons, logic, and ternary expressions. Each addition needs legal syntax, precedence, associativity, and error behavior defined first.

For example, recursive descent can give different precedence levels their own parsing functions and consume tokens through a cursor. Short-circuit logic and ternaries also need enough retained structure to validate an unselected branch without executing its calculations.

The UE layer can receive `FString`, supply attributes for the current character or event, and return results and errors to Blueprint. The parser can focus on understanding the formula. This keeps the game use case visible while making each syntax feature's execution easier to follow.
