---
comments: true
---

# Lecture 3：其他格式

## 1 特殊格式

**地址**：`address`

```html
<address>作者：张三<br>地址：北京市海淀区</address>
```

**缩进**：`blockquote`

```html
<blockquote>这是一个缩进的段落。</blockquote>
```

**小引用**：`q`

```html
<q>这是一个小引用。</q>
```

**预格式化**：`pre`

```html
<pre>这是一个预格式化的段落。</pre>
```

## 2 属性

**水平分割线**：`hr`

```html
<p>这是一段文字。</p>
<hr>
<p>这是另一段文字。</p>
```

在这个里面还可以加东西：

```html
<hr width="50%" align="left" size="10">
```

HTML 5 后，双引号可以省略。

上面这三个属性，还是建议用 CSS 来控制。

**缩写**：`abbr`

```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

用浏览器打开，鼠标放在上面会显示全称。

这种“浮云”，实际上都是通过 title 实现的。

**排列顺序**：`bdo`

```html
<bdo dir="rtl">这是一个从右到左的段。</bdo>
```

`rtl` 是 right to left 的缩写。

你甚至可以在 `bdo` 里面加 `bdi`，表示这是一个从左到右的段。

如果我们想在 HTML 中呈现这个标记的尖括号，例如要表示 a 小于 2，应该使用 `&lt;` 和 `&gt;`。

```html
<p>a &lt; 2</p>
```

此外还有 `&amp;`、`&copy;` 等。

还有一个有趣的：`&uuml;`，表示德语的 u。如果你想表示汉语拼音的 ü，可以使用 `&uuml;`。