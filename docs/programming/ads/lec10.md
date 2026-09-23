---
comments: true
---

# Lecture 10: NP

## 1 Easy vs. Hard

The easist: $O(N)$, since we have to read all the input.

The hardest: **Undecidable** problems, such as the Halting Problem.

## 2 The Class NP

Turing machine is introduced to simulate any kind of computation which a mathematician can do by some arithmetical method. 图灵机由无限长的纸带和读写头组成，纸带上的每个格子都可以存储一个符号，读写头可以读取或写入符号。

A **Deterministic Turing Machine** executes one instruction at each point in time. Then **depending on the the instruction**, it goes to the next **unique** instruction.

A **Non-deterministic Turing Machine** is **free to choose** its next step from a inite set. And if one of these steps leads to a solution, it will **always choose the correct one**.

这里的 NP 是 Non-deterministic Polynomial time 的缩写。

The problem is NP if we can prove any solution is true in polynomial time.

!!!caution "注意"
    **Not all decidable problems are in NP**. For example, consider the problem of determing whether a graph does not contain a Hamiltonian cycle.

按照以上的叙述，可以知道 $P \subseteq NP$。但是有没有 $P \subset NP$ 呢？这仍然是一个未解决的问题。

## 3 NP-Complete Problems: the Hardest in NP

An NP-Complete problem has the property that **any** problem in NP can be **polynomially reduced** to it.

**If we can solve one NP-Complete problem in polynomial time, we can solve all NP problems in polynomial time**.

Given any instance $\alpha$ of an NP-Complete problem, we can reduce it to an instance $\beta$ of another NP-Complete problem in polynomial time, and then solve $\beta$ in polynomial time, then we can solve $\alpha$ in polynomial time.

!!! info "提示"
    Decision problem is easier, since we only have to answer yes or no.
    Optimization problem can be related to a decision problem.
    Example: SHORTEST-PATH relates to PATH: given a directed graph G, vertices u and v, and an integer k, does a path exist from u to v consisting of at most k edges?

第一个被证明是 NP-Complete 的问题是 SAT（Satisfiability）问题。

## 4 A Formal-language Framework

An **abstract problem** Q is a binary relation on a set I of problem instances and a set S of solutions.

If we map I into a binary string {0,1}*, then Q is a **concrete problem**.

对于 decision problem，如下图：

![19cc232cf1859ffc8ee2329fad19ed2d](https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/19cc232cf1859ffc8ee2329fad19ed2d.png)

![da09801971aeb3c64d0e0e26bdf19123](https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/da09801971aeb3c64d0e0e26bdf19123.png)

![46137ae08b7b11fa99b4988f0e964a37](https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/46137ae08b7b11fa99b4988f0e964a37.png)

**有关 co-NP 的定义**：

![e518db94e24de1df29be2a9b4cd4c82a](https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/e518db94e24de1df29be2a9b4cd4c82a.png)

![77591d3737b2c0323570148c7bc99303](https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/77591d3737b2c0323570148c7bc99303.png)