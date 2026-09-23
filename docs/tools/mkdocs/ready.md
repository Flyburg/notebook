---
comments: true
---

# 简介与准备工作

## 简介

为了搭建我们的笔记本，我们需要哪些东西？

- 把我们的文档从写好的 Markdown 格式转为网页格式的工具，让网站**能被自己看见**；
- 把这个静态网站部署到互联网上的工具，让网站**能被别人看见**。

### 网站生成

对于前者，我们的选择是 MkDocs + Material for MkDocs。MkDocs 是一个基于 Python 的静态网站生成器，详情见 [MkDocs 官网](https://www.mkdocs.org)。

实际上，生成静态网站的工具远不止 MkDocs 一家，还有诸如 mdBook、Hugo 等等，本文以 MkDocs 为例，对整套流程熟悉之后，再尝试其他工具也会更加容易。

!!! note "为什么选择 MkDocs"
    笔者认为作为一个笔记本来说，最重要的是排版**简洁**和**清晰**，并且**易于维护**。在实操之后，读者会发现 MkDocs 的上手非常容易，而且对于新文档的添加与网站的维护非常简单和便捷。同时笔者认为笔记本不应该具有太多的花哨的效果，而是应该更加注重内容本身。

你也许会发现 MkDocs 官网的样式似乎有些简陋，与本站不同。因为本站还用了最著名的 MkDocs 主题 Material for MkDocs。

详情见 [Material for MkDocs 官网](https://squidfunk.github.io/mkdocs-material/)，本教程的大多数内容也是参考这个主题的文档，请读者**务必以 Material for MkDocs 的文档为准**。

### 网站部署

对于后者，我们需要一个“服务器”，来将我们的网站内容展示给用户。这个“服务器”，我们选择了使用 GitHub 来托管网站源文件，并使用 GitHub Pages 来部署网站。

GitHub 的作用不必多说，作为全球最大的代码托管平台，它提供了免费的静态网站托管服务 GitHub Pages。详情见 [GitHub Pages 官网](https://pages.github.com)。

!!! info "服务器的选择"
    实际上，GitHub Pages 并不是唯一的选择，还有诸如 GitLab Pages、Vercel、Netlify 等等，这些服务都提供了免费的静态网站托管服务，甚至这些服务在速度上可能还会更快。本教程选择 GitHub Pages 的原因是足够简单，因为网站代码本身就托管在 GitHub 上，所以直接使用 GitHub Pages 部署更加方便。

这是一个非常简单且零成本的部署方式，只需要一个 GitHub 账号，就可以免费部署一个甚至多个静态网站，还可以绑定自己的域名（如本站）。

## 准备工作

### 环境

虽然本文标题为《我的 MkDocs 笔记本》，但是实际上本站的建立离不开以下工具和技术：

- Python：MkDocs 是基于 Python 的一个工具，所以需要安装 Python 环境；
- **Git**：本站的源码托管在 GitHub 上，且网站的“服务器”实际上是 GitHub Pages，所以需要安装 Git，并有一个 GitHub 账号；
- Markdown：MkDocs 是基于 Markdown 的，所以需要对 Markdown 有一定的了解；
- **MkDocs**：本站的生成工具，需要安装 MkDocs；
- **Material for MkDocs**：本站的主题，需要安装 Material for MkDocs；

### 基础知识

你需要有：

- 一定的 Markdown 语法基础；
- 一定的命令行操作能力；
- 一定的 Git 使用经验 ~~（没有也行）~~；
- 一些 HTML、CSS、JavaScript 基础知识（针对想 DIY 主题的用户）；

笔者正在使用 MacBook，所以相关操作除非特殊声明，否则都是基于 macOS 系统的。Linux/Windows 用户请自行替换相应命令（实际上主要是命令行操作的小差异，其他内容基本一致）。

!!! warning "注意"
    对于本教程每一步涉及到的操作和命令，请读者先理解为什么这样做再执行，不要盲目复制粘贴，否则可能会出现一些问题。