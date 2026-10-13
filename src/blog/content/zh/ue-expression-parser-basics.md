---
title: 游戏公式解析：先定义语法，再处理优先级
description: 游戏事件需要计算 `1 + 2 * 3` 之类的文本公式。用正则排除几个非法片段，再在数组里删除 token，不足以保证完整语法和运算顺序。本文从原 UE C++ 记录提炼解析方法，去掉项目 Subsystem 依赖；配套样例只实现整数四则运算、括号和一元正负号。
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

# 游戏公式解析：先定义语法，再处理优先级

## 问题与环境
游戏事件需要计算 `1 + 2 * 3` 之类的文本公式。用正则排除几个非法片段，再在数组里删除 token，不足以保证完整语法和运算顺序。本文从原 UE C++ 记录提炼解析方法，去掉项目 Subsystem 依赖；配套样例只实现整数四则运算、括号和一元正负号。

## 最小语法
```text
expression = term { ("+" | "-") term }
term       = unary { ("*" | "/") unary }
unary      = ("+" | "-") unary | primary
primary    = integer | "(" expression ")"
```

词法分析必须从当前位置完整消费输入。数字开头不需要访问前一个 token；空输入直接报错，未知字符不能偷偷当数字，结束时必须消费全部 token。按语法递归求值自然保留顺序，减法和除法从左到右；不要用不保序删除改变 token 次序。

## 错误也是接口的一部分
把非法输入、括号不匹配、除零和资源上限作为错误，不能都返回零。整数除法需要明确截断规则；样例采用向零截断。外部属性由调用者传入查询函数，未知属性报错，不读取项目单例。若以后增加比较、逻辑和三目运算，还需独立定义优先级、结合性与短路行为，不能把所有分支先算完后再选择。

## 可验证例与限制
样例 `expression.py` 应得到 `1+2*3=7`、`(1+2)*3=9`、`8/2/2=2`、`-7/2=-3`。空串、`1a`、`1+`、空括号和除零应报错。配套样例限制输入长度和递归层数，不支持小数、属性、比较、逻辑或三目；它展示独立解析核心，不是原工程的完整替代。

## 独立样例

保存为 `expression.py`：

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
