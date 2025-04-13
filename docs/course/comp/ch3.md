---
comments: true
---

# Parsing：语法分析

??? abstract "概述"
    语法分析（Syntax Analysis）是编译器的前端工作之一，它的任务是**检查程序的语法**（短语结构）。下面这张图展示了编译器的前端工作流程。

    <figure markdown="span">
        ![front-end.png](https://s2.loli.net/2025/03/05/6b1lW8ARPpdt9yc.png){ width="500" }
    </figure>

    红色框出的部分即为语法分析的工作，接收 token 流，按照给定的语法进行语法分析，输出抽象语法树。

    **如何构建一个语法分析器？**

    - 描述编程语言的语法规则（使用上下文无关文法）
    - 依据 CFG 来构建语法分析器：
        - Top-Down Parsing
            - Predictive Parsing
        - Bottom-Up Parsing

## 上下文无关文法

### 为什么需要 CFG？

虽然词法分析能够辨析出合法和不合法的 tokens，但是这不代表一连串的 tokens 就能够组成一个正确的程序。语法分析器必须能够辨别出合法的 token 序列。为此，我们需要：

- 形式化描述合法的 token 序列
- 一种能够识别这种描述的算法

在词法分析一节中，我们介绍了正则语言，实际上正则语言是描述能力最弱的一种形式化语言。例如考虑下面的语言：

$$
\{ (^i)^i \mid i \geq 0 \}
$$

这是一种递归定义的语言（空串或任意数量的括号对），遗憾的是，正则语言无法描述这种语言（这个语言不是正则的）。而这种递归语言在编程语言非常常见，所以我们需要一种拥有更强描述能力的语言。

### CFG 的定义与推导方式

CFG 的定义在计算理论中已经详细介绍过，这里不再赘述。

CFG 形式化描述了合法的 token 序列，而 **CFG 的推导过程则可以用来区分合法和不合法的 token 序列**。能够由 start symbol 推导出来的 token 序列是合法的，否则是不合法的。合法的 token 序列实际上就是 CFG 对应的语言 $L(G)$。

推导过程可以画出一棵树来，而依据推导方式和顺序的区别，又有 left-most derivation 和 right-most derivation 之分（也有既不是 left-most 也不是 right-most 的中间推导）。

??? example "CFG 推导的例子"
    ```plaintext
    E -> E * E        E -> E - E        E -> (E)
    E -> E / E        E -> id
    E -> E + E        E -> num
    ```

    根据上面的规则，如果想推导 `id * id + id`，可以有多种推导方式，例如：
    
    | ![image1.png](https://s2.loli.net/2025/03/06/735xbnzBpiW4FKs.png){ width="150" } | ![image2.png](https://s2.loli.net/2025/03/06/t9qkw1eXQrb5zvW.png){ width="150" } |
    |:---------------:|:---------------:|
    |     最左推导    |     最右推导    |

对语法树的中序遍历，就是对应的原始表达式。
    
而对于语法分析来说，不仅要知道一个 token 序列是否合法，还要构建出对应的语法树，这就是语法分析的任务。**对于一个没有歧义的 CFG，最左推导和最右推导得到的语法树都是唯一的**。

### 有歧义的 CFG

我们称一个语法是有歧义的（ambiguous），如果存在一个句子可以被这个语法推导出多个不同的语法树。也就是说，对于某个字符串，有不止一个最左推导或最右推导。

例如上面的例子，如果采用这种语法分析，那么 `id * id + id` 就会有两种不同的语法树，这就是有歧义的。当进行计算的时候（例如 `2 * 3 + 4`），两种语法树会得到不同的结果。

**有歧义的语法不适合作为一种编程语言的语法**，因为这会导致程序的行为不确定。所以在设计编程语言的语法时，要尽量避免歧义。

为了解决可能出现的歧义，最直接的方式就是改写：将有歧义的语法改写成无歧义的语法。例如，对于上面的例子，我们希望：

- 乘法优先级高于加法
- 每种操作都是左结合的

解决方案是**引入新的非终结符**，使得某些产生式比另一些产生式更晚被使用。例如，可以将上面的例子改写为：

```plaintext title="改写后的四则运算语法"
E -> E + T        T -> T * F        F -> id
E -> E - T        T -> T / F        F -> num
E -> T            T -> F            F -> (E)
```

其中，`E` 表示表达式，`T` 表示项，`F` 表示因子。这样就解决了乘法优先级高于加法的问题。同时，由于使用的是类似 `X -> X op Y` 的产生式，所以能够保证左结合性。

体现在语法树上，上述的改动就是：

- 优先级：更高优先级的操作离根节点越远，越晚被推导出来
- 结合型：使用**左递归（left recursion）**，也即：产生式右边的第一个 symbol 与产生式左边的 symbol 相同

> 同理，如果想要实现右结合，只需要使用右递归即可。

此外在编程语言语法中还存在 EOF 终结符。

??? note "EOF"
    在这里使用美元符号 `$` 表示 EOF（End of File），表示 token 流的结束。

    如果题目没有显式地画出 EOF，需要我们手动在前面加上一个类似 `S'->S$` 的产生式，其中 `S'` 是新的起始符号。

## 自顶向下的语法分析器

语法分析器分三种：（1）Universal 通用的；（2）Top-Down 自顶向下的；（3）Bottom-Up 自底向上的。

- **Universal**：能够处理任何 CFG，但是效率较低
- **Top-Down**：从起始符号开始，逐步推导出 token 序列，直到得到输入的 token 序列
- **Bottom-Up**：从输入的 token 序列开始，逐步推导出起始符号

??? info "自顶向下与自底向上语法分析器的异同"

    **同**：

    - 无论是自顶向下还是自底向上，都是从左向右扫描输入，一次处理一个 symbol。

    - 虽然最有效的 TD 语法分析与 BU 语法分析器都只针对**某些特定的语法**才能 work，但是这些（例如 LL 和 LR 语法）语法的能力已经足够来描述大多数编程语言的语法。

    **异**：

    - 手动实现的语法分析器一般使用 LL 语法；
    - 自动工具实现的语法分析器一般使用 LR 语法，LR 语法比 LL 语法更强大。

Top-Down 语法分析器的特点是：

- 语法树从顶向下构建，从左向右构建
- 可以视作寻找输入序列的**最左推导**

### 递归下降分析器

递归下降（Recursive Descent）：

- 属于 TD 语法分析的一个通用形式
- 非常简单，可以手动实现
- 为了寻找正确的产生式，有可能会发生回溯（backtracing）

手写的方式为：

- 对每一个非终结符，都有一个递归的函数
- 每个产生式都是这个函数的一个 case。

??? example "举个例子"

    对于语法：

    ```plaintext
    S -> if E then S else S       L -> end
    S -> begin S L                L -> ; S L
    S -> print E                  E -> num = num
    ```

    针对非终结符 `L`，可以写出如下的递归下降分析器：

    ```c
    void L(void) {
        switch(tok) {
            case END: eat(END); break;
            case SEMI: eat(SEMI); S(); L(); break;
            default: error();
        }
    }
    ```

    以此类推。完整的编写步骤为：

    1. 先枚举出 tokens
    2. 从 lexer 获得 `getToken()` 函数等
    3. 递归下降函数的编写

上面这个例子是很特殊的：对于每一个非终结符，所有的产生式右边的第一个 symbol 都是**不同的**、**非终结符**。然而如果说遇到下列情况：

```plaintext
S -> S L | begin E, S L
```

那么当 `tok` 为 `begin` 时，就无法确定是 `S -> S L` 还是 `S -> begin E, S L`，这就需要**回溯**：

- 回溯的代价很大
- 步骤数量有可能呈指数级增长

于是我们在寻求一种不需要回溯的递归下降方法：**预测分析**。

### 预测分析

预测分析（Predictive Parsing）：

- 是一种特殊的递归下降分析
- 不需要回溯
- 通过向前看固定数量的输入 symbols（一般是一个）来决定使用哪个产生式
- 能够解析 LL(k) 文法：从左到右扫描，最左推导，k 个向前看

如何预测选择产生式呢？假设 k=1，那么：

1. 首先，我们需要知道这个非终结符的所有产生式中**可能出现的第一个终结符**
2. 然后，如果多个产生式的【可能出现的第一个终结符】相同，那么就需要重写语法，使得只能使用一个产生式。

对于第 1 点，我们该如何知道一个非终结符的所有产生式中可能出现的第一个终结符呢？这里引入两个概念：First 和 Follow。

!!! note "First 与 Follow 集合"

    这里假设：

    - $\gamma, \beta, \delta$ 是文法符号串（可能包含终结符和非终结符）
    - $X$ 是一个非终结符
    - $t$ 是一个终结符

    两个集合的定义为：

    - $\text{FIRST}(\gamma)$：如果 $\gamma \rightarrow^* t\beta$，那么 $t \in \text{FIRST}(\gamma)$
        - 这代表着 $\gamma$ **能够在第一个位置推导出**终结符 $t$
        - $\text{FIRST}(\gamma)$ 是能够作为【$\gamma$ 推导出的字符串的开头】的终结符的集合
    - $\text{FOLLOW}(X)$：如果 $S \rightarrow^* \beta X t\delta$，那么 $t \in \text{FOLLOW}(X)$
        - 如果推导式包含 $XYZt$ 且 $Y$ 和 $Z$ 可以推导出空串 $\epsilon$，那么 $t$ 也可能在 $X$ 后面，也就是说 $t \in \text{FOLLOW}(X)$
        - $\text{FOLLOW}(X)$ 是能够作为【$X$ 推导出的字符串的直接后续】的终结符的集合

??? info "First 集合的计算方法"
      - **Base case**:
          - 如果 $X$ 是终结符，那么 $\text{FIRST}(X) = \{X\}$
          - 如果 $X$ 是非终结符，那么初始化 $\text{FIRST}(X) = \{\}$
      - **Induction**:
        如果 $X$ 是非终结符，并且 $X \rightarrow Y_1Y_2 \cdots Y_k$，那么 $\text{FIRST}(X)=\text{FIRST}(X) \cup \text{FIRST}(Y_1)$，如果 $Y_1$ 可以推导出空串 $\epsilon$，那么还要加上 $\text{FIRST}(Y_2)$，以此类推。

??? info "Follow 集合的计算方法"
      - **Base case**:
        初始化 $\text{FOLLOW}(X) = \{\}$，其中 $X$ 是非终结符。
      - **Induction**:
          - 对于任意字符串 $\alpha, \beta$，如果 $Y \rightarrow \alpha X\beta$，则 $\text{FOLLOW}(X) = \text{FOLLOW}(X) \cup \text{FIRST}(\beta)$。
          - 对于任意字符串 $\alpha, \beta$，如果 $Y \rightarrow \alpha X\beta$ 且 $\beta \rightarrow^* \epsilon$，则 $\text{FOLLOW}(X) = \text{FOLLOW}(X) \cup \text{FOLLOW}(Y)$。

现在对于一个产生式 $X \rightarrow \gamma$，推导后的第一个终结符 $t$ 可能是：

- any token in $\text{FIRST}(\gamma)$
- any token in $\text{FOLLOW}(X)$ if $\gamma \rightarrow^* \epsilon$

从上面可以看出来，有必要知道一个 symbol 是否可以推导出空串。这就引入了 **nullable** 的概念。

??? info "判断是否是 nullable symbol"
    ```plaintext
    for each symbol X:
        Nullable(X) = false
    repeat
        for each production X -> Y1Y2...Yk:
            if Nullable(Y1) and Nullable(Y2) and ... and Nullable(Yk):
                Nullable(X) = true
    until no change
    ```

??? example "计算 First 和 Follow 集合的例子"

    语法：

    ```plaintext
    Z -> X Y Z     Y -> c    X -> a
    Z -> d         Y ->      X -> Y
    ```

    | | Nullable | First | Follow |
    |:---:|:---:|:---:|:---:|
    | Z |False |a, c, d | |
    | Y |True |c |a, c, d |
    | X |True |a, c |a, c, d |

!!! info "几点说明"
    - 为了让计算过程更高效，我们需要选择合适的检查推导式的顺序
    - 三种概念的计算可以同时进行

有了 First 和 Follow 集合，我们就可以写出一个预测分析器了：

- 如果 $t \in \text{FIRST}(\gamma)$，那么在表格的 $[X, t]$ 处填入 $X \rightarrow \gamma$
- 如果 $\gamma \rightarrow^* \epsilon$ 且 $t \in \text{FOLLOW}(X)$，那么在表格的 $[X, t]$ 处填入 $X \rightarrow \gamma$

??? example "预测分析表的例子"

    对于上面的例子，可以得到如下的预测分析表：

    | | a | c | d |
    |:---:|:---:|:---:|:---:|
    | Z | Z -> X Y Z | Z -> X Y Z | Z -> X Y Z; Z -> d |
    | Y | Y -> | Y -> c; Y -> | Y -> |
    | X | X -> a; X -> Y | X -> Y | X -> Y |

表格**空项代表语法错误**；**多项**则代表这个语法不是 LL(k) 的。

需要注意的是，对于任意的 k，**LL(k) 语法都是没有歧义的**。

基于语法分析表，我们可以

- 构造一个递归预测分析器
- 通过栈来实现非递归的预测分析器。

??? example "非递归分析器例子"

    假设已经有这样的语法分析表：

    |M[N, T]|(|)|$|
    |:---:|:---:|:---:|:---:|
    |S|S->(S)S|S->ε|S->ε|

    根据这个表，如果想要对 `()$` 进行语法分析，步骤如下：

    |Steps|Parsing Stack|Input|Action|
    |:---:|:---:|:---:|:---:|
    |1|$S|()$|S->(S)S|
    |2|$S)S(|()$|match|
    |3|$S)S|)$|S->ε|
    |4|$S)|)$|match|
    |5|$S|$|S->ε|
    |6|$|$|accept|

    如果规约，先把表达式左边的东西 pop 出来，再把右边的按照**逆序** push 进去。

    如果 match，就把输入的东西 pop 出来。

