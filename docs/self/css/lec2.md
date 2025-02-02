---
comments: true
---

# Lecture 2: 背景样式

## 颜色填充

### 预设颜色

使用 `background-color` 属性可以设置背景颜色。

```html
<!DOCTYPE html>
<html>
<body style="background-color: lightblue;">
  <h1>这是一个标题</h1>
  <p>这是一个段落。</p>
</body>
</html>
```

这段代码规定了此 HTML 文件的正文背景颜色为浅蓝色。

除了这种直接对颜色命名的方式，还有一些自定义颜色的方法，例如：

### 十六进制 RGB 颜色

使用十六进制的 RGB 值来定义颜色。

```html
<!DOCTYPE html>
<html>
<body style="background-color: #ff0000;">
  <h1>这是一个标题</h1>
  <p>这是一个段落。</p>
</body>
</html>
```

这一段规定了此 HTML 文件的正文背景颜色为红色。

### 十进制 RGB 颜色

使用十进制的 RGB 值来定义颜色。

```html
...
<body style="background-color: rgb(255, 0, 0);">
...
```

这段代码规定了此 HTML 文件的正文背景颜色为红色。

### RGBA 颜色

多了一个 alpha 通道，用来定义透明度。alpha 通道的值是 0 到 1 之间的数字。

```html
...
<body style="background-color: rgba(255, 0, 0, 0.3);">
...
```

这段代码规定了此 HTML 文件的正文背景颜色为红色，透明度为 0.3。

## 图片填充

### 背景图片

使用 `background-image` 属性可以设置背景图片。

```html
<!DOCTYPE html>
<html>
<body style="background-image: url('paper.gif');">
  <h1>这是一个标题</h1>
  <p>这是一个段落。</p>
</body>
</html>
```

这段代码规定了此 HTML 文件的正文背景图片为 `paper.gif`。注意这里的 url 指的是图片的路径，因为这里的 CSS 是内联的，所以路径是相对于 HTML 文件的。

### 重复方式

如果说图片的大小比浏览器显示部分还小的话，默认会自动重复。如果不想重复，可以使用 `background-repeat` 属性。

```html
...
<body style="background-image: url('paper.gif'); background-repeat: no-repeat;">
...
```

这段代码规定了此 HTML 文件的正文背景图片为 `paper.gif`，并且不重复。

还有一些重复方式，例如 `repeat-x`，`repeat-y`，`repeat`。其中 `repeat-x` 表示水平重复，`repeat-y` 表示垂直重复，`repeat` 表示水平和垂直都重复。

### 背景图片位置

使用 `background-position` 属性可以设置背景图片的位置。

```html
...
<body style="background-image: url('paper.gif'); background-position: right top;">
...
```

这里规定了图片在右上角。

除此之外，还有一些位置，例如 `left top`，`left center`，`left bottom`，`right top`，`right center`，`right bottom`，`center top`，`center center`，`center bottom` 等。

还可以使用像素值或百分比值来设置位置，例如 `10px 20px`，`50% 50%`。

### 固定背景图片

使用 `background-attachment` 属性可以设置背景图片是否固定。

```html
...
<body style="background-image: url('paper.gif'); background-attachment: fixed;">
...
```

除此之外，还有 `scroll`，`local` 等值。