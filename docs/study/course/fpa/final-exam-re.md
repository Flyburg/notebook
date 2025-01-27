---
comments: true
---

# 程序设计与算法基础

这里是笔者修读浙江大学 2022-2023 秋冬学期《程序设计与算法基础》课程的期末考试开卷资料整理。

教师：翁恺

## 算术问题

??? note "Euclid's 最大公约数：循环"

    ```c
    while(1)
    {
        int r=a%b;
        a=b;
        b=r;
    }
    ```

??? note "Euclid's 最大公约数：递归"

    ```c
    int gcd(int x,int y)
    {
        if(y==0)
            return x;
        return gcd(y,x%y);
    }
    ```

??? note "杨辉三角"

    ```c
    int main(void)
    {
        int n;
        scanf("%d",&n);
        for(int i=0;i<=n;i++)
        {
            for(int j=0;j<=i;j++)
            {
                printf("%9d",Yang(i,j));
            }
            printf("\n");
        }
    }

    int Yang (int a,int b)
    {
        if(b==a||b==0)
            return 1;
        else
            return Yang(a-1,b-1)+Yang(a-1,b);
    }
    ```

??? note "快速幂：MOD"

    ```c
    int Power(int N, int k)
    {
        N%=MOD;
        int res=1;
        while(k)
        {
            if(k%2)
            {
                res*=N;
                res%=MOD;
            }
            N*=N;
            N%=MOD;
            k/=2;
        }
        return res;
    }
    ```

## 递归

??? note "汉诺塔"

    ```c
    int main(void)
    {
        char a, b, c;
        int n;
        scanf("%d %c %c %c", &n, &a, &b, &c);
        func(n, a, b, c);
        return 0;
    }

    void func(int n, char first, char target, char pro)
    {
        if (n > 0)
        {
            func(n - 1, first, pro, target); 
            printf("%d: %c -> %c\n", n, first, target);
            func(n - 1, pro, target, first);
        }
    }
    ```

??? note "快速幂：迭代"

    ```c
    int power(int x, int n)
    {
        int res=1;// 结果从1开始
        while(n)
        {
            if(n%2)// 最后一位为1，就需要把当前的幂乘到结果中
            {
                res*=x;
            }
            x*=x;// 一直累乘
            n/=2;// 去掉最后一位
        }
    }
    ```

??? note "快速幂：递归"

    ```c
    int power(int x, int n)
    {
        if(n==0)
            return 1;
        else if(n%2==1)
            return x*power(x,n-1);
        else
        {
            int t=power(x,n/2);
            return t*t;
        }
    }
    ```

## 数组与哈希

??? note "Least Prefix"

    ```c
    #include <stdio.h>
    int main()
    {
        int hash[100000]={0};// create hash array
        int n;
        scanf("%d",&n);
        int a[n];
        
        for(int i=0;i<n;i++)
        {
            scanf("%d",&a[i]);// record the number
        }
        
        int res;// least prefix
        for(int i=0;i<n;i++)
        {
            if(hash[a[i]]==0)
            {
                hash[a[i]]==1;
                res=i;
            }
        }
        
        printf("%d",res);
    }
    ```

??? note "简单哈希排序"

    ```c
    #include <stdio.h>
    int main()
    {
        int hash[100000]={0};
        int n;
        scanf("%d",&n);
        
        for(int i=0;i<n;i++)
        {
            int temp;
            scanf("%d",&temp);
            hash[temp]++;
        }
        
        for(int i=0;i<100000;i++)
        {
            if(hash[i])
            {
                for(int j=0;j<hash[i];j++)
                {
                    printf("%d ",i);
                }
            }
        }
    }
    ```

## 栈和队列

??? note "栈操作"

    ```c
    #include <stdio.h>
    int main()
    {
        int n;
        int x;
        scanf("%d",&n);
        int a[20003]={0};
        int p=0;
        int q=0;
        for(int i=1;i<=n;i++)
        {
            scanf("%d",&x);
            if(x==1)
            {
                scanf("%d",&a[++p]);
                q=p;
            }
            if(x==0)
            {
                if(p==0)
                    printf("invalid\n");
                else
                    printf("%d\n",a[p--]);
            }
        }
    }
    ```

??? note "队列操作"

    ```c
    #include <stdio.h>
    int main()
    {
        int n;
        int x,y,p,q;
        scanf("%d",&n);
        int a[20001]={0};
        p=0;
        q=0;
        for (int i=0;i<n;i++)
        {
            scanf("%d",&x);
            if(x==1)
            {
                scanf("%d",&y);
                a[p++]=y;
            }
            else 
            {
                if(p==q)
                    printf("invalid\n");
                if(p!=q)
                    printf("%d\n",a[q++]);
            }
        }
    }
    ```