### 消除左递归

对于上面的第 2 点，如果多个产生式的【可能出现的第一个终结符】相同，那么就需要重写语法，使得只能使用一个产生式。

常见的一种问题是左递归，例如：

```plaintext
E -> E + T
E -> T
```

这个文法表达的是 `{T, T+T, T+T+T, ...}`，但是**会导致 LL(1) 分析表中一个表格中有多个产生式**。

消除方式为使用右递归：

```plaintext title="消除左递归"
A -> Aα    =>   A -> βA'
A -> β          A' -> αA'
                A' -> ε
```

在这个例子中，就可以修改为：

```plaintext
E -> TE'
E' -> +TE'
E' -> ε
```

这是一种最简单的形式，成为**直接左递归**。还有一种**间接左递归**，也即 $A \rightarrow^+ A \alpha$。

解决方案为**左因子分解**：

```plaintext title="左因子分解"
A -> αβ    =>    A -> αA'
A -> αγ          A'-> β | γ | ε
A -> a
```

### 错误恢复

我们当然可以选择遇到错误直接报异常并退出。但是能不能有更加高效的方法呢？能不能一次报出多个错误呢？

我们可以通过删除、替换或插入 tokens 来进行错误恢复。

// TODO: 这里需要补充一些例子

## 自底向上的语法分析器

