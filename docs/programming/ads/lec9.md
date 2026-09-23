---
comments: true
---

# Lecture 9: Greedy Algorithm

贪心算法。

## 1 Introduction

Greedy algorithms are used to solve what we call **optimization problems**（最优化问题）.

??? note "Optimization Problem：最优化问题"
    Given a set of **constraints** and an **optimization function**. Solutions that satisfy the constrains are called **feasible solutions**. A feasible solution for which the optimization function has the best possible value is called an **optimal solution**.

> The greedy method make the **best** decision at each stage, under some **greedy criterion**. A decision made in one stage is **not changed** in a later stage, so each decision should **assure feasibility**.

也就是说贪心算法在每一步都根据一些原则来做出最好的选择，并且前一步做出决定之后在后续的过程中就不能 undo 了。同时由于这个原因，每一步需要保证进行这次操作之后**问题还是有解**，这就是需要保证 **feasibility**。

!!! warning "注意"
    * Greedy algorithm works **only if the local optimum is equal to the global optimum**.
    * Greedy algorithm **does not guarantee** optimal solutions. 贪婪不保证得到最优解，但是一般能在数值上和最优解比较接近（heuristics，启发式算法），所以当找到最优解很费时间的时候，贪婪还是很有用的。

## 2 Example: Activity Selection Problem

给定一个活动集 $S={a_1,a_2,...,a_n}$，都发生在同一个地点，而且每一个活动的起止时间为 $[s_i,f_i)$。如果某两个活动时间不重叠，那他们就称作 compatible。

问题来了：给这样一个活动集，如何挑选出最大的**不重叠**活动子集？假设这些活动按照**终止时间**来排序，也即 $f_1\le f_2\le ... \le f_{n-1} \le f_n$。

### 2.1 A DP Solution

我们首先尝试用动态规划的思维解决。挑选子问题 $S_{ij}$，它的含义是从 $a_i$ 到 $a_j$（不包含这两个活动）的 ASP 子问题。运用动态规划的思想，我们会得到：

$$
c_{ij}=\left\{
\begin{aligned}
0, &  \quad \mathrm{if } S_{ij} = \emptyset \\
\mathop{max}\limits_{a_k \in S_{ij}} \{c_{ik}+c_{kj}+1\}, & \quad \mathrm{if } S_{ij} \neq \emptyset
\end{aligned}
\right.
$$

其时间复杂度是 $O(N^2)$.

### 2.2 How to be greedy

我们考察几种可能的贪心策略：

1. 选择可行的**最早开始**的活动区间。这显然是错的啦
2. 选择可行的**最短**的活动区间。这也是错的
3. 选择可行的**与剩下未选择活动之间发生时间冲突数量最少**的活动区间。也是错的
4. 选择可行的**最先结束**的活动区间。看上去不错哦

这里给出证明：

![20240526231419](https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/20240526231419.png)

说明贪心策略 4 确实能够得到最优解。

??? note "还有其他的贪心策略吗？"
    答案是有的。我们可以选择可行的**最早开始**的活动区间。

### 2.3 Back to DP

这时重新看动态规划解法：

$$
c_{ij}=\left\{
\begin{aligned}
1, &  \quad \mathrm{if } j = 1 \\
\mathop{max} \{c_{i,j-1}+c_{1,k(j)}+1\}, & \quad \mathrm{if } j > 1
\end{aligned}
\right.
$$

这里 $a_{k(j)}$ 是在活动 $a_j$ 之前结束的最近的可能活动。

问题来了：如果我们赋予每个活动一个权重，想要得到总权重最大的活动安排，怎么做？

对于动态规划，我们可以把上式第二行后面的 +1 改成 +权重(i)，这样的动态规划解法仍然可行。

可是如果我们仍然采用贪心算法，就不一定得到最优解了。
