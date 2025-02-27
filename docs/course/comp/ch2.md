---
comments: true
---

# Lexical Analysis：词法分析

??? abstract "概述"
    编译器在编译语言的时候，先**拆分**并**理解结构与意义**，再**组装**成机器能够理解的代码。

    编译器的**前端**做分析（解析），**后端**做合成（生成）。“IR 生成”这一步把前后端分开。

    前端的分析一般分为：

    - Lexical Analysis：词法分析，把输入分解为 token；
    - Syntax Analysis：语法分析，解析程序的语法结构；
    - Semantic Analysis：语义分析，检查程序的语义；

    这一章讲词法分析。**词法分析器的任务是**：

    - 输入字符流
    - 输出 token 流（包含名称、关键字和标点符号等）
    - 忽略空白字符和注释
  
    **词法分析的接口是一个函数**（例如叫 `getToken()`），每次调用返回一个 token。

    我们使用形式化语言和工具来描述词法分析器，原因是：

    - 某些形式化方法在语法分析的时候也会用到；
    - 类似的工具在编译原理以外的领域也有用。
    
    <figure markdown="span">
    ``` mermaid
        graph TD
        A[Description of lexical tokens] -->|Manually| B[Regular Expressions];
        B -->|Thompson’s Construction| C[NFA];
        C -->|Subset Construction, DFA Minimization| D[DFA];
        D -->|e.g., Table-Driven Implementation| E[Lexical Analyzer];
    ```
    </figure>

## 词法单元

如何理解 lexical token？

- 一个字符序列
- 编程语言语法的一个单元

对一个编程语言中的 token，我们可以进行分类。

