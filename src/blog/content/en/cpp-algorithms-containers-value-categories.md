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
sourceHash: a2c3c266f9e2a1c87f8a584428490ba9610475cd2db0f65effb85abddebf4765
generatedBodyHash: fb3a32efc8cd0e474dfff23965ac3cbea2de97617bcbf54df7dda347180b4d08
translationStatus: translated
---

Common Algorithms
===

|      |                                                                                                                                                                                                                                                                                                                                                                                  |                          |        |       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------ | ----- |
| Sorting algorithm | Description | Stable sort? | Time complexity | Space complexity |
| Bubble sort | 1. Compare adjacent elements. If the first is greater than the second, swap them; 2. Do the same for every pair of adjacent elements, from the first pair to the last, so that the last element should be the largest number; 3. Repeat these steps for all elements except the last; 4. Repeat steps 1–3 until sorting is complete. | Stable sort |        |       |
| Selection sort | 1. Find the smallest (largest) element in the unsorted sequence and place it at the beginning of the sorted sequence. 2. Continue finding the smallest (largest) element among the remaining unsorted elements, then place it at the end of the sorted sequence. 3. Repeat step 2 until all elements are sorted. | Unstable when implemented with an array; stable when implemented with a linked list | O(n^2) |       |
| Insertion sort | 1. Divide the array to be sorted into sorted and unsorted portions, initially treating the first element as sorted. 2. Starting with the second element, find its appropriate position in the sorted subarray and insert it there. 3. Repeat until the last element has been inserted into the sorted subarray. | Stable sort |        |       |
| Merge sort | - Recursive method (Top-down) - Allocate space equal to the combined size of the two sorted sequences to hold the merged sequence - Set two pointers, initially at the beginning of each sorted sequence - Compare the elements they point to, place the smaller one in the merge space, and advance that pointer - Repeat step 3 until one pointer reaches the end of its sequence - Copy all remaining elements of the other sequence directly to the end of the merged sequence - Iterative method (Bottom-up) The principle is as follows (assuming n elements): - Merge every adjacent pair of numbers into ceil(n/2) sequences, each containing two/one elements after sorting - If there is more than one sequence, merge these sequences again into ceil(n/4) sequences, each containing four/three elements - Repeat step 2 until all elements are sorted, meaning only one sequence remains |                          |        |       |
| Quick sort |                                                                                                                                                                                                                                                                                                                                                                                  |                          |        |       |
![](</media-occurrence/blog%3Acpp-algorithms-containers-value-categories%3Amedia%3A1>)
![](</media-occurrence/blog%3Acpp-algorithms-containers-value-categories%3Amedia%3A2>)

# C++ STL Containers

**Sequence containers:**

**1****. ****vector**

A contiguous storage structure: its elements are contiguous in memory. It supports efficient random access and insertion/deletion at the end, but insertion/deletion elsewhere is inefficient. It is equivalent to an array, with one difference: expansion of memory space. A vector supports storage without specifying its size, whereas array expansion must be written by the programmer.

How vector memory allocation works:

In STL's internal implementation, a very large memory block is first allocated in preparation for storage—the size returned by capacity(). When this allocated space is exceeded, a new block is allocated for the entire storage (twice the size in VS6.0, 1.5 times in VS2005). This creates the impression that a vector does not require you to specify its size, that is, the size of a contiguous memory block. This default allocation usually meets storage needs in most situations.

Expanding the space (by any amount) should follow these steps:

(1) Allocate a new block of space

(2) Move the old elements one by one to the new location

(3) Release the original space back to the system

Note: vector's data layout and operations are very similar to array's. The only difference is flexibility in space utilization. Programmers must write array expansion themselves.

The vector class defines several constructors for defining and initializing vector objects:

vector\<T> v1; The vector holds objects of type T. The default-constructed v1 is empty.

vector\<T> v2(v1); v2 is a copy of v1.

vector\<T> v3(n, i); v3 contains n elements with the value i.

vector\<T> v4(n); v4 contains n copies of a value-initialized element.

**2****. ****deque**

