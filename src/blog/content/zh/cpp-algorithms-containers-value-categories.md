---
title: C++ 常用选择：容器、排序与值类别
description: 容器和排序应从访问方式与顺序要求选择，而不是根据旧版编译器的实现细节。本文采用 C++17 标准语义，合并容器、算法和引用的常见误区。
type: blog
slug: cpp-algorithms-containers-value-categories
categoryId: cpp
categoryName: CPP
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
translationKey: cpp-algorithms-containers-value-categories
---

# C++ 常用选择：容器、排序与值类别

## 问题与环境
容器和排序应从访问方式与顺序要求选择，而不是根据旧版编译器的实现细节。本文采用 C++17 标准语义，合并容器、算法和引用的常见误区。

## 容器怎么选
| 类型 | 适合的操作 | 限制 |
|---|---|---|
| vector | 连续存储、随机访问、尾部追加 | 追加均摊 O(1)，重新分配可使引用失效；中间插删 O(n) |
| deque | 随机访问、两端插删 | 不保证整体连续；中间插删 O(n)，不要当连续缓冲区 |
| list | 已知迭代器位置的插删 | 插删 O(1)，找位置 O(n)，没有随机访问 |
| map | 有序键查询 | 查询、插入、删除 O(log n) |
| unordered_map | 不要求顺序的键查询 | 平均 O(1)，最坏 O(n)，rehash 使迭代器失效 |

大对象不自动意味着 list 更快；还要考虑缓存局部性、分配次数和查找成本。vector 的增长倍率不是标准保证。引用和迭代器失效要查具体操作规则。

## 排序与稳定性
`std::sort` 需要随机访问迭代器，比较次数 O(n log n)，不保证稳定。`std::stable_sort` 保留等价元素原顺序；有足够额外内存时 O(n log n) 比较，否则可为 O(n log² n)。list 使用自己的 `sort`。典型冒泡、插入排序可稳定，最坏 O(n²)；交换式选择排序和普通快速排序通常不稳定，快速排序最坏 O(n²)。稳定性属于具体实现，不能只看名称。

## 引用和值类别
```cpp
int x = 1;
int& a = x;             // 别名，不是复制一个 int
const int& b = 2;       // 绑定临时对象并延长其生命周期
int&& r = 3;
// 表达式 r 是左值；std::move(r) 是 xvalue。
```

返回 `T&` 的函数调用是左值，返回 `T&&` 是 xvalue，通常按值返回 `T` 是 prvalue。`std::move` 是转换，不保证发生移动。局部引用绑定临时值的规则不意味着返回局部引用安全。

## 可验证例
用 `stable_sort` 按分组键排序两条同组记录，检查序号保留；用 `decltype((r))` 检查具名引用表达式类型。配套 `cpp_choices.cpp` 可按 C++17 编译；没有对原笔记的旧 VS 增长倍率进行复测。

## 独立样例

保存为 `cpp_choices.cpp`：

```cpp
#include <algorithm>
#include <cassert>
#include <type_traits>
#include <utility>
#include <vector>

struct Record { int group; int sequence; };
int main() {
    std::vector<Record> records{{2, 0}, {1, 1}, {1, 2}};
    std::stable_sort(records.begin(), records.end(),
        [](const Record& a, const Record& b) { return a.group < b.group; });
    assert(records[0].sequence == 1 && records[1].sequence == 2);
    int x = 1;
    int& alias = x;
    assert(&alias == &x);
    int&& r = 3;
    static_assert(std::is_same_v<decltype((r)), int&>);
    static_assert(std::is_same_v<decltype(std::move(r)), int&&>);
}
```