??? example "Token 举例"
    | Type | Examples |
    | ---- | -------- |
    | ID | `foo`, `bar`, `n14` |
    | NUM | `123`, `3` |
    | REAL | `3.14`, `0.1` |
    | IF | `if` |
    | COMMA | `,` |

    以此类推。

    举一个词法分析的例子：

    <figure markdown="span">
      ![lex](https://s2.loli.net/2025/02/26/kwTzLJhmoYHus7S.png){ width="600" }
    </figure>

    返回结果中有 token 的类型，且有些类型会带有语义值，例如标识符。

!!! warning "注意"
    大多数语言的关键字不作为标识符，例如 `if`。

    注释、空白字符、编译预处理指令、宏定义等不是 token。

    编译预处理的时候会消除 non-tokens。

构造词法分析器的第一步，是要描述源程序语言的词法规则。一种方式是用自然语言，另一种方式是用正则表达式。

而想要构造一个简单易读的词法分析器，我们的实现方式是：

- **正则表达式**：描述 token 的形式，易于理解而较难实现；
- **有限自动机**：实现正则表达式，易于实现；
- **数学形式化**：将上述二者结合起来。

## 正则表达式

### 正则表达式的定义

大部分内容在计算理论中已经讲过。

每个正则表达式代表着一系列字符串，可以用来描述 token 的形式。正则表达式 $r$ 就表达了一个语言 $L(r)$。

??? note "正则表达式的定义"
    正则表达式是一种递归定义，有两个基本的元素：
    
    - 单个字符：字母表中的任意一个字符，例如 $a$；
    - 空串：$\epsilon$。
    
    和三种操作：

    - Alternation：$r_1 \mid r_2$；
    - Concatenation：$r_1 \cdot r_2$；
    - Kleene Closure：$r^*$，克林闭包，代表 $r$ 的 0 或多次重复。
    
    有些写法中，连接符 $\cdot$ 和空串 $\epsilon$ 可以省略，且三种操作的优先级是闭包、连接、选择，也就是说：

    $ab | c$ 等价于 $(a \cdot b) | c$，而 $(a |)$ 等价于 $(a | \epsilon)$。

!!! tip "正则表达式的缩写"
    - [abcd] 等价于 (a|b|c|d)
    - [b-g] 等价于 [bcdefg]
    - [b-gM-Qkr] 等价于 [bcdefgMNOPQkr]
    - M? 等价于 (M|ε)
    - M+ 等价于 MM*
    
    需要注意的是这些缩写并没有扩大正则表达式的能力。

### 用正则表达式描述 token

有了这些定义与记号，我们就可以用正则表达式来描述 token 的形式，例如：

| Regular Expression | Description |
| ------------------ | ----------- |
| `if` | return token `IF` |
| `[a-z][a-z0-9]*` | return token `ID` |
| `[0-9]+` | return token `NUM` |
| `([0-9]+"."[0-9]*)|([0-9]*"."[0-9]+)` | return token `REAL` |
| `("--"[a-z]*"\n")|(" "|"\n"|"\t")+` | `/* do nothing */` |
| `.` | return token `ERROR` |

这里采用虎书的 Tiger 语言，注释是以 `--` 开头的，以及空白字符是空格、换行和制表符等，这些内容词法分析器**识别但不返回**。

需要注意的是，一个词法的描述应该是**完整的**，也就是说，对于任意输入，都应该有一个 token 与之对应。

### 消除歧义

注意到上面表格中的规则是有歧义的：对于字符流 `if8`，可以被解释为 `IF` 和 `ID` 两种 token；对于字符流 `if 89`，里面的 `if` 可以认作 `IF` 也可以认作 `ID` 的一部分。

为了消除歧义，这里使用了两个重要的法则：

1. **最长匹配（Longest Match）**：在有多个匹配的情况下，选择最长的那个；
2. **优先级（Rule Priority）**：在有多个匹配的情况下，选择表中靠上面的那个。

## 有限自动机

有限自动机的定义在计算理论中已经讲过，**这一节讨论的是 DFA，即确定性有限自动机**。

### 用 DFA 描述正则表达式

通过 DFA，我们可以来表示一个 token 的识别过程，如下图：

<figure markdown="span">
  ![image.png](https://s2.loli.net/2025/02/26/6MjpnABaiGIkPHw.png){ width="600" }
</figure>

然后我们可以手动地把多个不同 token 的 DFA 连接起来，形成一个大的 DFA，这个 DFA 就是词法分析器，如下图：

<figure markdown="span">
  ![image1.png](https://s2.loli.net/2025/02/26/B5q3Kwp1GTiLaDO.png){ width="600" }
</figure>

然后把不同的终态标记上对应的 token 即可。

注意到此时还是有歧义，例如状态 3 既是 `ID` 的终态也是 `IF` 的终态，这时候我们使用最长序列原则来解决，一会儿会讲到。

### 用转移矩阵编码 DFA

转移矩阵是一个描述 DFA 的状态转移的二维数组，如下图：

<figure markdown="span">
  ![mat.png](https://s2.loli.net/2025/02/26/wldNBSo9GDtabZp.png){ width="600" }
</figure>

其中，状态 0 代表 dead state，一旦进入就无法退出，可以用来描述缺少的 edge。

### 处理最长序列

对于歧义问题，只需要维护好两个变量：

- Last-Final
- Input-Position-at-Last-Final

每遇到一次终态，就更新这两个变量，往后走直到进入 dead state，此时就可以返回 Last-Final 对应的 token。

??? example "最长序列举例"
    <figure markdown="span">
      ![longest.png](https://s2.loli.net/2025/02/26/rEYNmqnulJOsoji.png){ width="600" }
    </figure>

## 非确定性有限自动机

NFA 的定义在计算理论中已经讲过。

### 将正则表达式转换为 NFA

回想正则表达式的定义：两个基本元素和三种操作。那么只需要把两个元素转换成 NFA，并把三个操作转换成 NFA 的操作即可让 NFA 表达所有的正则表达式。

具体内容在计算理论中已经讲过，如下图：

<figure markdown="span">
  ![nfa.png](https://s2.loli.net/2025/02/26/rEYNmqnulJOsoji.png){ width="600" }
</figure>

如此操作后，原来表示词法分析器的正则表达式就可以转换成 NFA，如下图：

<figure markdown="span">
  ![nfa1.png](https://s2.loli.net/2025/02/26/DKQ1PkvEeL6Wl53.png){ width="600" }
</figure>

由于 NFA 的不确定性，对于状态 1 来说只需要把不同正则表达式的 NFA 连接起来即可，而不再需要像 DFA 那样考虑逻辑关系并合并。

### 将 NFA 转换为 DFA

此部分为计算理论的重点内容。

转换的过程实际上是模拟了所有的可能性。这里定义了一个 $\epsilon$-closure 函数，用来描述从一个状态出发，通过 $\epsilon$ 边到达的所有状态（当然也包括自己）。

假设初始状态为 $s_1$，输入序列为 $c_1, c_2, \cdots, c_k$，那么模拟的过程就可以表示为：

```plaintext title="NFA 模拟 DFA"
d = closure({s1})
for i = 1 to k
    d = closure(DFAedge(d, c_i))
```

由于一步一步对源程序每个字符做这种模拟比较繁琐，可以提前把所有可能涉及到的状态都列出来，然后用一个表格来表示状态转移。

新的自动机的状态是原来 NFA 状态集合的子集，而转移函数是对每个状态集合的每个输入字符都做一次转移。可以证明这个新的自动机是一个 DFA。

整个的转换流程如下：

```pseudo title="NFA 转换 DFA"
states[0] = {}; states[1] = closure({s1});
p = 1; j = 0;
while j <= p
    for each c in Σ
        e = DFAedge(states[j], c);
        if e = states[i] for some i <= p
            then trans[j, c] = i;
            else p = p + 1;
                 states[p] = e;
                 trans[j, c] = p;
    j = j + 1;
```

DFA 的某个状态集合中只要有一个是 NFA 的终态，那么这个状态集合就是 DFA 的终态；如果有多个，采用 Rule Priority。

转换完成以后，states 可能就不需要了，留下 trans 矩阵用作词法分析。

### DFA 的最小化

得到的 DFA 有可能不是最简，需要最小化。核心是**找到并合并等价状态**。

!!! note "等价状态的定义"
    **The machine starting in s1 accepts a string σ if and only if starting in s2 it accepts σ.**

    还可以给出一个等价状态的充分不必要条件：

    - 两个状态要么都是终态，要么都不是；
    - 且对任意的输入字符，两个状态的转移状态也是等价的。
    
    关于为什么不是必要条件：

    <figure markdown="span">
      ![image4.png](https://s2.loli.net/2025/02/26/MGYqnIkLcpBmEe9.png){ width="250" }
    </figure>

    此图中的状态 2 和 4 就是一个例子。

为了找到等价状态，引入一个**可区分状态**（distinguishable state）的概念：

!!! note "可区分状态的定义"
    如果状态 s 和 t 在接受字符串 x 后的两个最终状态中，有且仅有一个是 final states，那么 s 和 t 是可区分的，并说**字符串 x 可区分状态 s 和 t**。

    两个状态只要存在一个可区分的字符串，那么这两个状态就是可区分的。

**DFA 最小化算法**（来自龙书）就是利用可区分状态来进行合并的：

- 迭代地把可区分集合分割到不同的组
  - Base Case：$\epsilon$ 可以区分任何两个终态和非终态
  - 递推：如果 s 和 t 可区分，并且 s' 和 t' 各自有一条标号为 a 的边到 s 和 t，那么 s' 和 t' 也是可区分的
- 如果两个状态无法区分，那么说明等价
  - 所有的 dead states 都是等价的
- 每个等价组选一个代表来表示 DFA

形式化表示一下，就是：

1. 初始分割为 $\Pi = \{S - F, F\}$；
2. 走如下算法：
```pseudo
let Pi_new = Pi
for each group G in Pi {
    partition G into subgroups(if s and t have transitions to states in the same group in Pi, then they are in the same subgroup)
    replace G in Pi_new with the subgroups
}
```
3. 重复 2 直到 $\Pi = \Pi_{new}$。
4. 选择 $\Pi_{\text{final}}$ 中的一个状态作为代表，这个就是最小化的 DFA。

!!! warning "区分不同的 token"
    如果初始只区分终态和非终态，我们可能把不同 token 对应的终态合并。解决方法是在算法的第一步就直接分为 $\{S - F, F_1, F_2, \cdots\}$，对应不同的 token。

## Lex：一个词法分析器

Lex 采用表驱动，对于 C 语言源码生成的 token 函数叫做 `yylex()`，返回一个 token。

输入词法规则，输出一个词法分析器的程序源码。

最常见的 Lex 版本是 Flex。

??? example "Lex 词法规则输入举例"
    <figure markdown="span">
      ![lex1.png](https://s2.loli.net/2025/02/27/VthWHroABRU2faI.png){ width="600" }
    </figure>

    这里用 `%%` 区分了三部分：

    - 第一部分是定义。`%{` 和 `%}` 之间的内容是可能会用到的 C 代码；后面的内容就是 token 的定义；
    - 第二部分是规则。每一行是一个规则，左边是正则表达式，右边是对应的 C 代码，也就是解析到这个 token 时要执行的代码；
    - 第三部分是用户代码，包含第二部分用到但是还没有定义的函数。