与自顶向下的 parser 相反，这种语法分析器从语法树的叶子结点出发，对应着构建一个语法树的过程。它的工作是从输入的 token 序列开始，逐步推导出起始符号。Shift-Reduce Parser 就是一个典型的自底向上的语法分析器。

- LR(k) 语法
  - 是 Shift-Reduce 语法分析器所能识别的最大的语法集合
  - 比 LL(k) 语法更强大：能够推迟产生式的选择，知道能看见推导式右边的所有 token 之后再决定使用哪个产生式
  - LR(k) 的含义是：
    - L：从左到右扫描输入
    - R：最右推导
    - k：k 个向前看的 token
- LALR 变种语法
  - 是大多数现代编程语言语法分析器的基础
  - 在诸如 Yacc 的工具中使用

### 自底向上的思想

- Idea：从 string 开始进行 **reduce**，直到得到 start symbol
- reduce 可以看作是 derive 的逆过程：将产生式右边的 symbol 替换为产生式左边的 symbol
- 其工作方式也是自左向右扫描 input，**重要的是需要知道在哪个地方进行 reduce**

### 工作的流程

1. 首先我们把输入用一个点号区分成两部分（例如 $\alpha . \beta$）：
    - 左边是已经处理的部分，包含终止符与非终止符
    - 右边是未处理的部分，只包含终止符