??? note "有效栈序列"

    ```c
    for(int i=0;i<n;i++)
    {
        if(a[i]>m+i)// m为栈容量
            index=0;
    }

    for(int i=0;i<n-2;i++)
    {
        if(a[i]>a[i+2]&&a[i+2]>a[i+1])
            index=0;
    }
    ```

## 二分搜索

??? note "二分搜索"

    ```c
    int search(int key, int a[], int begin, int end)
    {
        int ret=-1;
        if(begin<end)
        {
            int mid=(begin+end)/2;
            if(key<a[mid])
                ret=search(key, a, begin, mid-1);
            else if(key>a[mid])
                ret=search(key, a, mid+1, end);
            else
                ret=mid;
        }
        else
            printf("FAILED\n");
        return ret;
    }
    ```

## 排序

??? note "选择排序"

    ```c
    void selection_sort(int a[], int n)
    {
        for(int i=0;i<n-1;i++)
        {
            int index=i;
            for(int j=i;j<n;j++)
            {
                if(a[index]>a[j])
                    index=j;
            }
            int temp=a[index];
            a[index]=a[i];
            a[i]=temp;
        }
    }
    ```

??? note "冒泡排序"


    ```c
    void bubble_sort(int a[], int n)
    {
        for(int i=n-1;i>0;i--)
        {
            for(int j=0;j<i;j++)
            {
                if(a[j]>a[j+1])
                {
                    int temp=a[j];
                    a[j]=a[j+1];
                    a[j+1]=temp;
                }
            }
        }
    }
    ```

??? note "插入排序"

    ```c
    void insertionSort(int arr[], int n)
    {
        for(int i=1;i<n;i++)
        {
            int ele=arr[i];
            int j=i-1;
            while(j>=0&&ele<arr[j])
            {
                arr[j+1]=arr[j];
                j--;
                arr[j+1]=ele;
            }
        }
    }
    ```

??? note "归并排序"

    ```c
    void MergeSort(int a[], int lo, int hi)
    {
        int md;
        if (lo < hi)
        {
            md = (lo + hi) / 2;
            MergeSort(a, lo, md);
            MergeSort(a, md + 1, hi);
            merge(a, lo, md, hi);
        }
    }

    void merge(int a[], int lo, int md, int hi)
    {
        int i = lo, j = md + 1, k = lo;
        int b[MAXN + 3];
        
        while (k < hi)
        {
            if (i <= md && j <= hi)
            {
                if (a[i] <= a[j])
                    b[k++] = a[i++];
                else
                    b[k++] = a[j++];
            }
            else
                break;
        }
        
        while (i <= md)
            b[k++] = a[i++];
        while (j <= hi)
            b[k++] = a[j++];

        for (k = lo; k <= hi; k++)
            a[k] = b[k];
    }
    ```

??? note "快速排序：Lomuto"

    ```c
    void quicksort_lomuto(int a[], int low, int high)
    {
        int pivot;
        if(low<high)
        {
            pivot=partition(a, low, high);
            quicksort_lomuto(a, low, pivot-1);
            quicksort_lomuto(a, pivot+1, high);
        }
    }

    int partition(int a[], int low, int high)
    {
        int pi=a[high];
        int i=low;
        for(int j=low;j<=high;j++)
        {
            if(a[j]<pi)
            {
                int t=a[i];
                a[i]=a[j];
                a[j]=t;
                i++;
            }
        }
        int k=a[i];
        a[i]=a[high];
        a[high]=k;
        
        return i;
    }
    ```

??? note "快速排序：Hoare"
    ```c
    void quicksort_hoare(int a[], int low, int high)
    {
        int pivot;
        if(low<high)
        {
            pivot=partition(a, low, high);
            quicksort_hoare(a, low, pivot-1);
            quicksort_hoare(a, pivot+1, high);
        }
    }

    int partition(int a[], int low, int high)
    {
        int pi=a[low+(high-low)/2];
        int i=low-1;
        int j=high+1;
        while(1)
        {
            do{
                i++;
            }while(a[i]<pi);
            do{
                j--;
            }while(a[j]>pi);
            
            if(i<=j)
                return j;
            int t=a[i];
            a[i]=a[j];
            a[j]=t;
        }
    }
    ```

??? note "qsort 用法"

    ```c
    #include <stdlib.h>
    void qsort(void *base, size_t nel, size_t width, int (*compar) (const void *, const void *));
    ```

## 字符串

??? note "字符串操作"

    ```c
    #include <string.h>

    size_t strlen(const char *s);
    int strcmp(const char *s1, const char *s2);
    char *strcpy(char *restrict dst, const char *restrict src);
    char *strcat(char *restrict s1, const char *restrict s2);
    ```

