---
comments: true
---

# Chap1. Algorithm Analysis

本章介绍算法分析的定义以及一般方法。

算法的定义：

> **An** **algorithm** is a finite set of instructions that, if followed, accomplishes a particular task.

## 1.1 Five Features

1. Input：有/无输入
2. Output：至少有一个输出
3. Definiteness：每个语句含义清晰，并无歧义
4. Finiteness：在有限步骤之后终止
5. Effectiveness：能够实现

## 1.2 Analysis

### 1.2.1 Preliminaries

两个概念：

Run times--运行时间，**依赖于设备和编译器**。

Time & Space complexities--时间/空间复杂度，**不依赖于设备和编译器**。

三个前提：

- 指令按顺序执行
- 每个语句消耗1个时间单位
- 固定的数字大小以及有限内存

通常分析两种时间复杂度：$T_{\mathrm{avg}}(N)$ & $T_{\mathrm{worst}}(N)$，平均时间复杂度和最坏时间复杂度。

### 1.2.2 渐进记号

包含$O, \Omega, \Theta, o$等记号。离散数学中已经涉及过。

<img src="https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/image-20240113165513057.png" alt="image-20240113165513057" style="zoom: 67%;" />

### 1.2.3 Basic Rules

- for循环：循环内最长运行时间×循环次数。

- 嵌套的for循环：循环内最长运行时间×所有循环体循环次数乘积。

- 连续语句：直接相加。

- if/else语句：

  ```c
  if(Condition) S1;
  else S2;
  ```

  判定时间+S1和S2中更大的时间。

- 递归：以Fibonacci number为例：

  ```c
  long int Fib(int N)
  {
      if (N<=1)
          return 1;
      else
          return Fib(N-1) + Fib(N-2);
  }
  ```

  递推分析：$T(N)=T(N-1)+T(N-2)+2$，得到$(\frac{3}{2})^{N}\le \mathrm{Fib}(N)\le (\frac{5}{3})^{N}$，也即$T(N)$指数增长。

### 1.2.4 Practice

1. For the following piece of code

   ```c
   if ( A > B ){     
     for ( i=0; i<N*2; i++ )         
       for ( j=N*N; j>i; j-- )             
         C += A; 
   }
   else {     
     for ( i=0; i<N*N/100; i++ )         
       for ( j=N; j>i; j-- ) 
         for ( k=0; k<N*3; k++)
           C += B; 
   }
   ```

   the lowest upper bound of the time complexity is ( $O(N^{3})$ ).

   注意：`if`语句中N*2不是N\*N，复杂度为$O(N^{3})$，`else`语句中复杂度也为$O(N^{3})$，因为`i`到`N`的时候内层循环就不进去了。

2. The recurrent equations for the time complexities of programs P1 and P2 are:

   - P1: $T(1)=1,T(N)=T(N/3)+1$
   - P2: $T(1)=1,T(N)=3T(N/3)+1$

   Then the correct conclusion about their time complexities is: ( $O(logN)$ for P1, $O(N)$ for P2 ).

3. 递归方式求解Fibonacci数的**空间复杂度**为( $O(N)$ )。