2. 维护了一个语法分析状态栈，里面放的是已经处理过的部分
3. 语法分析有以下动作：
   1. **Shift**：将下一个 token 移入状态栈的顶部
   2. **Reduce R**：
      - 栈顶 match 规则 R 的右边
      - 把匹配的部分 pop
      - 将 R 的左边 push 进栈
   3. **Accept**：当栈顶是 start symbol，且输入已经处理完毕
   4. **Error**

那么如何知道何时 shift，何时 reduce 呢？这就需要一个 LR 语法分析表。

### LR(0) 语法分析器的构建

LR(0) 语法是最简单的一种 LR 语法，它在做 shift/reduce 决定的时候**不需要向前看输入，只需要看 stack**。我们通过列举出所有可能的 parsing state，然后构建一个状态机来实现。

实际上我们是通过先构建一个 NFA，再通过 epsilon 闭包来构建 DFA。由于这里的 NFA 比较简单，相比于 DFA 只包含了一些 epsilon 边，所以我们可以直接构建 DFA。

// TODO：具体的算法

构建完 DFA 之后，就可以画出 parsing table 了。

!!! note "LR Parsing Table 的构建方法"
    对每一个状态：
    
    1. 经过终结符的边进入的状态，填入 shift+状态号
    2. 经过非终结符的边进入的状态，填入 goto+状态号
    3. 如果状态中有产生式的右边已经被 match 完成，在这一行的所有终结符格子填入 reduce+产生式号
    4. 如果状态中有产生式的右边已经被 match 完成，且这个产生式是 start symbol，填入 accept

