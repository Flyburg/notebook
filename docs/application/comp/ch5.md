---
comments: true
---

# Semantic Analysis：语义分析

程序正确性的很多检查光靠词法语法是做不到的，例如等式左右两边类型不一致，变量未定义等。语义分析就是在词法分析和语法分析的基础上，进一步检查程序的语义是否正确。

语义分析的任务是：

- 通过 AST 来确定程序的一些静态属性，例如
  - 作用域、命名可见性
  - 变量类型、函数类型、表达式类型
- 将 AST 转换为中间表示（IR）

## 符号表

### 概念

语义分析阶段实际上就是由**环境**（或符号表，**符号表是环境的一种实现**）的维护来驱动的，符号表的工作是将标识符映射到其类型与位置。

- **Binding**：为一个符号绑定意义，用 $\mapsto$ 表示。
- **Environment**：一群 bindings 的集合，例如环境 $\sigma_0 = \{ x \mapsto \text{int}, y \mapsto \text{bool} \}$。

### 操作

先给一个符号表的例子：

![image.png](https://s2.loli.net/2025/06/15/joZXVcqudlJinTK.png)

可以看到：

- 每进入一个新的作用域（例如函数体），就会创建一个新的符号表。
- 右边的 bindings 会 override 左边的 bindings，也就是 X + Y 和 Y + X 是不同的。
- 当语义分析器到达每个 scope 的末尾时，此作用域的符号表会被 discard。

符号表的操作有：

- **Insert**：将一个符号插入到符号表中。
- **Lookup**：查找一个符号在符号表中的绑定。
- **BeginScope**：开始一个新的作用域，创建一个新的符号表。
- **EndScope**：结束当前作用域，回退到上一个符号表。

???info "多个符号表"
    在一些语言中，同一时间可能有多个活跃的 environment，例如 Java 的每个 class 都有自己的一个符号表。
    ![image.png](https://s2.loli.net/2025/06/15/gTLzMoVhvCa91EG.png)

### 符号表的实现

符号表有两种实现风格：

- **Imperative Style**：命令式符号表
    - 一直在本符号表上修改，遇到新的符号表也直接修改
    - 记录创建新符号表后的操作，在 EndScope 时一直 undo 到创建新符号表前的状态
- **Functional Style**：函数式符号表
    - 每次创建新符号表时，都会返回一个新的符号表，而不是修改原来的符号表
    - 通过链表来实现，新的符号表指向旧的符号表

#### 命令式符号表

- 为了实现快速的查找，命令式符号表通常使用哈希表来存储 bindings。
- 为了实现简易的删除，命令式符号表还会使用带有 external chaining 的哈希表。
- 当新的作用域覆盖原来作用域的某个符号的时候，直接把新的 binding 插入到 chaining 的头部。
- 当 EndScope 时，直接删除 chaining 的头部。

#### 函数式符号表

- 可以使用哈希表来实现，但是不是特别搞笑
    - 创建新符号表的时候，会 copy 所有的 array，但是共享 old bindings 的哈希表。
- 更常用的是二叉搜索树来实现
    - 每个 node 是一个 binding
    - 使用 string comparison 来做排序
    - **插入**：只需复制从 root 到待插入节点的父亲节点
    - **查找**：平衡情况下是 $O(\log n)$
  
![image.png](https://s2.loli.net/2025/06/15/nRV1sNhpvPMcCSH.png)

## Tiger 编译器中的符号

- 为了避免查找时候繁琐的 string comparison，可以把每个 string 绑定到一个整数 ID 上。
- 为了支持命令式符号表，引入一个 auxiliary stack 来记录符号表的变化。

## 类型检查

### Tiger 语言中的类型

- **基本类型**：int, string
- **复合类型**：array, record
- 使用 `type` 关键字类型定义的
    - nil：`Ty_Nil`
    - void：`Ty_Void`
    - 当处理递归定义的类型时，使用 `Ty_Name` 来表示递归类型，需要为 symbol 有一个 place-holder。

### 类型相同的定义

- Name Equivalence：两个类型的名字相同，当且仅当两个类型拥有相同的类型名，且都是由相同的类型定义所定义的。
- Structural Equivalence：两个类型的结构相同，当且仅当两个类型的结构完全相同。
  
Tiger 语言中使用 Name Equivalence，具体可以看下面的图：

![image.png](https://s2.loli.net/2025/06/15/xa9rcVlshRXkCgW.png)

### 命名空间

Tiger 有两套分离的命名空间：

- Types
- Functions and Variables
  
这两套命名空间是分离的，意味着可以有同名的类型和函数/变量。

因此，Tiger 也需要维护两个环境，分别是：

- Type Environment：类型环境，维护类型的定义
    - 将 symbol 映射到类型 objects
- Value Environment：值环境，维护变量和函数的定义
    - 将变量 symbol 映射到所属类型 objects
    - 将函数 symbol 映射到其参数与返回值类型 objects

### 类型检查的过程

这部分在实验中已经体会到了：

- 类型检查是一个递归的过程，遍历 AST 的每个节点。
- 检查表达式类型
    - `transExp` 函数负责检查表达式类型并更新符号表
- 检查声明类型
    - Tiger 语言中所有声明都在 `let` 语句中