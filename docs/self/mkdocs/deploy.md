---
comments: true
---

# 将网站部署到 GitHub Pages

这是构建网站的第二步，其目的是通过 GitHub Pages 将网站部署到互联网上，让网站**能被别人看见**。

## 准备 GitHub 仓库

首先要有一个 GitHub 账号，没有的自行搜索注册。

接着需要创建一个空仓库：

- 如果你打算只用一个仓库来存放网站源文件（也就是只有一个网站），那么仓库名应该是 `username.github.io`，其中 `username` 是你的 GitHub 用户名，这样就可以通过 `https://username.github.io` 来访问你的网站；
- 如果你打算有多个网站（比如笔者，一个是笔记本一个是博客），那么仓库名可以随意，但是需要在仓库的 `Settings` -> `Pages` 中进行一些设置，详情可以参考这篇文章：[如何拥有多个GitHub Pages](https://zhuanlan.zhihu.com/p/183977963)。这样设置后，需要通过 `https://username.github.io/repo-name` 来访问你的网站。

!!! warning "注意"
    注册完之后，需要进行设置，让一会儿的 GitHub Actions 拥有权限来操作这个仓库。在 GitHub 仓库的 `Settings` -> `Actions` -> `General` 中的最下方 “Workflow permissions” 选项修改为 “Read and write permissions” 并保存。

## 部署网站

### Git 环境设置

终端先进入网站根目录，然后执行：

```bash
git init
git branch -M main
git remote add origin https://github.com/username/repo-name.git
```

让 Git 管理这个文件夹，并且将默认分支改为 `main`，然后将这个文件夹与 GitHub 仓库关联。

### 自动部署命令

我们每次有新内容 push 到 GitHub 仓库后，都需要手动执行 `mkdocs gh-deploy` 命令来部署网站，这样显然不够方便。为此我们利用 GitHub Actions 来实现自动部署。

终端在网站根目录执行：

```bash
mkdir .github
cd .github
mkdir workflows
cd workflows
```

然后创建一个名为 `PublishMySite.yml` 的文件，内容如下：

```yaml
name: publish site
on:             # 工作流的触发条件
  push:         # 一种是本地 push 的时候
    branches:
      - main    # 只有在 main 分支 push 时才触发
  pull_request: # 另一种是 PR 合并时
    branches:
      - main
jobs:           # 工作流的具体内容
  deploy:
    runs-on: ubuntu-latest              # 创建一个新的云端虚拟机 使用最新 Ubuntu 系统
    steps:
      - uses: actions/checkout@v2       # 先 checkout 到 main 分支
      - uses: actions/setup-python@v2   # 再安装 Python3 和相关环境
        with:
          python-version: 3.x
      - run: pip install mkdocs-material # 使用 pip 包管理工具安装 mkdocs-material
      - run: mkdocs gh-deploy --force   # 使用 mkdocs-material 部署 gh-pages 分支
```

这个脚本文件实际上就是在操作“服务器”进行自动部署，当我们 push 代码到 GitHub 仓库的 `main` 分支时，GitHub Actions 会自动执行这个脚本，将网站部署到 GitHub Pages 上。

编辑好之后，网站的文件结构应该是这样的：

```plaintext
.
├── .github
│   └── workflows
│       └── PublishMySite.yml
├── docs
│   └── index.md
└── mkdocs.yml
```

其中 `docs` 文件夹里面是你自己的 Markdown 文件，也许不止一个。

### 提交并推送

当做完你的网站内容时，执行：

```bash
git add .  # 添加所有文件到暂存区
git commit -m "Initial commit"  # 提交到本地仓库，引号内是提交信息
git push -u origin main  # 推送到远程仓库
```

push 完之后，可以进入 GitHub 仓库的 Actions 版块查看部署进度。如果发生错误，可以在 Actions 的日志中查看详细信息，你的邮箱也会收到错误信息。

## 大功告成

一切正常的话，你的网站应该已经部署到了 GitHub Pages 上，可以通过 `https://username.github.io` 或者 `https://username.github.io/repo-name` 来访问你的网站了。