### SLR 语法分析器的构建

Simple LR Parsing。与 LR(0) 唯一的不同就在于，SLR 构建的时候，遇到 reduce 的情况，**只在 Follow(X) 集合中的终结符的格子填入 reduce**。也就是说，SLR 语法分析器的 parsing table 中，只有在 Follow 集合中才会有 reduce 的动作。

### LR(1) 语法分析器的构建

LR(1) 与 LR(0) 的区别在于，LR(1) 在做 shift/reduce 决定的时候**需要向前看一个 token**。也就是说，LR(1) 的 parsing table 中，shift/reduce 决定是基于当前状态和下一个 token 的。

LR(1) item 长这样：

$$
(A \rightarrow \alpha . \beta, x)
$$

对于这样一个 item，下一个 token 应当是 First($\beta x$) 中的一个 token，其中 $\beta$ 可以是空串。

需要注意的是，对于 LR(1) 来说，两个状态即使包含完全相同的产生式与 dot 位置，如果 "x" 不同，那么它们也是不同的状态。

剩下的 parsing table 构建方法与 LR(0) 一致，只不过在 reduce 的时候，**只在 "x" 中的终结符的格子填入 reduce**。

### LALR(1) 语法分析器的构建

由于 LR(1) 的 parsing table 可能比较大，包含比较多的状态，所以我们可以将 LR(1) 的 parsing table 中的状态进行合并，得到 LALR(1) 的 parsing table。LALR(1) 的 parsing table 中的状态数目比 LR(1) 的要少。

合并的方法是：如果两个状态有相同的产生式和 dot 位置，但是不同的 "x"，那么就可以将它们合并成一个状态。合并之后，LALR(1) 的 parsing table 中的状态数目会减少，但是仍然能够保持 LR(1) 的解析能力。

需要注意的是，LALR(1) 的 parsing table 可能包含 LR(1) 中不存在的 reduce-reduce 冲突，但是实操上来说基本不影响，换来的是更少的内存占用。

### 对有歧义语法的 LR 语法分析

大多数编程语言的语法可能包含如下所示的规则：

```plaintext
S -> if E then S else S
S -> if E then S
```

那么对于语句 `if a then if b then s1 else s2` 来说，就有两种解释方式：

1. `if a then {if b then s1 else s2}`
2. `if a then {if b then s1} else s2`

而在大多数语言的定义中，`else` 会匹配最近的 `then`，因此一般采用第一种解释方式。

如何解决呢？

