---
hide:
  - navigation
  - toc
comments: true
nostatistics: true
---

<!-- # 欢迎 -->

<!-- 一言 --->

> <span id="daily-quote" style="font-style: italic; color: #555;">正在加载一言...</span>
<script>
  fetch('https://v1.hitokoto.cn/?c=i&c=k&c=l')
    .then(response => response.json())
    .then(data => {
      document.getElementById('daily-quote').innerText = data.hitokoto;
    });
</script>

<h1>
<div id="typed-container">
  <span id="typed">欢迎来到我的笔记本 :)</span>
</div>
</h1>

<script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.11"></script>
<script>
  let typed = null;

  function initTyped() {
    var typedElement = document.getElementById("typed");
    // 清空占位符文本
    typedElement.textContent = "";
    
    // 如果已存在实例，先销毁
    if (typed) {
      typed.destroy();
    }
    
    // 重新初始化
    typed = new Typed("#typed", {
      strings: ["欢迎来到我的笔记本 :)"],
      typeSpeed: 60,
      backSpeed: 50,
      backDelay: 1800,
      startDelay: 400,
      loop: true,
      onError: (err) => {
        console.error('Typed.js error:', err);
        typedElement.textContent = "欢迎来到我的笔记本 :)";
      }
    });
  }

  // 初始化
  initTyped();

  // 监听页面可见性变化
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      initTyped();
    }
  });
</script>

---

<!-- 推荐阅读 --->


<h3>近期更新 · 推荐</h3>

<div class="article-scroll">
  <div class="article-container">
    <div class="article-card">
      <h3>计算机体系结构</h3>
      <div class="article-meta">
        <span>复习资料 · 硬件设计</span>
      </div>
      <div class="card-link" onclick="window.location.href='/course/arch'"></div>
    </div>
    <div class="article-card">
      <h3>MkDocs 网页生成与部署</h3>
      <div class="article-meta">
        <span>实践记录 · 前端开发 · HTML</span>
      </div>
      <div class="card-link" onclick="window.location.href='/self/mkdocs'"></div>
    </div>
    <div class="article-card">
      <h3>高级数据结构与算法分析</h3>
      <div class="article-meta">
        <span>课程笔记 · 数据结构与算法 · C 语言</span>
      </div>
      <div class="card-link" onclick="window.location.href='/course/ads'"></div>
    </div>
  </div>
</div>

<p style="text-align: center; font-size: 0.9em; color: #888;">
（左右滑动查看更多）
</p>


<p style="text-align: center;">
· 点击上方的导航栏可以查看不同的分类<br>
· 文章左侧为文章合集，右侧为目录大纲<br>
· 欢迎在评论区中留言，任何地方都可以
</p>

---

<!-- 访问次数 --->

<p style="text-align: center;">
  🎉 本站访问量已达 <span id="busuanzi_value_site_pv"><i class="fa fa-spinner fa-spin"></i></span> 次 🎉
</p>
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>

<body>
        <font color="#B9B9B9">
        <p style="text-align: center; ">
                <span>本站已运行</span>
                <span id='box1'></span>
    </p>
      <div id="box1"></div>
      <script>
        function timingTime(){
          let start = '2023-07-02 00:00:00'
          let startTime = new Date(start).getTime()
          let currentTime = new Date().getTime()
          let difference = currentTime - startTime
          let m =  Math.floor(difference / (1000))
          let mm = m % 60  // 秒
          let f = Math.floor(m / 60)
          let ff = f % 60 // 分钟
          let s = Math.floor(f/ 60) // 小时
          let ss = s % 24
          let day = Math.floor(s  / 24 ) // 天数
          return day + " 天 " + ss + " 时 " + ff + " 分 " + mm +' 秒'
        }
        setInterval(()=>{
          document.getElementById('box1').innerHTML = timingTime()
        },1000)
      </script>
      </font>
    </body>

<style>
  /* 为页面增加一点风格 */
  h2, h3, h4 {
    text-align: center;
  }
  
  .article-scroll {
    max-width: 750px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
  }
  
  .article-container {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 8px 0;
  }
  
  .article-container::-webkit-scrollbar {
    display: none;
  }
  
  .article-card {
    flex: 0 0 250px;
    height: 86px;
    position: relative;
    background: linear-gradient(135deg, 
      var(--md-primary-fg-color), 
      color-mix(in srgb, var(--md-primary-fg-color) 65%, white)
    );
    border-radius: 12px;
    padding: 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    scroll-snap-align: start;
  }
  
  /* 为日间模式特别指定渐变 */
  [data-md-color-scheme="default"] .article-card {
    background: linear-gradient(135deg, 
      var(--md-primary-fg-color), 
      color-mix(in srgb, var(--md-primary-fg-color) 50%, white)
    );
  }
  
  /* 为夜间模式特别指定渐变 */
  [data-md-color-scheme="slate"] .article-card {
    background: linear-gradient(135deg, 
rgb(61, 64, 68), 
      color-mix(in srgb,rgb(27, 28, 29) 40%, black)
    );
  }
  
  .article-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  }
  
  .article-card h3 {
    margin: 0 0 10px 0; /* 减小下边距 */
    color: white;
    font-size: 1.1em; /* 稍微减小标题字号 */
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .article-meta {
    display: flex;
    flex-direction: column;
    gap: 6px; /* 减小间距 */
    color: rgba(255, 255, 255, 0.95);
    font-size: 0.8em; /* 稍微减小字号 */
    align-items: center;
  }
  
  .article-meta span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .card-link {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 12px; /* 匹配卡片圆角 */
    background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.05));
    transition: background 0.3s;
  }
  
  .card-link:hover {
    background: linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.1));
  }
  
  /* 其他样式保持不变 */
  .md-typeset table {
    width: 80%;
    margin: auto;
    border-collapse: collapse;
  }
  
  .md-typeset table th, .md-typeset table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.article-container');
  
  // 移除滑动条相关的 JavaScript 代码
});
</script>