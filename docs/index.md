---
hide:
  - navigation
  - toc
home: true
# comments: true
# nostatistics: true
---

<!-- # 欢迎 -->

<!-- 一言 --->

<!-- > *小店新开，老板里面请！* -->

> <span id="daily-quote" style="font-style: italic;">正在加载一言...</span>
<script>
  fetch('https://v1.hitokoto.cn/?c=i&c=k&c=l')
    .then(response => response.json())
    .then(data => {
      document.getElementById('daily-quote').innerText = data.hitokoto;
    });
</script>

<h1>
<div id="typed-container">
  <span id="typed"></span>
</div>
</h1>

<script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.11"></script>
<script>
new Typed('#typed', {
  strings: ['欢迎看看我的笔记！'
  ],
  typeSpeed: 80,
  showCursor: false
});
</script>

<div id="card-container"></div>
<button id="switchButton" class="switch-button">换一个</button>

<script>
const cards = [
  {
    meta: "实践教程 · 前端开发",
    title: "MkDocs 笔记本设计",
    abb: "MkDocs",
    link: "/tools/mkdocs"
  },
  {
    meta: "复习笔记 · 硬件设计",
    title: "计算机体系结构",
    abb: "Arch",
    link: "/system/arch"
  },
  {
    meta: "学习笔记 · 数据结构",
    title: "高级数据结构与算法分析",
    abb: "ADS",
    link: "/programming/ads"
  },
  {
    meta: "学习笔记 · 编译原理",
    title: "编译原理",
    abb: "Compile",
    link: "/application/comp"
  }
  // 可以继续添加更多卡片...
];
</script>

---

<!-- 访问次数 --->

<p style="text-align: center;">
  🎉 您是第 <span id="busuanzi_value_site_pv"><i class="fa fa-spinner fa-spin"></i></span> 位访客！
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

<div style="max-width: 720px; margin: 0 auto;">
<h2 id="__comments">评论</h2>
<script src="https://giscus.app/client.js"
    data-repo="Flyburg/notebook"
    data-repo-id="R_kgDOJ2i3-Q"
    data-category="Announcements"
    data-category-id="DIC_kwDOJ2i3-c4CXtT_"
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="top"
    data-theme="preferred_color_scheme"
    data-lang="zh-CN"
    crossorigin="anonymous"
    async>
</script>
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
</div>

<style>
h2, h3, h4 {
  text-align: center;
}
</style>