!!! example "方案一：引入新的非终结符"

    我们引入 M 代表匹配的 `if`（也即所有的 `then` 都被匹配了），U 代表没有匹配的 `if`（存在没有被匹配的 `then`），那么就可以改写为：

    ```plaintext
    S -> M
    S -> U
    M -> if E then M else M
    M -> other
    U -> if E then S
    U -> if E then M else U     # 这里的 $4 必须是 M 的原因是，如果为 U 的话前后抵消，又变成全部匹配的了
    ```

!!! example "方案二：修改分析表"

    上述歧义实际上是一种 shift-reduce 冲突，我们可以保持语法不变，而在分析表中遇到这个冲突的时候，**优先选择 shift**。

    需要注意的是，大多数的 s-r 冲突，以及可能所有的 r-r 冲突，都是语法设计不恰当的表现，最好是**修改语法以消除冲突**。

## Yacc：一种语法分析器生成器

如何实现一个语法分析器呢？

1. 手写
2. 使用自动的语法分析器的生成器，其特点是：
   - 通用、稳定（鲁棒）
   - 有时不如手写的分析器效率高
   - 懒人友好

**Yacc**（Yet Another Compiler-Compiler）是一种语法分析器生成器。它的工作是：

- 输入：`.y` 后缀的语法描述文件
- 输出：包含语法分析器实现的 C 语言源代码

Yacc 的使用方法类似于 Lex，其描述文件包含：

```plaintext
{definitions}
%%
{rules}
%%
{auxiliary routines}
```

### 辅助函数

可以使用以下辅助函数：

- `yyparse()`：会自动调用语法分析器进行语法检查，返回 0 表示成功，1 表示失败。其内部会调用 `yylex()` 函数来获取下一个 token，获取到 null value 0 的时候，代表输入结束。`yylex()` 返回 0 或者 token 类型，其中变量 `yylval` 用来存储 token 的语义值（会在后续被压入 value 栈）。
- `yyerror()`：语法分析器遇到错误时调用的函数。

### 定义部分

Token 的声明可以放在定义部分，有两种方式：

- 使用单引号包裹的东西会被识别成自身，例如 `'+'`
- 使用 `%token` 来声明：
  - `%token` 声明的 token 是终结符
  - `%start` 声明的 token 是起始符号

### 规则部分

规则部分包含了语法分析的规则，格式类似于 Lex，都是规则 + {动作函数}。

- 如果分析器确实使用了这一条规则进行 reduce，则会执行 action code
- Action code 可以放在语法规则的最后面，也可以放在规则的中间。
  - 例如 `decl: type {current_type = $1;} var-list` 这样写就可以在匹配到 `type` 的时候立即存储当前的类型到 `current_type` 变量中。
  - 需要注意的是，上面 `{current_type = $1;}` 也是一个占位符，所以如果后面 `var-list` 也有语义值，就应该是 `$3`，而不是 `$2`。
- 执行 action code 的时候，可以用 `$$` 来表示当前规则的值，`$1`、`$2` 等来表示当前规则的第 1、2 个值。这些值是
  - 语法分析器在语法树中对应的节点
  - 语义值栈中的值
  - 语义值的类型声明可以用类似 `#define YYSTYPE int` 的方式来声明
    - 如果遇到了不同的类型需要存储，使用 `%union` 来声明，使用 `%type` 来声明类型
    - 例如 `$$ = $1 + $3`，实际干的事情是 `(yyval.val)=(yyvsp[1-3].val) + (yyvsp[3-3].val)`

Yacc 会报告 s-r 冲突与 r-r 冲突，此外，它还有一套默认的处理方式：

- s-r 冲突：优先选择 shift
- r-r 冲突：优先选择在语法规则中更早出现的规则

!!! warning "关于冲突"

    如前面所说，大多数的 s-r 冲突，以及可能所有的 r-r 冲突，都是语法设计不恰当的表现，最好是**修改语法以消除冲突**。

### 优先级声明

对于四则运算，我们已经知道如果简单地声明类似 `E -> E + E; E -> E - E; E -> E * E; E -> E / E` 的语法，会导致歧义。之前的讨论中，我们也知道可以通过增加新的非终结符来实现。但是加入非终结符之后，语法变得不自然、难理解。有没有一种方法使得我们写的还是自然语法，但同时能够保成优先级与结合性呢？

