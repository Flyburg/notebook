---
comments: true
---

# Chap2. Linear ADT

本章节开始介绍线性数据结构，包含线性表、栈以及队列。

## 2.1 Abstract Data Type (ADT)

> An Abstract Data Type (ADT) is a data type that is organized in such a way that the specification on the objects and specification of the operations on the objects are separated from the representation of the objects and the implementation on the operations.

简单地来说就是数据及定义在其上的操作。

## 2.2 The List ADT

### 2.2.1 ADT

- Objects: (item_0, item_1, ..., item_(N-1))
- Important Operations:
  - **Finding** the $k$-th item from a list, $0\le k < N$.
  - **Inserting** a new item after the $k$-th item of a list, $0\le k <N$.
  - **Deleting** an item from a list.

### 2.2.2 Simple Array Implementation

用数组来存储线性表，也即$\mathrm{array}[\ i\ ]=\mathrm{item}_{i}$.

**Advantage**: **Find** takes $O(1)$ time.

**Disadvantage**: **Insertion and Deletion** not onle takes $O(N)$ time, but also involve a lot of **data movements** which takes time; **MaxSize** has to be estimated.

查找是很快的，但是插入删除非常消耗时间。同时需要提前估计好数组的大小。

### 2.2.3 Linked List Implementation

用链表来存储线性表。这样插入删除都只需要$O(1)$的时间。

也可以使用双指针循环链表（带有头节点）：

<img src="https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/image-20240113174539500.png" alt="image-20240113174539500" style="zoom:67%;" />

两个应用：

- 表示多项式。

  ```c
  typedef struct Polynomial{
      int coefficient;
      int exponent;
      struct Polynomial* next;
  }
  ```

- 表示矩阵（尤其稀疏矩阵），使用十字链表：

  <img src="https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/image-20240113180002603.png" alt="image-20240113180002603" style="zoom:67%;" />

  数据域：行坐标Row、列坐标Col、数值Value

  指针域：行指针Right、列指针Down

静态链表：使用一个额外的Next数组来模拟存储本节点的`next`.

<img src="https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/image-20240113181911864.png" alt="image-20240113181911864" style="zoom: 67%;" />

## 2.3 The Stack ADT

### 2.3.1 ADT

**LIFO**: Last-In-First-Out

- Objects: A finite ordered list with zero or more elements.
- Important Operations:
  - **Push**
  - **Pop**(Top)

栈是一种后进先出结构，主要实现Push和Pop操作。

### 2.3.2 Implementations

- Linked-List:
  - **Push**: `Tmpcell->Next = S->Next; S->Next = Tmpcell`
  - **Pop**: `FirstCell = S->Next; S->Next=S->Next->Next; free(FirstCell)`

- Array:

  ```c
  struct Stack{
      int Capacity;
      int TopOfStack; // ++ for push, -- for pop, -1 for empty stack
      ElementType *Array;
  }
  ```

### 2.3.3 Applications

- Balancing Symbols: 检查(), [], {}等括号是否齐全。

  创建空栈。读入左括号就push，读入右括号则检查是否为空栈，当栈非空，且栈顶为与之匹配的左括号，就pop。最后如果栈非空，则整个式子不是完整的。时间复杂度为$O(N)$，其中$N$为表达式的长度。

- Postfix Evaluation: 得到后序表达式

- Function Calls: 函数的运行方式即为使用栈。可见计概部分。

## 2.4 The Queue ADT

### 2.4.1 ADT

**FIFO**: First-In-First-Out

- Objects: A finite ordered list with zero or more elements.
- Important Operations:
  - **Enqueue**
  - **Dequeue**(Front)

### 2.4.2 Implementations

- Array:

  ```c
  struct QueueRecord{
      int Capacity;
      int Front;
      int Rear;
      int Size;
      ElementType *Array;
  }
  ```

  另外可考虑循环数组来实现队列的空间节省。

- Linked-List: 类似于Stack。