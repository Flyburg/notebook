---
comments: true
---

# Lecture 2: SQL Ⅰ

## SQL 简介

Structured Query Language, SQL.

最早销售 SQL 数据库的公司是 Oracle，随后是 IBM。

SQL 具有超过 40 多年的历史，然而近些年频频被质疑与挑战：

- 90 年代：面向对象的数据库
- 2000's：XML
- 2010's：NoSQL & MapReduce

然而 SQL 仍然是业界大部分领域的标准，虽然不完美但是仍然适用。

## SQL 的特性

- Declarative 声明式语言：what you want，而不是 how to get it
- 被广泛实现，包括不同的设备与规模
- 受限的语言，不是一个全面完整的编程语言
- 通用且功能丰富，并且有较强的扩展性（可以在不同的编程语言中调用）

## 常用术语

- Database
- Relation(Table):
    - Schema: metadata
    - Instance: set of data
- Attribute(Column, Field)
- Tuple(Record, Row)

需要注意的是 schema 一般是 fixed，具有唯一的属性名，并且每一个属性都是 atomic 的。然而 instance 是一个多集，也就是允许重复项。

## DDL 与 DML

SQL 包含两个 sublanguage：
- DDL：Data Definition Language
- DML：Data Manipulation Language

RDBMS（关系型数据库管理系统）负责选择并执行算法以得到 query 的结果。**任何给定时刻，算法的选择不应该影响查询结果。**

## DDL

在 SQL 中，使用 `CREATE TABLE` 创建一张表。具体的语法不再赘述，需要注意的是：
- Primary Key：主键具有唯一性约束，并且主键可以由多个 attributes 组成。
- Foreign Key：外键 reference 的是被引用表的 pk。

## DML

### SELECT

- `distinct` 去重
- `order by` 排序，可以自定义顺序
- `limit x` 只输出前 x 个结果，和 order 一块用

此外还可以使用一系列聚合函数，来查看有关查询结果的一些信息，例如平均值、最大最小值、计数、求和等。

- `group by` 按照属性进行分组，然后可以查看聚合函数在不同 group 下的结果
- `having` 按照规则过滤一些组

`distinct` 用在不同的位置会有不同的结果，需要注意对应的意思。