Yacc 提供了 precedence directives 来实现这个功能。它的语法如下：

```plaintext
%nonassoc EQ NEQ
%left PLUS MINUS
%left TIMES DIV
%right EXP
```

其中：

- 加减法具有相同的优先级，且是左结合的
- 乘除法写在加减法下面，具有**更高的优先级**，且也是左结合的
- EXP 运算符是右结合的
- EQ 和 NEQ 运算符写在最上面，具有**最低的优先级**，且是非结合的（也即诸如 `a == b == c` 是错误的）

??? info "Yacc 是如何实现这些特性的"

    - 这些声明为 tokens 的优先级排序了
    - shift 一个 token 的优先级取决于 token 本身的优先级
    - reduce 一个 rule 的优先级取决于规则最右边的 token 的优先级

    1. 遇到 s-r 冲突的时候，看两者优先级
    2. 如果规则比 token 优先级高，那么就 reduce，反之 shift
    3. 如果优先级相同：
          1. 如果是左结合的，那么就 reduce
          2. 如果是右结合的，那么就 shift
          3. 如果是非结合的，那么就报错

??? example "更多特性"

    `-6*8` 应该表示为 `(-6)*8`，而不是 `-(6*8)`。我们可以通过 `%prec` 来实现：

    ```plaintext
    %token INT PLUS MINUS TIMES UMINUS
    %start exp
    %left PLUS MINUS
    %left TIMES
    %left UMINUS
    %%
    exp : INT
    | exp PLUS exp
    | exp MINUS exp
    | exp TIMES exp
    | MINUS exp %prec UMINUS   // UMINUS 永远不会由 lexer 产生，这只是一个占位符
    ```

    这样操作后，`exp: MINUS exp` 将会拥有最高的优先级。

还有一些小问题，比如算术运算与逻辑运算之间的类型匹配，例如 `a + 5&b`。这个式子是语法正确的，但是这个表达式是不对的，我们的解决方案是**推迟到语义分析阶段**来解决这个问题。

## 错误恢复

如前面所述，开发者希望语法分析器能够一次检查出所有的错误，而不是在遇到第一个错误时就停止。

存在两种错误恢复机制：

- Local Error Recovery
- Global Error Repair

### Local Error Recovery

尝试在遇到错误的时候调整 parsing stack 和 input 使得语法分析能够继续进行下去。

!!! example "Yacc 使用的一种局部错误恢复技术"

    使用一个特殊的 `error` 符号来控制恢复过程，例如：

    ```plaintext
    exp -> ID
    exp -> exp + exp
    exp -> (exps)
    exps -> exp
    exps -> exps ; exp
    exp -> (error)
    exps -> error ; exp
    ```

    这样就可以在遇到错误的时候，跳过当前的 token 直到下一个分号或者右括号。例如输入 `(ID++)$`，其解析过程为：

    ![image.png](https://s2.loli.net/2025/04/13/KN5RJySxuTlMcFh.png){width="50%"}

简单地说，LR 分析器遇到错误状态时，采取以下动作：

1. pop stack 直到进入一个能够 shift error token 的状态
2. shift error token
3. 忽略输入，直到遇到一个在当前的 lookahead token 下能够执行 non-error 操作的状态
4. 恢复正常语法分析

需要注意的是，这里的 pop 操作可能导致一些正常语法分析不会出现的状况，尤其是语义动作会有副作用的情况。（解决方案是尽量避免使用副作用）

### Global Error Repair

Local 的错误修复可能遇到一些无法修复的问题。其根源在于只能修改当前的符号，而错误可能出现在更早的符号上。

??? example "举个例子"

    // TODO

Global 的错误修复可以找到最小的插入删除操作，使得输入的 token 序列能够被语法分析器接受。

例如 Burke-Fisher 算法：它会对报错位置前面最多 K 个符号，尝试所有可能的单符号插入替换等操作，使得语法正确。如何选择修复方式呢？如果这种修复在当前不会报错，且在修复之后还能再继续往后检查 R 个 token，那么就选择这种修复方式。这个 R 一般是 4。

值得注意的是，这种方式需要备份已经 parse 的 token，使用额外的 old stack 进行保存。