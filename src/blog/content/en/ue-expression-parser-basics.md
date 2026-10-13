---
title: "Parsing game expressions: define the grammar before precedence"
description: Game events may evaluate text such as `1 + 2 * 3`. Rejecting a few patterns with regex and deleting array tokens does not establish a complete grammar
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
sourceHash: 946b6aa6006e6a55c0ce8188fd4f63c67ea1b91c070df12a5855fbea7a8861c8
generatedBodyHash: a8e7fde6b73dab0148ced6c170bc320e4e7a96e6baffb503a3b03807b321cc26
translationStatus: translated
---

# Parsing game expressions: define the grammar before precedence

## Problem and environment
Game events may evaluate text such as `1 + 2 * 3`. Rejecting a few patterns with regex and deleting array tokens does not establish a complete grammar or preserve operation order. This article extracts a parser approach from UE C++ notes without their project Subsystem dependency. The accompanying sample supports only integer arithmetic, parentheses and unary signs.

## Minimum grammar
```text
expression = term { ("+" | "-") term }
term       = unary { ("*" | "/") unary }
unary      = ("+" | "-") unary | primary
primary    = integer | "(" expression ")"
```

Tokenization must consume the input at the current position completely. A leading number does not require a preceding token. Reject empty input and unknown characters, and require all tokens to be consumed at the end. Recursive parsing preserves order, including left-to-right subtraction and division. Do not reorder tokens through unordered removal.

## Errors belong in the interface
Report invalid input, unmatched parentheses, division by zero and resource limits as errors rather than returning zero for all of them. Define integer division explicitly; this sample truncates toward zero. Resolve external properties through a caller-supplied lookup, report unknown properties and avoid project singletons. Adding comparisons, logic or ternaries requires separate precedence, associativity and short-circuit rules; evaluating every branch first is insufficient.

## Try it and understand the limits
The `expression.py` sample should produce `1+2*3=7`, `(1+2)*3=9`, `8/2/2=2` and `-7/2=-3`. Empty input, `1a`, `1+`, empty parentheses and division by zero should fail. The sample bounds input length and recursion. It does not support decimals, properties, comparisons, logic or ternaries and is not a complete replacement for the original project.

## Standalone sample

Save as `expression.py`:

```python
"""Bounded integer arithmetic; no eval, external properties or engine dependency."""
import re

def calculate(text):
    if len(text) > 512:
        raise ValueError('expression too long')
    tokens = []
    pos = 0
    while pos < len(text):
        if text[pos].isspace():
            pos += 1
            continue
        match = re.match(r'[0-9]+|[()+*/-]', text[pos:])
        if not match:
            raise ValueError(f'invalid character at {pos}')
        tokens.append(match.group())
        pos += len(match.group())
    if not tokens:
        raise ValueError('empty expression')
    index = 0

    def take(token):
        nonlocal index
        if index < len(tokens) and tokens[index] == token:
            index += 1
            return True
        return False

    def unary(depth):
        nonlocal index
        if depth > 64:
            raise ValueError('nesting too deep')
        if take('+'):
            return unary(depth + 1)
        if take('-'):
            return -unary(depth + 1)
        if take('('):
            result = expression(depth + 1)
            if not take(')'):
                raise ValueError('missing closing parenthesis')
            return result
        if index >= len(tokens) or not tokens[index].isdigit():
            raise ValueError('expected integer')
        result = int(tokens[index])
        index += 1
        return result

    def term(depth):
        result = unary(depth)
        while index < len(tokens) and tokens[index] in ('*', '/'):
            op = tokens[index]
            take(op)
            rhs = unary(depth)
            if op == '*':
                result *= rhs
            else:
                if rhs == 0:
                    raise ValueError('division by zero')
                quotient = abs(result) // abs(rhs)
                result = -quotient if (result < 0) != (rhs < 0) else quotient
        return result

    def expression(depth):
        result = term(depth)
        while index < len(tokens) and tokens[index] in ('+', '-'):
            op = tokens[index]
            take(op)
            rhs = term(depth)
            result = result + rhs if op == '+' else result - rhs
        return result

    result = expression(0)
    if index != len(tokens):
        raise ValueError('unexpected trailing token')
    return result

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('expression')
    print(calculate(parser.parse_args().expression))
```
