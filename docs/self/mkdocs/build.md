---
comments: true
---

# 使用 MkDocs 本地构建网站

这是构建网站的第一步，其目的是让 MkDocs 把文档渲染成网页**能被自己看见**。

## 环境准备

### Git 环境

macOS 应该是自带的，Windows 用户可以从 [Git 官网](https://git-scm.com) 下载安装包安装，网上有很多教程，这里不再赘述。

!!! info "Git Bash"
    Windows 用户安装 Git 时，可以选择安装 Git Bash，安装好之后可以使用 Git Bash 来执行命令，这里面可以用一些常用的 Linux 命令，比如 `ls`、`cd` 等等（当然现在的 Terminal 也支持了）。

如果你有 GitHub 账户，记得设置好用户名和邮箱：

```bash
git config --global user.name "Your Name"
git config --global user.email "xxxxxx@xxxxx.com"
```

### Python 环境

对于 Linux/macOS 用户，可以选择自己习惯的包管理器安装 Python，如：

```bash
brew install python
```

对于 Windows 用户，可以直接从 [Python 官网](https://www.python.org) 下载安装包，安装时**务必勾选**“Add Python to PATH”。相关的教程在网上非常多，大家自行搜索，最终效果是在终端中输入 `python --version` 和 `pip --version` 后能够看到版本号即可。

### MkDocs 环境

直接安装 Material for MkDocs 即可，它会自动安装 MkDocs：

```bash
pip install mkdocs-material
```

除了 pip 之外，还可以通过 docker 和 git 安装，详情见 [Material for MkDocs 官网](https://squidfunk.github.io/mkdocs-material/getting-started/#installation)，这里不再赘述。

最终安装的效果是在终端中输入 `mkdocs --version` 后能够看到版本号即可。

## 初始化并运行 MkDocs 项目

终端进入到你想要存放 MkDocs 项目的目录，然后执行：

```bash
mkdocs new site
```

其中 `site` 是项目的名称，可以自定义，这个命令会在当前目录下创建一个名为 `site` 的文件夹。进入 `site` 文件夹，里面包含 MkDocs 项目的基本结构：

```plaintext
.
├── docs
│   └── index.md
└── mkdocs.yml
```

`docs` 文件夹是存放 Markdown 文件的地方，`mkdocs.yml` 是 MkDocs 的配置文件，这两个文件是 MkDocs 项目的基础。

在此目录下输入：

```bash
mkdocs serve
```

你可以看到命令行输出：

```plaintext
❯ mkdocs serve
INFO    -  Building documentation...
INFO    -  Cleaning site directory
INFO    -  Documentation built in 0.03 seconds
INFO    -  [11:09:37] Watching paths for changes: 'docs', 'mkdocs.yml'
INFO    -  [11:09:37] Serving on http://127.0.0.1:8000/
```

这时按住 `Ctrl` 键（macOS 用户按住 `Cmd` 键）点击最后一行的链接，或者直接在浏览器中输入 `http://127.0.0.1:8000/`，你会看到一个简单的页面，这就是 MkDocs 生成的网站。

![截屏2025-02-03 11.13.14.png](https://s2.loli.net/2025/02/03/VU6LXtW5Zqc1isD.png)

这个页面是 MkDocs 自动生成的首页，内容是 `docs/index.md` 文件中的内容。你可以在这个文件中写入 Markdown 语法的内容，然后刷新页面，就能看到内容的变化。

按下 `Ctrl + C` 终止 `mkdocs serve` 命令。

## 网站内容和样式设置

你可能会奇怪，为什么这个页面看起来和本站不一样？这是因为本站使用了 Material for MkDocs 主题。

同时，本站的文章内容也不是直接写在 `docs/index.md` 文件中的，而是在 `docs` 文件夹下的其他 Markdown 文件中的。这些文件会被 MkDocs 自动识别并生成对应的页面。

以上这些内容和样式的设置大多都集中在 `mkdocs.yml` 文件中，这个文件是 MkDocs 的配置文件，你可以在其中设置网站的标题、主题、导航栏等等。

下面给出一个简单的 `mkdocs.yml` 文件示例（也参考了其他人的代码）：

??? example "mkdocs.yml"
    ```yaml
    # 网站信息
    site_name: Fanovian's Notebook
    site_url: https://note.fanovian.cc/
    site_description: Fanovian 的笔记本

    # 主题设置
    theme:
    name: material # 主题名称，Material for MkDocs
    custom_dir: overrides # 自定义一些元素的布置，需要在 docs 文件夹下创建 overrides 文件夹
    favicon: https://s2.loli.net/2025/01/27/oFMcIOLbZstxUjH.png
    font: # 字体设置，分为正文和代码，采用 Google Fonts 的字体，除非自己编辑 CSS 样式
        text: Mukta
        code: Fira Code
    palette: # 主题颜色设置
        # 跟随系统模式
        - media: "(prefers-color-scheme)" # 标识
        toggle: # 切换按钮
            icon: material/auto-fix # 图标
            name: 切换至日间模式 # 鼠标悬浮提示
        # 日间模式
        - media: "(prefers-color-scheme: light)"
        scheme: default 
        primary: white # 主色调，需要采用 Material for MkDocs 给出的颜色，除非自己编辑 CSS 样式
        toggle:
            icon: material/toggle-switch
            name: 切换至夜间模式
        # 夜间模式
        - media: "(prefers-color-scheme: dark)"
        scheme: slate
        primary: var(--md-primary-fg-color)
        toggle:
            icon: material/toggle-switch-off-outline
            name: 切换至跟随系统模式
    features:
        - announce.dismiss
        - navigation.instant   #- header.autohide  #自动隐藏
        - navigation.instant.progress
        - navigation.tracking   #地址栏中的 URL 将自动更新为在目录中突出显示的活动锚点
        - navigation.tabs # 使用Tab来进行分类
        - navigation.top # 返回顶部的按钮 在上滑时出现
        - navigation.indexes # Tab会有一个index.md 而不是在打开Tab时打开第一篇文章
        # - navigation.footer # 底部的翻页
        # - navigation.expand # 打开Tab时左侧目录全部展开
        - search.share   #搜索分享按钮
        - search.suggest # 搜索输入一些字母时推荐补全整个单词
        - search.highlight # 搜索出的文章关键词加入高亮
        - content.code.copy # 可以通过按钮复制代码
        - content.action.edit # 点击按钮跳转到编辑页面  需要结合 edit_uri 一起使用
    language: zh # 一些提示性的文字会变成中文
    icon:
        repo: fontawesome/brands/github # 右上角的仓库图标
        logo: material/notebook # 左上角的图标
    edit_uri: edit/main/docs # 编辑按钮跳转的链接
    repo_url: https://github.com/Fanovian/notebook # 右上角的GitHub链接
    repo_name: Fanovian's Notebook # 鼠标悬浮提示
    copyright: Copyright &copy; 2023 - 2025 Fanovian # 左下角版权
    extra:
    social: # 右下角的社交链接
        - icon: fontawesome/solid/blog
        link: https://blog.fanovian.cc/
        name: Blog | Fanovian
        - icon: fontawesome/brands/bilibili
        link: https://space.bilibili.com/85414704
        name: Bilibili | Fanovian
        - icon: fontawesome/brands/github
        link: https://github.com/fanovian
        name: GitHub | Fanovian
        - icon: material/email
        link: mailto:<fanovian@outlook.com>
        name: Email | Fanovian

    # 扩展插件
    plugins:
    - search:
        separator: '[\s\u200b\-]' # 支持中文搜索
        lang:
            - en
            - ja
    - tags # 给单篇文章添加标签 https://squidfunk.github.io/mkdocs-material/setup/setting-up-tags/?h=tags

    # Markdown 相关的扩展
    markdown_extensions:
    # - abbr
    - meta
    - def_list
    - attr_list
    # - admonition
    # - footnotes
    - md_in_html
    - sane_lists
    - admonition
    - pymdownx.keys
    - pymdownx.mark
    - pymdownx.tilde
    # - pymdownx.caret
    - pymdownx.critic
    # - pymdownx.betterem
    - pymdownx.details
    - pymdownx.snippets
    - pymdownx.magiclink
    - pymdownx.smartsymbols
    - pymdownx.superfences
    - pymdownx.inlinehilite
    # - markdown.extensions.attr_list
    - toc:
        permalink: true
        toc_depth: 4
    - pymdownx.highlight: # 代码块高亮
        anchor_linenums: true
        linenums: true # 显示行号
        # auto_title: true # 显示编程语言名称
        linenums_style: pymdownx-inline
        line_spans: __span
        pygments_lang_class: true
    - pymdownx.emoji:
        emoji_index: !!python/name:material.extensions.emoji.twemoji
        emoji_generator: !!python/name:material.extensions.emoji.to_svg
    - pymdownx.tabbed:
        alternate_style: true
    - pymdownx.tasklist:
        custom_checkbox: true
    - pymdownx.arithmatex:
        generic: true

    # 自己的 CSS 和 JavaScript，可以是链接，也可以是文件引入
    extra_javascript:
    - https://polyfill.io/v3/polyfill.min.js?features=es6
    - javascripts/mathjax.js
    - https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js
    extra_css:
    - stylesheets/extra.css
    - stylesheets/document.css
    - stylesheets/friends.css
    - stylesheets/file.css
    - https://cdn.bootcdn.net/ajax/libs/lxgw-wenkai-screen-webfont/1.7.0/style.min.css #字体
    - https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css # font-awesome表情支持

    # 导航，这里是整个网站的导航栏，可以有多个层级
    nav: 
    - 主页: index.md
    - 课程:
        - course/index.md
        - 程序设计与算法基础: course/fpa/final-exam-re.md
        - 数据结构基础: 
        - course/fds/index.md
        - 算法分析基础: course/fds/ch1.md
        - 线性数据结构: course/fds/ch2.md
        - 树: course/fds/ch3.md
        - 图: course/fds/ch4.md
        - 排序: course/fds/ch5.md
        - 散列: course/fds/ch6.md
        - 人工智能引论: 
        - course/ai/index.md
    ```

`nav`、`extra_css`、`extra_javascript` 等地方引入文件的根目录是 `docs` 文件夹，所以你需要在 `docs` 文件夹下创建对应的文件夹，然后把文件放进去。

!!! info "关于主题"
    正如本文简介所言，文章不会大篇幅介绍这个配置的详细内容，因为 Material for MkDocs 的文档已经写得非常详细了，你可以在 [Material for MkDocs 官网](https://squidfunk.github.io/mkdocs-material/) 找到每一个字段的详细解释，也可以自己修改配置文件，然后刷新页面看效果。笔者认为新手的主要任务是先把网站跑起来，然后再慢慢调整样式。

除了动态预览，还可以终端输入：

```bash
mkdocs build
```

这个命令会在当前目录下生成一个 `site` 文件夹，里面包含了生成的静态网站文件，这个文件夹就是你需要部署到服务器上的文件夹。