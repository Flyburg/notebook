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