---
comments: true
---

# Lecture 13: Randomized Algorithms

## 1 Example: Hiring Problem

最坏情况是面试者按照其 quality 正序来面试，最好情况是倒序。

那么假设面试者以随机顺序来面试，期望开销是多少呢？假设有 X 人被雇佣，那么 X 的期望就是 $E[X]=\sum\limits_{j=1}^N\cdot Pr[X=j]$。

如果我们对每一个面试者进行分析，以 X_i 来判定这个人有没有被雇佣，1 为被雇佣。那么很容易知道 X 就是每个 X_i 的和，根据数学知识可以知道 X 的期望也就是每个 X_i 的期望的和。

这时我们就需要知道每个人被雇佣的概率是多少，也就是 $Pr[X_i=1]$ 是多少。由于这里我们说是随机来的，所以就假设为 1/i。把他们加起来运用微积分知识就知道 $$E[X]=lnN+O(1)$$

所以总的开销就是 $O(C_h\ lnN+NC_i)$。

这里还有一个问题，就是我们需要随机生成面试顺序。这是需要时间的，方法如下：

![46b83e9f9e9c53f58d4fc3fa04c6e45c](https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/46b83e9f9e9c53f58d4fc3fa04c6e45c.png)

以上是一种 offline 算法。

对于在线算法，我们不能更改面试的顺序，怎么做呢？**只雇佣一次**。

```c
int OnlineHiring ( EventType C[ ], int N, int k )
{
    int Best = N;
    int BestQ = -INF ;
    for ( i=1; i<=k; i++ ) {
        Qi = interview( i );
        if ( Qi > BestQ )   BestQ = Qi;
    }
    for ( i=k+1; i<=N; i++ ) {
        Qi = interview( i );
        if ( Qi > BestQ ) {
            Best = i;
            break;
        }
    }
    return Best;
}
```

那么这里有两个问题：

1. 对于一个给定的 k，我们雇佣到最有能力的人的概率是多少？
2. 如何设置 k 来使得这个概率最大？

为了解决这个问题，我们记 $S_i$ 这个事件代表第 i 个面试者就是最牛逼的。那么如何使得 $S_i$ 为真？需要两个条件：

* A: The best one is at position i.
* B: No one at positions k+1 to i-1 is hired.

这两个事件是独立事件，因此有

$$
Pr[S_i] = Pr[A\cap B]=Pr[A]\cdot Pr[B]=1/N\cdot k/(i-1)=\frac{k}{N(i-1)}
$$

$$
Pr[S]=\sum Pr[S_i]=\sum\limits_{i=k+1}^N \frac{k}{N(i-1)}=\frac{k}{N}\sum\limits_{i=k}^{N-1}\frac{1}{i}
$$

于是我们有了回答：

1. 对于给定的 k，真的雇佣到最厉害的人的概率是 $$\frac{k}{N} ln(\frac{N}{k} )\le Pr[S] \le \frac{k}{N}ln(\frac{N-1}{k-1} ) $$
2. 想让这个概率最大， $k=\frac{N}{e}$，这个概率是 $1/e$。

## 2 Example: Quicksort

对于 FDS 课程中学到的 Deterministic Quicksort，最坏时间复杂度为 $\Theta(N^2)$。

如果我们随机选择 pivot 呢？

Central splitter：两边至少占 1/4 的分法。

Modified Quicksort：每次都选 Central splitter 当 pivot。

由于选到 central 分割点的概率为 0.5，所以随机选择选到 central 分割点的期望次数为 2.

![ba52b1a4b8a5ca5016a51d720fb2ab28](https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/ba52b1a4b8a5ca5016a51d720fb2ab28.png)