A contiguous storage structure, meaning each element is also contiguous in memory, similar to vector. The difference is that deque provides a two-level array structure: the first level is exactly like vector and represents the actual container; the other maintains the container's starting address. Thus, in addition to all vector functionality, deque supports efficient insertion/deletion at the front and back.

deque: double-end queue

In terms of functionality, deque combines vector and list.

Advantages: (1) Convenient random access, supporting the [ ] operator and vector.at()

(2) Convenient insertion and deletion internally

(3) Supports push and pop at both ends

Disadvantage: High memory usage

When to use each:

(1) If you need efficient random access and do not care about insertion and deletion efficiency, use vector

(2) If you need extensive insertion and deletion and do not care about random access, use list

(3) If you need random access and care about inserting and deleting data at both ends, use deque

**3****. ****list**

A noncontiguous storage structure with a doubly linked list structure. Each element maintains a pair of forward and backward pointers, supporting traversal in both directions. It supports efficient insertion/deletion at arbitrary positions, but random access is inefficient, and maintaining additional pointers adds considerable overhead. Each node includes an information block Info, a predecessor pointer Pre, and a successor pointer Post. Elements can be conveniently added and deleted without allocating a required memory size. Storage uses noncontiguous memory.

Advantages: (1) Performs dynamic operations without contiguous memory.

(2) Convenient insertion and deletion internally

(3) Supports push and pop at both ends

Disadvantages: (1) Cannot perform internal random access; it does not support the [ ] operator or vector.at()

(2) Uses more memory than vector

When to use each:

(1) If you need efficient random access and do not care about insertion and deletion efficiency, use vector

(2) If you need extensive insertion and deletion and do not care about random access, use list

(3) If you need random access and care about inserting and deleting data at both ends, use deque

**4****. ****vector VS. list VS. deque****:**

a. Choose vector if random access is needed;

b. Choose vector if the number of elements to store is already known;

c. Choose list if insertion/deletion at arbitrary positions (not just at the ends) is needed

d. Choose deque only when insertion/deletion at the front is needed while also maintaining random access efficiency; otherwise, choose vector.

e. If both insertion/deletion at arbitrary positions and random access are needed, use deque as a compromise between vector and list.

f. When storing large, complex class objects, list is better than vector; of course, vector can also store pointers to objects,

which likewise provides high efficiency, but maintaining pointers is very error-prone and therefore not recommended.

**Associative containers:**

  

Container adapters:

Stack: stack

Queue: queue

Priority queue: priority_queue

# Lvalue References and Rvalue References

# Q: What are lvalue references and rvalue references?

A: Before C++11, all traditional references were lvalue references

An lvalue reference requires that the value on the right have an address that can be taken. If its address cannot be taken, a const reference can be used;

An lvalue reference refers to any lvalue (addressable, named, and nontemporary). It is the traditional C++ form of reference

An rvalue reference refers to any rvalue (not addressable, unnamed, temporary values such as literals). It is a new C++11 feature. Like a const reference, it creates a new address for storage, but the difference is that a const reference is read-only while an rvalue reference allows reading and writing

  

# Q: Does creating an lvalue reference occupy a new address?

A: No. A reference is an alias and does not use a new address
![](</media-occurrence/blog%3Acpp-algorithms-containers-value-categories%3Amedia%3A3>)

![](</media-occurrence/blog%3Acpp-algorithms-containers-value-categories%3Amedia%3A4>)

However, referencing a literal with a const reference generates a temporary address
![](</media-occurrence/blog%3Acpp-algorithms-containers-value-categories%3Amedia%3A5>)
  
![](</media-occurrence/blog%3Acpp-algorithms-containers-value-categories%3Amedia%3A6>)
# Q: Why is a function's return value an rvalue rather than an lvalue?

Because rvalues include all temporarily valid values

A function's return value is valid only when it is returned, so it is an rvalue reference
![](</media-occurrence/blog%3Acpp-algorithms-containers-value-categories%3Amedia%3A7>)

![](</media-occurrence/blog%3Acpp-algorithms-containers-value-categories%3Amedia%3A8>)
