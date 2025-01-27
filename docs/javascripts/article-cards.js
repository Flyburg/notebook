document.addEventListener('DOMContentLoaded', function() {
  // 获取文章统计信息
  function getArticleStats(path) {
    // 这里需要通过 mkdocs-statistics-plugin 提供的 API 获取统计信息
    // 示例数据结构
    return fetch(`/statistics/${path}.json`)
      .then(response => response.json())
      .then(data => ({
        wordCount: data.word_count,
        readingTime: Math.ceil(data.word_count / 200) // 假设阅读速度为每分钟200字
      }));
  }

  // 创建文章卡片
  function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.onclick = () => window.location.href = article.path;
    
    card.innerHTML = `
      <h3>${article.title}</h3>
      <div class="article-meta">
        <span>📝 约${article.wordCount}字</span>
        <span>⏱️ 阅读时间：${article.readingTime}分钟</span>
      </div>
    `;
    
    return card;
  }

  // 初始化推荐阅读区域
  async function initRecommendedReading() {
    const container = document.querySelector('.article-cards');
    if (!container) return;

    // 定义推荐文章列表
    const recommendedArticles = [
      { path: '/programming/python/basic/', title: 'Python基础教程' },
      { path: '/tools/git/', title: 'Git使用指南' }
    ];

    // 获取每篇文章的统计信息并创建卡片
    for (const article of recommendedArticles) {
      try {
        const stats = await getArticleStats(article.path);
        const cardData = { ...article, ...stats };
        const card = createArticleCard(cardData);
        container.appendChild(card);
      } catch (error) {
        console.error(`Failed to load stats for ${article.path}:`, error);
      }
    }
  }

  initRecommendedReading();
}); 