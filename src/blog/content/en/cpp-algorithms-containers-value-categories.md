---
title: "Everyday C++ choices: containers, sorting and value categories"
description: Choose containers and sorting by access patterns and ordering requirements rather than old compiler implementation details. This article uses C++17 se
type: blog
slug: cpp-algorithms-containers-value-categories
categoryId: cpp
categoryName: CPP
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
translationKey: cpp-algorithms-containers-value-categories
publishedAt: 2026-10-13
sourceHash: c89d90d413655495a4ac86d14117f1f36b82504487d9117924b7dcdf3d6f7c34
generatedBodyHash: a828b28dec8a9a9603171c89f0eb55abae52bbd5ee75361f2c7e1453953c6095
translationStatus: translated
---

# Everyday C++ choices: containers, sorting and value categories

## Problem and environment
Choose containers and sorting by access patterns and ordering requirements rather than old compiler implementation details. This article uses C++17 semantics and combines common container, algorithm and reference misconceptions.

## Choosing containers
| Type | Useful operations | Limits |
|---|---|---|
| vector | Contiguous storage, random access, appending | Amortized O(1) append; reallocation can invalidate references; middle insert/erase O(n) |
| deque | Random access and operations at both ends | Not guaranteed contiguous; middle insert/erase O(n); not a contiguous buffer |
| list | Insert/erase at a known iterator | O(1) insertion/erasure, O(n) position lookup, no random access |
| map | Ordered key lookup | O(log n) lookup, insertion and erasure |
| unordered_map | Key lookup without ordering | Average O(1), worst O(n); rehash invalidates iterators |

Large objects do not automatically make list faster; account for locality, allocations and lookup costs. Vector growth factors are not standard guarantees. Consult operation-specific reference and iterator invalidation rules.

## Sorting and stability
`std::sort` requires random-access iterators, uses O(n log n) comparisons and does not guarantee stability. `std::stable_sort` preserves equivalent elements' original order: O(n log n) comparisons with sufficient extra memory, potentially O(n log² n) otherwise. Use list's own `sort`. Typical bubble and insertion sorts can be stable with O(n²) worst cases. Swap-based selection sort and ordinary quicksort are usually unstable; quicksort's worst case is O(n²). Stability depends on the implementation rather than its name alone.

## References and value categories
```cpp
int x = 1;
int& a = x;             // An alias, not an int copy
const int& b = 2;       // Binds a temporary and extends its lifetime
int&& r = 3;
// The expression r is an lvalue; std::move(r) is an xvalue.
```

A function returning `T&` produces an lvalue call expression; `T&&` produces an xvalue, and an ordinary by-value `T` return produces a prvalue. `std::move` is a cast and does not guarantee moving. Temporary lifetime extension for local references does not make returning a local reference safe.

## Try it
Use `stable_sort` on two records with equal group keys and inspect their sequence numbers. Use `decltype((r))` to inspect a named reference expression. Compile `cpp_choices.cpp` as C++17. The original notes' historical Visual Studio growth factors were not retested.

## Standalone sample

Save as `cpp_choices.cpp`:

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
