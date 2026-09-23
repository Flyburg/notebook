---
comments: true
---

# MkDocs 美化与进阶

有了前面的一系列工作，我们的 MkDocs 网站已经可以正常生成和部署了，请读者务必对整套流程熟悉之后再继续阅读本文。

本文中，笔者将通过几个例子，介绍一些 MkDocs 的高级用法。

## 配置评论系统

有很多评论系统可以集成到 MkDocs 中，这里选用最常用的 Giscus 作为例子。

请读者以[官方文档](https://squidfunk.github.io/mkdocs-material/setup/adding-a-comment-system/)为准。

首先要安装 [Giscus GitHub App](https://github.com/apps/giscus) 并授权给你的仓库。

然后，去 [Giscus 官网](https://giscus.app/zh-CN)，跟着提示引导一步一步走下来，会获得一段代码，类似这样：

```html
<script src="https://giscus.app/client.js"
        data-repo="Fanovian/notebook"
        data-repo-id="R_kgDOJ2i3-Q"
        data-category="Announcements"
        data-category-id="DIC_kwDOJ2i3-c4CXtT_"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>
```

接着，终端在网站根目录执行：

```bash
mkdir overrides
cd overrides
touch comments.html
```

编辑 `comments.html` 文件：


??? note "comments.html"
    ```html
    {% if page.meta.comments %}
      <h2 id="__comments">{{ lang.t("meta.comments") }}</h2>
      <!-- Insert generated snippet here -->

      <!-- Synchronize Giscus theme with palette -->
      <script>
        var giscus = document.querySelector("script[src*=giscus]")

        // Set palette on initial load
        var palette = __md_get("__palette")
        if (palette && typeof palette.color === "object") {
          var theme = palette.color.scheme === "slate"
            ? "transparent_dark"
            : "light"

          // Instruct Giscus to set theme
          giscus.setAttribute("data-theme", theme) 
        }

        // Register event handlers after documented loaded
        document.addEventListener("DOMContentLoaded", function() {
          var ref = document.querySelector("[data-md-component=palette]")
          ref.addEventListener("change", function() {
            var palette = __md_get("__palette")
            if (palette && typeof palette.color === "object") {
              var theme = palette.color.scheme === "slate"
                ? "transparent_dark"
                : "light"

              // Instruct Giscus to change theme
              var frame = document.querySelector(".giscus-frame")
              frame.contentWindow.postMessage(
                { giscus: { setConfig: { theme } } },
                "https://giscus.app"
              )
            }
          })
        })
      </script>
    {% endif %}
    ```

第三行的 `<!-- Insert generated snippet here -->` 处粘贴上面的 Giscus 代码。

如果你对前端三件套比较了解，也可以对这个文件进行一些修改，比如添加一些样式。

配置好之后记得在 `mkdocs.yml` 文件中添加：

```yaml
theme:
  custom_dir: overrides
```

来把这个文件引入到主题中。除此之外，许多其他自定义的 html 文件也可以放在这个文件夹中，这里直接在主题中一次引入了。

然后在你想要添加评论的页面的 Markdown 文件的头部添加：

```yaml
---
comments: true
---
```

即可在这个页面中添加评论系统。

## 添加顶部公告

在 `overrides` 文件夹中创建 `main.html` 文件：

```html
{% extends "base.html" %}

{% block announce %}
  <!-- Add announcement here, including arbitrary HTML -->
{% endblock %}
```

中间填写 HTML 格式的公告内容。

然后在 `mkdocs.yml` 文件中添加：

```yaml
theme:
  custom_dir: overrides
  features:
    - announce.dismiss
```

最后一行的作用是读者可以关闭公告直至公告内容更新，关掉功能则公告常驻。

## 自定义配色和字体

这个属于 CSS 的内容了。在 `docs` 文件夹下创建 `stylesheets` 文件夹，然后在其中创建 `extra.css` 文件。

在 `extra.css` 文件中写入你的 CSS 代码，比如：

```css
:root {
    --md-primary-fg-color:        #3b6ca9;
    --md-primary-fg-color--light: #3b6ca9;
    --md-primary-fg-color--dark:  #3b6ca9;
    --md-accent-fg-color:         #3b6ca9;

    --md-text-font: "LXGW WenKai Screen";
    --md-code-font: "Menlo", "LXGW WenKai Screen";
}

[data-md-color-scheme="default"] {
    --md-footer-bg-color--dark: #ffffffd5;
    --md-footer-fg-color--light: #000000c6;
    --md-footer-fg-color--lighter: #0000009d;
    --md-footer-fg-color--lightest: #000000;
}

[data-md-color-scheme="slate"] {
    --md-default-bg-color: #131313;
    --md-default-fg-color: rgba(255, 253, 253, 0.868);
    --md-default-fg-color--light: rgba(255, 255, 255, 0.854);
    --md-default-fg-color--lighter: rgba(255, 255, 255, 0.393);
    --md-default-fg-color--lightest: rgba(255, 255, 255, 0.58);
    --md-primary-fg-color: #0e0e0e;
    --md-typeset-a-color: #ffffff;
    --md-footer-fg-color: #fff;
    --md-footer-bg-color: var(--md-default-bg-color);
    --md-footer-bg-color--dark: var(--md-default-bg-color);
    --md-footer-fg-color--light: #ffffffc3;
    --md-footer-fg-color--lighter: #ffffffc4;
    --md-code-bg-color: #1c1c1c;
}

.md-header__title {
    font-weight: bold;
    font-family: "LXGW Wenkai Screen", sans-serif;
}
```

笔者这里对日间模式和夜间模式都单独设置了一些自己喜欢的颜色，这些颜色的参数很多，具体可以看 [Material for MkDocs 作者给出的示例](https://github.com/squidfunk/mkdocs-material/blob/master/src/templates/assets/stylesheets/main/_colors.scss)，里面包含了所有的颜色定义。

同时笔者也对字体进行了设置，这里设置了正文和代码的字体，这里的字体是笔者自己下载的字体，你可以根据自己的喜好更改，可以是网上的字体链接，也可以下载之后引入。

## 插件的引入

笔者使用了两个额外的插件：一个是 xg 的字数统计插件：[mkdocs-statistics-plugin](https://github.com/TonyCrane/mkdocs-statistics-plugin)，一个是 ignorantshr 和 timvink 开发的自动标题插件：[mkdocs-add-number-plugin](https://github.com/ignorantshr/mkdocs-add-number-plugin)。

插件的具体使用方式直接看仓库中的 README 即可。

需要注意的是，在本地安装好插件就可以渲染出效果，但是在 GitHub Pages 上渲染出效果需要构建页面的工作流中让 GitHub Actions 安装这些插件，需要在 `PublishMySite.yml` 文件中添加：

```yaml
jobs: # 工作流的具体内容
  deploy:
    runs-on: ubuntu-latest # 创建一个新的云端虚拟机 使用最新Ubuntu系统
    steps:
      - uses: actions/checkout@v2 # 先checkout到main分支
      - uses: actions/setup-python@v2 # 再安装Python3和相关环境
        with:
          python-version: 3.x
      - run: pip install mkdocs-material # 使用pip包管理工具安装mkdocs-material
      - run: pip install mkdocs-statistics-plugin # 安装mkdocs-statistics-plugin
      - run: pip install mkdocs-add-number-plugin # 安装mkdocs-add-number-plugin
      - run: mkdocs gh-deploy --force # 使用mkdocs-material部署gh-pages分支
```

即先安装好所有的插件，然后再部署网站。否则 Actions 会报错。