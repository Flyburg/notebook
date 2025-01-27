---
comments: true
---

# Lecture 5: Binomial Queue

二项堆。

## 1 Definition
A binomial queue is not a heap-ordered tree, but rather a collection of heap-ordered trees, known as a forest. Each heap-ordered tree is a binomial tree.

二项堆是一群二叉堆构成的森林。每一个二叉树有固定的形状。

一个单位叫 Binomial Tree，一个节点的 Binomial Tree 的高度为 0，记作 $B_0$。$B_k$ 为高度是 $k$ 的二叉树，**将两个 $B_{k-1}$ 的树连接在一起**就可以，如下图：

<img src="https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/20240330192721.png" alt="image-20240330192721" style="zoom:67%;" />

!!!info "注意"
    $B_k$ consists of a root with $k$ children, which are $B_0$, $B_1$, ..., $B_{k-1}$. $B_k$ has exactly $2^k$ nodes. The number of nodes at depth $d$ is $C_k^d$.

二项堆的名字由此而来。注意到，每一个十进制正整数都有唯一的二进制表示法，所以某一种节点数量的二项堆是确定的。

<img src="https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/20240330194946.png" alt="image-20240330194946" style="zoom:67%;" />

## 2 Operation

* **FindMin**: 扫描所有的树根。$T_p=O(logN)$.
* **Merge**: 和二进制加法类似。
  <img src="https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/20240330205517.png" alt="image-20240330205517" style="zoom:67%;" />
  
  注意 attach 的时候把大的接到小的上面以维持最小堆特性。而且要把森林里的树按照高度逆序排序。

* **Insert**: 是合并的一种特殊情况。不多说。

!!! note "空二项堆插入"
    If the smallest nonexistent binomial tree is $B_i$, then $T_p=Const*(i+1)$.

    在空二项堆里面插入 $N$ 个元素的最坏时间复杂度为 $O(N)$，平均的单步用时是**常数**。

* **DeleteMin**: 见下图。
  ![20240330220835](https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/20240330220835.png)

## 3 Implementations

实现方式是构建二叉树构成的数组。

由于需要快速找到子树，这里使用 First Child Next Sibling 的链表存储方式。

```c
typedef struct BinNode *Position;
typedef struct Collection *BinQueue;
typedef struct BinNode *BinTree;  /* missing from p.176 */

struct BinNode 
{ 
    ElementType	    Element;
    Position	    LeftChild;
    Position 	    NextSibling;
} ;

struct Collection 
{ 
    int	    	CurrentSize;  /* total number of nodes */
    BinTree	TheTrees[ MaxTrees ];
} ;

BinTree CombineTrees( BinTree T1, BinTree T2 )
{  /* merge equal-sized T1 and T2 */
    if ( T1->Element > T2->Element )
        /* attach the larger one to the smaller one */
        return CombineTrees( T2, T1 );
    /* insert T2 to the front of the children list of T1 */
    T2->NextSibling = T1->LeftChild;
    T1->LeftChild = T2;
    return T1;
}// combine 操作时间复杂度为 O(1)

BinQueue  Merge( BinQueue H1, BinQueue H2 )
{	
    BinTree T1, T2, Carry = NULL; 	
    int i, j;
    if ( H1->CurrentSize + H2-> CurrentSize > Capacity )  ErrorMessage();
    H1->CurrentSize += H2-> CurrentSize;
    for ( i=0, j=1; j<= H1->CurrentSize; i++, j*=2 ) {
        T1 = H1->TheTrees[i]; T2 = H2->TheTrees[i]; /*current trees */
        switch( 4*!!Carry + 2*!!T2 + !!T1 ) { 
        case 0: /* 000 */ ;
        case 1: /* 001 */  break;	
        case 2: /* 010 */  H1->TheTrees[i] = T2; H2->TheTrees[i] = NULL; break;
        case 4: /* 100 */  H1->TheTrees[i] = Carry; Carry = NULL; break;
        case 3: /* 011 */  Carry = CombineTrees( T1, T2 );
                        H1->TheTrees[i] = H2->TheTrees[i] = NULL; break;
        case 5: /* 101 */  Carry = CombineTrees( T1, Carry );
                        H1->TheTrees[i] = NULL; break;
        case 6: /* 110 */  Carry = CombineTrees( T2, Carry );
                        H2->TheTrees[i] = NULL; break;
        case 7: /* 111 */  H1->TheTrees[i] = Carry; 
                        Carry = CombineTrees( T1, T2 ); 
                        H2->TheTrees[i] = NULL; break;
        } /* end switch */
    } /* end for-loop */
    return H1;
}

ElementType  DeleteMin( BinQueue H )
{	
    BinQueue DeletedQueue; 
    Position DeletedTree, OldRoot;
    ElementType MinItem = Infinity;  /* the minimum item to be returned */	
    int i, j, MinTree; /* MinTree is the index of the tree with the minimum item */

    if ( IsEmpty( H ) )  {  PrintErrorMessage();  return –Infinity; }

    for ( i = 0; i < MaxTrees; i++) {  /* Step 1: find the minimum item */
        if( H->TheTrees[i] && H->TheTrees[i]->Element < MinItem ) { 
        MinItem = H->TheTrees[i]->Element;  MinTree = i;    } /* end if */
    } /* end for-i-loop */
    DeletedTree = H->TheTrees[ MinTree ];  
    H->TheTrees[ MinTree ] = NULL;   /* Step 2: remove the MinTree from H => H’ */ 
    OldRoot = DeletedTree;   /* Step 3.1: remove the root */ 
    DeletedTree = DeletedTree->LeftChild;   free(OldRoot);
    DeletedQueue = Initialize();   /* Step 3.2: create H” */ 
    DeletedQueue->CurrentSize = ( 1<<MinTree ) – 1;  /* 2MinTree – 1 */
    for ( j = MinTree – 1; j >= 0; j – – ) {  
        DeletedQueue->TheTrees[j] = DeletedTree;
        DeletedTree = DeletedTree->NextSibling;
        DeletedQueue->TheTrees[j]->NextSibling = NULL;
    } /* end for-j-loop */
    H->CurrentSize  – = DeletedQueue->CurrentSize + 1;
    H = Merge( H, DeletedQueue ); /* Step 4: merge H’ and H” */ 
    return MinItem;
}
```

## 4 Analysis

A binomial queue of $N$ elements can be built by $N$ successive insertions in $O(N)$.

<img src="https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/20240330220357.png" alt="20240330220357" style="zoom:67%;" />

<img src="https://cdn.jsdelivr.net/gh/Frankoxer/image-host/pic/20240330220415.png" alt="20240330220415" style="zoom:67%;" />