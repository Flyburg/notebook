function createCard(cardData) {
  return `
    <div class="article-card">
      <div class="article-meta">${cardData.meta}</div>
      <div class="article-title">${cardData.title}</div>
      <div class="article-abb">${cardData.abb}</div>
      <div class="card-link" onclick="window.location.href='${cardData.link}'"></div>
    </div>
  `;
}


function showRandomCard(isFirstLoad = true) {
  const container = document.getElementById('card-container');
  const switchButton = document.getElementById('switchButton');
  let randomIndex;
  
  // 只在首次加载时隐藏按钮
  if (isFirstLoad && switchButton) {
      switchButton.style.opacity = '0';
      switchButton.style.visibility = 'hidden';
  }
  
  // 确保不会连续显示同一张卡片
  do {
      randomIndex = Math.floor(Math.random() * cards.length);
  } while (container.dataset.currentIndex === randomIndex.toString() && cards.length > 1);
  
  // 淡出
  container.style.opacity = '0';
  
  // 等待淡出完成后更新内容
  setTimeout(() => {
      container.innerHTML = createCard(cards[randomIndex]);
      container.dataset.currentIndex = randomIndex;
      
      // 强制浏览器重排
      void container.offsetWidth;
      
      // 淡入卡片
      requestAnimationFrame(() => {
          container.style.opacity = '1';
          
          // 只在首次加载时延迟显示按钮
          if (isFirstLoad && switchButton) {
              setTimeout(() => {
                  switchButton.style.visibility = 'visible';
                  switchButton.style.opacity = '1';
              }, 300);
          }
      });
  }, 300);
}

// 页面加载和切换时的事件处理
document.addEventListener('DOMContentLoaded', () => {
  // 首次加载显示随机卡片
  showRandomCard(true);
  
  // 为按钮添加点击事件
  const switchButton = document.getElementById('switchButton');
  if (switchButton) {
      switchButton.addEventListener('click', () => showRandomCard(false));
  }
  
  // 监听 MkDocs 页面切换事件
  document.addEventListener('page', () => showRandomCard(true));
});

// 监听页面可见性变化
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
      showRandomCard(true);
  }
});