# 如何加入友链？

## 格式

- 在“友链”页面下方留言，留言格式如下：

```html
<div class="friend-card" style="--base-color: var(--color-你想要的颜色);">
    <img src="你的头像链接" alt="avatar" class="friend-avatar">
    <div class="friend-info">
      <div class="friend-name">友链名称</div>
      <p class="friend-description">这是一个友链的一句话介绍。</p>
    </div>
    <div class="friend-link" onclick="window.location.href='你的友链链接'"></div>
</div>
```

- 填充中文内容即可。
- 请确保您的头像链接是有效的，而且尽量保证图片的加载速度。
- 一句话介绍**建议**不要太长，多了换行显示可能难以达到效果🥺
- 您可以指定友链的颜色，只需将 `--color-你想要的颜色` 替换为 `--color-颜色名` 即可。为了保证页面的美观，友链的颜色应该是主题色的一种。本人已经预设了几种主题色，分别为：

```css
:root {
    --color-blue: #3b6ca9;
    --color-pink: #c179b4;
    --color-red: #d45151;
    --color-orange: #e39b2f;
    --color-green: #38a989;
    --color-purple: #987ccd;
}
```

## 预览

您可以在下方输入您的友链代码，以预览效果：

<div class="friend-preview-container">
  <textarea id="friendLinkCode" rows="10" class="preview-input">
<div class="friend-card" style="--base-color: var(--color-blue);">
    <img src="你的头像链接" alt="avatar" class="friend-avatar">
    <div class="friend-info">
      <div class="friend-name">友链名称</div>
      <p class="friend-description">这是一个友链的一句话介绍。</p>
    </div>
    <div class="friend-link" onclick="window.location.href='你的友链链接'"></div>
</div></textarea>
  <div class="preview-area">
    <b>预览效果</b>
    <div id="previewContent" class="friends-container"></div>
  </div>
</div>

<script>
document.getElementById('friendLinkCode').addEventListener('input', function() {
  const previewContent = document.getElementById('previewContent');
  // 显示两个相同的卡片
  previewContent.innerHTML = this.value + this.value;
});

// 页面加载时触发一次预览
window.addEventListener('load', function() {
  const event = new Event('input');
  document.getElementById('friendLinkCode').dispatchEvent(event);
});
</script>

<style>
.friend-preview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
}

.preview-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
}

.preview-area {
  padding: 20px 0;
}
</style>