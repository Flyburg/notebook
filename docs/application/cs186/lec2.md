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

## 