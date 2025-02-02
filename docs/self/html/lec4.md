---
comments: true
---

# Lecture 4：其他元素

## 1 列表

**无序列表**：`ul`

```html
<ul>
  <li>第一项</li>
  <li>第二项</li>
  <li>第三项</li>
</ul>
```

**有序列表**：`ol`

```html
<ol>
  <li>第一项</li>
  <li>第二项</li>
  <li>第三项</li>
</ol>
```

有序列表还可以加入 `start` 属性：

```html
<ol start="10">
  <li>第十项</li>
  <li>第十一项</li>
  <li>第十二项</li>
</ol>
```

这些列表之间可以互相嵌套。

**定义/词条列表**：`dl`

```html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>
```

其中 `dt` 是定义标题（definition term），`dd` 是定义描述（definition description）。

## 2 图片

放图片用 `img` 标记（image）。

```html
<img src="https://www.example.com/image.jpg" width="50%" height="50%" alt="图片">
```

最后面的 `alt` 是图片的替代文本，当图片无法显示时会显示这个文本。

图片可以使用三种格式：jpg、png、gif。

网页里面还可以开窗口，里面可以放很多东西。这个窗口就是 `iframe` 标记（inline frame）。

```html
<iframe src="https://www.example.com/" width="100%" height="500px"></iframe>
```

## 3 链接

链接用 `a` 标记（anchor）。

```html
<a href="https://www.example.com/">链接文字</a>
```

如果我们之前在某个段落的标记属性中使用了 `id` 属性，那么我们可以通过锚点来跳转到这个段落。

```html
<a href="#section1">跳转到第一节</a>

<p id="section1">这是第一节的内容。</p>
```

不仅是段落，很多的标记都可以加 `id` 属性。

链接还可以有其他属性，例如 `target` 属性。

```html
<a href="https://www.example.com/" target="_blank">在新窗口打开链接</a>
```

还有更好玩的：

```html
<p>
<img src="image.jpg" width=100 height=100 usemap="#map">
<map name="map">
  <area shape="rect" coords="0,0,50,50" href="https://www.example1.com/">
  <area shape="circle" coords="75,75,25" href="https://www.example2.com/">
</map>
</p>
```

其实看一眼就能猜到，这是一个图片地图。`area` 标记是一个区域，`shape` 属性是形状，`coords` 属性是坐标，`href` 属性是链接。

## 4 表格

表格用 `table` 标记。

```html
<table border="1">
  <caption>表格标题</caption>
  <tr>
    <th>标题 1</th>
    <th>标题 2</th>
  </tr>
  <tr>
    <td>内容 1</td>
    <td>内容 2</td>
  </tr>
</table>
```

其中 `tr` 是行（table row），`th` 是表头（table header），`td` 是数据（table data），`border` 是边框。

还可以做“合并单元格”操作，用 `colspan` 和 `rowspan` 属性。

```html
<table border="1">
  <tr>
    <th colspan="2">标题</th>
  </tr>
  <tr>
    <td>内容 1</td>
    <td>内容 2</td>
  </tr>
</table>
```

`th` 只表示针对单元格的头效果，如果想要针对整个表格，可以使用 `thead`、`tbody` 和 `tfoot` 标记。

```html
<table border="1">
  <thead>
    <tr>
      <th>标题 1</th>
      <th>标题 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>内容 1</td>
      <td>内容 2</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>底部 1</td>
      <td>底部 2</td>
    </tr>
  </tfoot>
</table>
```