??? note "字符串操作实现"

    ```c
    int mylen(const char *s)
    {
        int cnt=0;
        while(s[cnt])
        {
            cnt++;
        }
        return cnt;
    }

    int mycmp(const char *s1, const char *s2)
    {
        while( *s1==*s2 && *s1!='\0' )
        {
            s1++;
            s2++;
        }
        return *s1-*s2;
    }

    char *mycpy(char *restrict dst, const char *restrict src)
    {
        int idx=0;
        while(src[idx])
        {
            dst[idx++]=src[idx++];
        }
        dst[idx]='\0';
        return dst;
    }

    char *mycat(char *restrict s1, const char *restrict s2)
    {
        //调用mycpy即可
    }
    ```

??? note "高精度加法"

    ```c
    #include <stdio.h>
    #include <string.h>

    int main()
    {
        char a[101],b[101],res[101];
        scanf("%s",a);
        scanf("%s",b);
        int len=strlen(a)>strlen(b)?  strlen(a):strlen(b);
        int up=0;
        
        for(int i=0;i<len;i++)
        {
            int aelem,belem;
            if(i<strlen(a))
                aelem=a[strlen(a)-i-1]-'0';
            else
                aelem=0;
            
            if(i<strlen(b))
                belem=b[strlen(b)-i-1]-'0';
            else
                belem=0;
            
            int add=aelem+belem;
            
            res[i]=add%10+up;
            up=add/10;
        }
        
        if(up)
            printf("1");
        for(int i=len-1;i>=0;i--)
            printf("%d",res[i]);
    }
    ```


## 链表

??? note "单链表"

    ```c
    #include <stdio.h>
    #include <stdlib.h>

    typedef struct _node
    {
        int value;
        struct _node *next;
    } Node;

    typedef struct
    {
        Node *head;
        Node *tail;
    } List;

    List list_create()
    {
        List list = {NULL, NULL};
        return list;
    }

    void list_free(List *list)
    {
        for(Node *p=list->head;p;)
        {
            Node *q=p->next;
            free(p);
            p=q;
        }
        list->head=list->tail=NULL;
    }

    void list_append(List *list, int v)
    {
        Node *p = (Node *)malloc(sizeof(Node));
        p->value = v;
        p->next = NULL;
        if (list->tail)
        {
            list->tail->next = p;
            list->tail = p;
        }
        else
        {
            list->head = list->tail = p;
        }
    }

    void list_insert(List *list, int v)
    {
        Node *p = (Node *)malloc(sizeof(Node));
        p->value = v;
        p->next = list->head;
        list->head = p;
        if (list->tail == NULL)
        {
            list->tail = p;
        }
    }

    int list_find(List *list, int v)
    {
        int cnt = 0;
        Node *p = list->head;
        while (p)
        {
            if (p->value == v)
            {
                return cnt;
            }
            cnt++;
            p = p->next;
        }
        return -1;
    }

    void list_remove(List *list, int v)
    {
        for (Node *p = list->head, *q = NULL; p;)
        {
            if (p->value == v)
            {
                Node *r = p->next;
                if (q)
                {
                    q->next = p->next;
                }
                else
                {
                    list->head = p->next;
                }
                if (p == list->tail)
                {
                    list->tail = q;
                }
                free(p);
                p = r;
            }
            else
            {
                q = p;
                p = p->next;
            }
        }
    }
    ```

??? note "双头双向链表"

    ```c
    typedef struct _Node {
        int value;
        struct _Node *next;
        struct _Node *prev;
    } Node;

    typedef struct {
        Node *head;
        Node *tail;
    } List;

    void list_print(List *list)
    {
        for ( Node *p = list->head; p; p=p->next ) {
            printf("%d ", p->value);
        }
        printf("\n");
    }

    void list_clear(List *list)
    {
        for ( Node *p = list->head, *q; p; p=q ) {
            q = p->next;
            free(p);
        }
    }

    void list_append(List *list, int value)
    {
        Node *p = (Node *)malloc(sizeof(Node));
        p->value = value;
        if (list->tail)
        {
            p->prev = list->tail;
            list->tail->next = p;
            list->tail = p;
            p->next = NULL;
        }
        else
        {
            list->tail = list->head = p;
            p->next = p->prev = NULL;
        }
    }

    void list_remove(List *list, int value)
    {
        for (Node *p = list->head; p;)
        {
            if (p->value == value)
            {
                Node *n = p->next;
                if (p->prev)
                    p->prev->next = p->next;
                else
                    list->head = p->next;

                if (p->next)
                    p->next->prev = p->prev;
                else
                    list->tail = p->prev;
                
                free(p);
                p = n;
            }
            else
                p = p->next;
        }
    }
    ```