# Personal Intro Webpage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page academic personal website from the resume PDF with complete content coverage, restrained motion, and polished desktop/mobile layouts.

**Architecture:** Use one semantic `index.html` document with anchored sections, one `styles.css` file for tokens/layout/motion, and one `script.js` file for reveal-on-scroll and navigation state. Validate the work with a Node content test and a Playwright UI smoke test that load the local `index.html` directly.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner, Playwright from the bundled Codex runtime

---

> **Workspace note:** `D:\XKKProjectLIst\webpage` is not a Git repo. Replace normal commit steps with file checkpoints until version control is initialized.

### Task 1: Scaffold the static site and lock the agreed section structure

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Create: `tests/site-content.test.cjs`

- [ ] **Step 1: Write the failing content test**

```js
// tests/site-content.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function readSiteFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('index includes the agreed top-level sections and navigation anchors', () => {
  const html = readSiteFile('index.html');
  const requiredSections = ['hero', 'about', 'awards', 'projects', 'publications', 'service'];

  for (const id of requiredSections) {
    assert.match(html, new RegExp(`id="${id}"`), `missing section #${id}`);
    assert.match(html, new RegExp(`href="#${id}"`), `missing nav link for #${id}`);
  }
});

test('hero summary stats reference the confirmed headline counts', () => {
  const html = readSiteFile('index.html');

  assert.match(html, /15\+\s*竞赛奖项/);
  assert.match(html, /3\s*篇论文成果/);
  assert.match(html, /2\s*项专利申请/);
  assert.match(html, /多项科研项目/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-content.test.cjs
```

Expected: FAIL with `ENOENT: no such file or directory, open 'index.html'`

- [ ] **Step 3: Write the minimal implementation**

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>徐珂珂 | 学术个人主页</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a class="site-mark" href="#hero">徐珂珂</a>
      <nav class="site-nav" aria-label="页面导航">
        <a href="#hero">首页</a>
        <a href="#about">简介</a>
        <a href="#awards">奖项</a>
        <a href="#projects">项目</a>
        <a href="#publications">成果</a>
        <a href="#service">经历</a>
      </nav>
    </header>

    <main>
      <section id="hero">
        <h1>徐珂珂</h1>
        <p>新乡医学院三全学院 生物医学工程本科</p>
        <ul>
          <li>15+ 竞赛奖项</li>
          <li>3 篇论文成果</li>
          <li>2 项专利申请</li>
          <li>多项科研项目</li>
        </ul>
      </section>

      <section id="about"><h2>个人简介</h2></section>
      <section id="awards"><h2>完整奖项与荣誉</h2></section>
      <section id="projects"><h2>科研项目与学术实践</h2></section>
      <section id="publications"><h2>论文、专利与专业技能</h2></section>
      <section id="service"><h2>任职经历与志愿服务</h2></section>
    </main>

    <script src="script.js"></script>
  </body>
</html>
```

```css
/* styles.css */
:root {
  color-scheme: light;
  --bg: #f4f5f1;
  --text: #1d2a24;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
}
```

```js
// script.js
document.documentElement.classList.add('js-ready');
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```powershell
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-content.test.cjs
```

Expected: PASS for both content assertions

- [ ] **Step 5: Record a checkpoint**

Run:

```powershell
Get-Item index.html, styles.css, script.js, tests\site-content.test.cjs | Select-Object Name,Length
```

Expected: each file exists and `Length` is greater than 0

### Task 2: Build the visual system plus the hero and personal-intro sections

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Create: `tests/site-ui.test.cjs`

- [ ] **Step 1: Write the failing UI smoke test for the hero presentation**

```js
// tests/site-ui.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

async function openPage(viewport) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  const pageUrl = pathToFileURL(path.resolve(process.cwd(), 'index.html')).href;
  await page.goto(pageUrl);
  return { browser, page };
}

test('hero renders a split layout with four stat cards and abstract artwork', async () => {
  const { browser, page } = await openPage({ width: 1440, height: 1200 });

  try {
    await page.waitForSelector('.hero-grid');
    const statCount = await page.locator('.stat-card').count();
    assert.equal(statCount, 4);

    const artVisible = await page.locator('.hero-art').isVisible();
    assert.equal(artVisible, true);
  } finally {
    await browser.close();
  }
});
```

- [ ] **Step 2: Run the UI test to verify it fails**

Run:

```powershell
$env:NODE_PATH='C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-ui.test.cjs
```

Expected: FAIL because `.hero-grid`, `.stat-card`, and `.hero-art` do not exist yet

- [ ] **Step 3: Implement the hero, intro copy, and shared visual system**

```html
<!-- replace the body content inside index.html with the structure below -->
<body>
  <div class="page-shell">
    <header class="site-header">
      <a class="site-mark" href="#hero">徐珂珂</a>
      <nav class="site-nav" aria-label="页面导航">
        <a href="#hero">首页</a>
        <a href="#about">简介</a>
        <a href="#awards">奖项</a>
        <a href="#projects">项目</a>
        <a href="#publications">成果</a>
        <a href="#service">经历</a>
      </nav>
    </header>

    <main class="page-main">
      <section id="hero" class="panel hero-panel reveal">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Academic Profile</p>
            <h1>徐珂珂</h1>
            <p class="hero-meta">新乡医学院三全学院 · 生物医学工程本科</p>
            <p class="hero-summary">
              聚焦竞赛实践、科研组织与学术写作，以克制清晰的方式展示完整经历与成果。
            </p>
            <div class="hero-tags" aria-label="能力标签">
              <span>科研实践</span>
              <span>组织协作</span>
              <span>写作整理</span>
            </div>
          </div>

          <div class="hero-aside">
            <div class="hero-art" aria-hidden="true">
              <span class="orb orb-one"></span>
              <span class="orb orb-two"></span>
              <span class="orb orb-three"></span>
              <span class="grid-mark"></span>
            </div>
            <div class="hero-stats">
              <article class="stat-card">
                <strong>15+</strong>
                <span>竞赛奖项</span>
              </article>
              <article class="stat-card">
                <strong>3</strong>
                <span>论文成果</span>
              </article>
              <article class="stat-card">
                <strong>2</strong>
                <span>专利申请</span>
              </article>
              <article class="stat-card">
                <strong>多项</strong>
                <span>科研项目</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="panel intro-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">About</p>
          <h2>个人简介</h2>
        </div>
        <div class="intro-grid">
          <p class="intro-copy">
            性格开朗，做事认真细致，具备良好的团队协作与沟通能力。擅长文献阅读、
            内容整理与写作表达，能够在科研竞赛、学生工作与志愿服务之间保持稳定执行力。
          </p>
          <ul class="intro-points">
            <li>乐于助人，适应合作型研究与项目推进</li>
            <li>愿意迎接新挑战，具有持续学习意识</li>
            <li>兼顾学术表达、组织协调与服务责任感</li>
          </ul>
        </div>
      </section>

      <section id="awards" class="panel reveal"><h2>完整奖项与荣誉</h2></section>
      <section id="projects" class="panel reveal"><h2>科研项目与学术实践</h2></section>
      <section id="publications" class="panel reveal"><h2>论文、专利与专业技能</h2></section>
      <section id="service" class="panel reveal"><h2>任职经历与志愿服务</h2></section>
    </main>
  </div>

  <script src="script.js"></script>
</body>
```

```css
/* replace styles.css with the foundation below */
:root {
  color-scheme: light;
  --bg: #f4f5f1;
  --bg-soft: #ecefe8;
  --surface: rgba(255, 255, 255, 0.78);
  --surface-strong: #ffffff;
  --line: rgba(23, 50, 39, 0.12);
  --text: #1a2922;
  --muted: #55645c;
  --accent: #173227;
  --accent-soft: #dbe5dc;
  --shadow: 0 24px 60px rgba(19, 39, 31, 0.08);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 16px;
  --max-width: 1160px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(194, 211, 199, 0.55), transparent 34%),
    linear-gradient(180deg, #f8faf7 0%, var(--bg) 50%, #eef1eb 100%);
  color: var(--text);
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
}

.page-shell {
  width: min(100%, calc(var(--max-width) + 48px));
  margin: 0 auto;
  padding: 24px 24px 72px;
}

.site-header {
  position: sticky;
  top: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(248, 250, 247, 0.82);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 28px rgba(16, 32, 26, 0.05);
}

.site-mark,
.site-nav a {
  color: var(--text);
  text-decoration: none;
}

.site-mark {
  font-weight: 700;
  letter-spacing: 0.08em;
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.site-nav a {
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--muted);
}

.site-nav a:hover,
.site-nav a:focus-visible {
  background: var(--accent-soft);
  color: var(--accent);
  outline: none;
}

.page-main {
  display: grid;
  gap: 28px;
  margin-top: 28px;
}

.panel {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 32px;
}

.hero-grid,
.intro-grid {
  display: grid;
  gap: 24px;
}

.hero-grid {
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.9fr);
  align-items: center;
}

.eyebrow {
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-copy h1,
.section-heading h2 {
  margin: 0;
  line-height: 1.08;
}

.hero-copy h1 {
  font-size: clamp(2.8rem, 5vw, 4.8rem);
}

.hero-meta,
.hero-summary,
.intro-copy,
.intro-points {
  color: var(--muted);
}

.hero-summary {
  max-width: 34rem;
  font-size: 1.02rem;
  line-height: 1.8;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.hero-tags span {
  padding: 9px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.66);
  color: var(--accent);
}

.hero-aside {
  display: grid;
  gap: 18px;
}

.hero-art {
  position: relative;
  min-height: 280px;
  overflow: hidden;
  border-radius: 24px;
  background:
    linear-gradient(145deg, rgba(219, 229, 220, 0.96), rgba(243, 246, 241, 0.9)),
    var(--surface-strong);
  border: 1px solid rgba(23, 50, 39, 0.08);
}

.orb,
.grid-mark {
  position: absolute;
  display: block;
}

.orb {
  border-radius: 999px;
  filter: blur(2px);
  animation: drift 12s ease-in-out infinite;
}

.orb-one {
  inset: 26px auto auto 28px;
  width: 110px;
  height: 110px;
  background: rgba(42, 87, 63, 0.16);
}

.orb-two {
  inset: auto 34px 30px auto;
  width: 150px;
  height: 150px;
  background: rgba(105, 136, 116, 0.16);
  animation-delay: -3s;
}

.orb-three {
  inset: 84px 118px auto auto;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.88);
  animation-delay: -6s;
}

.grid-mark {
  inset: 24px;
  border: 1px solid rgba(23, 50, 39, 0.12);
  border-radius: 20px;
  background-image:
    linear-gradient(rgba(23, 50, 39, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23, 50, 39, 0.06) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.8;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.stat-card {
  display: grid;
  gap: 6px;
  padding: 18px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(23, 50, 39, 0.08);
}

.stat-card strong {
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--accent);
}

.section-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 18px;
}

.intro-grid {
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.9fr);
  align-items: start;
}

.intro-copy,
.intro-points {
  margin: 0;
  line-height: 1.85;
}

.intro-points {
  display: grid;
  gap: 12px;
  padding: 0;
  list-style: none;
}

.intro-points li {
  padding: 16px 18px;
  border-radius: var(--radius-md);
  background: var(--surface-strong);
  border: 1px solid var(--line);
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

@keyframes drift {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -12px, 0);
  }
}
```

- [ ] **Step 4: Run the UI test to verify it passes**

Run:

```powershell
$env:NODE_PATH='C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-ui.test.cjs
```

Expected: PASS for the split-layout hero smoke test

- [ ] **Step 5: Record a checkpoint**

Run:

```powershell
Get-Item index.html, styles.css, tests\site-ui.test.cjs | Select-Object Name,Length
```

Expected: updated files exist and `styles.css` is now substantially larger than the Task 1 baseline

### Task 3: Add the complete awards, project, publication, skill, and service content

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/site-content.test.cjs`

- [ ] **Step 1: Extend the content test with the required factual content**

```js
// replace tests/site-content.test.cjs with the fuller version below
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function readSiteFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('index includes the agreed top-level sections and navigation anchors', () => {
  const html = readSiteFile('index.html');
  const requiredSections = ['hero', 'about', 'awards', 'projects', 'publications', 'service'];

  for (const id of requiredSections) {
    assert.match(html, new RegExp(`id="${id}"`), `missing section #${id}`);
    assert.match(html, new RegExp(`href="#${id}"`), `missing nav link for #${id}`);
  }
});

test('hero summary stats reference the confirmed headline counts', () => {
  const html = readSiteFile('index.html');

  assert.match(html, /15\+\s*竞赛奖项/);
  assert.match(html, /3\s*篇论文成果/);
  assert.match(html, /2\s*项专利申请/);
  assert.match(html, /多项科研项目/);
});

test('awards section retains representative national, provincial, and campus honors', () => {
  const html = readSiteFile('index.html');

  assert.match(html, /第七届全国大学生基础医学创新研究暨实验设计论坛国家银奖/);
  assert.match(html, /第四届全国大学生智能技术应用大赛国家一等奖/);
  assert.match(html, /第八届互联网\+大学生创新创业大赛河南省二等奖/);
  assert.match(html, /第十五届挑战杯校级一等奖/);
  assert.match(html, /最美志愿者/);
});

test('projects and publications sections retain the confirmed research records', () => {
  const html = readSiteFile('index.html');

  assert.match(html, /混合现实在儿童自闭症患者注意力康复训练的应用/);
  assert.match(html, /焦虑症患者心理治疗的增强现实场景构建/);
  assert.match(html, /基于脑机接口的脑卒中患者行走康复训练系统的设计/);
  assert.match(html, /基于脑机接口的脑卒中患者康复训练装置实现方法的研究/);
  assert.match(html, /一种智能控温水冷防护服/);
});

test('service section preserves leadership and volunteer roles', () => {
  const html = readSiteFile('index.html');

  assert.match(html, /小班班长/);
  assert.match(html, /朋辈导师/);
  assert.match(html, /医工研创工作室外联部部长/);
  assert.match(html, /第七次人口普查普查员/);
});
```

- [ ] **Step 2: Run the content test to verify it fails**

Run:

```powershell
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-content.test.cjs
```

Expected: FAIL on the new assertions because the detailed resume content is not in `index.html` yet

- [ ] **Step 3: Populate the remaining sections and supporting styles**

```html
<!-- replace the placeholder sections in index.html with the full markup below -->
<section id="awards" class="panel reveal">
  <div class="section-heading">
    <p class="eyebrow">Awards</p>
    <h2>完整奖项与荣誉</h2>
  </div>
  <div class="award-summary">
    <article><strong>国家级</strong><span>基础医学、智能技术应用等多项奖项</span></article>
    <article><strong>省级</strong><span>互联网+、挑战杯、康复产业创新创业大赛</span></article>
    <article><strong>校级</strong><span>竞赛荣誉、奖学金、优秀学生干部等持续积累</span></article>
    <article><strong>公开报道</strong><span>省级媒体 2 次、校级平台 2 次、院级平台 6 次</span></article>
  </div>
  <div class="award-groups">
    <section class="award-group">
      <h3>国家级与赛区成果</h3>
      <ul>
        <li>第七届全国大学生基础医学创新研究暨实验设计论坛国家银奖</li>
        <li>第七届全国大学生基础医学创新研究暨实验设计论坛中南部赛区一等奖</li>
        <li>第四届全国大学生智能技术应用大赛国家一等奖</li>
        <li>第二届全国大学生智能技术应用大赛国家二等奖</li>
        <li>第三届全国大学生智能技术应用大赛国家二等奖、三等奖</li>
      </ul>
    </section>
    <section class="award-group">
      <h3>省级成果</h3>
      <ul>
        <li>第八届互联网+大学生创新创业大赛河南省二等奖</li>
        <li>第六届互联网+大学生创新创业大赛河南省三等奖</li>
        <li>第十五届挑战杯河南省大学生课外学术科技作品竞赛省级三等奖（两项）</li>
        <li>第二届康复产业创新创业大赛河南赛区三等奖</li>
        <li>第二届康复产业创新创业大赛河南赛区明日之星（两项）</li>
      </ul>
    </section>
    <section class="award-group">
      <h3>校级与综合荣誉</h3>
      <ul>
        <li>第十五届挑战杯校级一等奖</li>
        <li>第八届互联网+校级一等奖</li>
        <li>第七届互联网+校级三等奖</li>
        <li>2022 年度优秀学生朗读者校级三等奖</li>
        <li>校综合奖学金一等奖（2019-2020）</li>
        <li>校级综合奖学金二等奖（2020-2021）</li>
        <li>优秀学生干部、优秀应届毕业生、优秀实习生、最美志愿者等荣誉</li>
      </ul>
    </section>
  </div>
</section>

<section id="projects" class="panel reveal">
  <div class="section-heading">
    <p class="eyebrow">Research</p>
    <h2>科研项目与学术实践</h2>
  </div>
  <div class="timeline">
    <article class="timeline-item">
      <div class="timeline-mark"></div>
      <div>
        <p class="timeline-role">主持</p>
        <h3>混合现实在儿童自闭症患者注意力康复训练的应用</h3>
        <p>新乡医学院三全学院 2019 年度大学生科研立项项目，项目编号 2019010SS。</p>
      </div>
    </article>
    <article class="timeline-item">
      <div class="timeline-mark"></div>
      <div>
        <p class="timeline-role">主持</p>
        <h3>焦虑症患者心理治疗的增强现实场景构建</h3>
        <p>河南省高校国家级大学生创新训练计划，项目编号 S202013505013 / S202113505013。</p>
      </div>
    </article>
    <article class="timeline-item">
      <div class="timeline-mark"></div>
      <div>
        <p class="timeline-role">参与</p>
        <h3>基于脑机接口的脑卒中患者行走康复训练系统的设计</h3>
        <p>河南省高校国家级大学生创新训练计划，项目编号 S202113505005X。</p>
      </div>
    </article>
    <article class="timeline-item">
      <div class="timeline-mark"></div>
      <div>
        <p class="timeline-role">参与</p>
        <h3>基于“双院制”背景下就业创业教育对学生创新创业大赛参与度的研究</h3>
        <p>2021 年河南省民办教育协会课题，体现教育研究与竞赛组织实践。</p>
      </div>
    </article>
  </div>
</section>

<section id="publications" class="panel reveal">
  <div class="section-heading">
    <p class="eyebrow">Outputs</p>
    <h2>论文、专利与专业技能</h2>
  </div>
  <div class="dual-grid">
    <div class="content-card">
      <h3>论文与专利</h3>
      <ul class="stack-list">
        <li>张书铭、吴贝贝、徐珂珂等. 基于脑机接口的脑卒中患者康复训练装置实现方法的研究[J]. 中国医学工程, 2022, 30(07): 52-55.</li>
        <li>林坤强、吴贝贝、徐珂珂等. 辅助盲人出行的避障导航眼镜的研究与设计[J]. 福建电脑, 2022, 38(05): 99-101.</li>
        <li>申欣、王若凡、徐珂珂等. 沙库巴曲缬沙坦治疗慢性充血性心力衰竭患者的临床研究[J]. 医学研究杂志社, 2022, 4(04): 51-52.</li>
        <li>正在申请：一种智能控温水冷防护服。</li>
        <li>正在申请：一种辅助盲人出行的避障导航眼镜。</li>
      </ul>
    </div>
    <div class="content-card">
      <h3>课程与技能</h3>
      <ul class="stack-list">
        <li>专业课程：电路、数字信号处理、单片机原理、医用传感器、医学图像处理、Python、嵌入式系统原理与开发、微型计算机原理与接口、模拟电子技术。</li>
        <li>软件能力：熟练掌握 Proteus、Keil、Office、Visio。</li>
        <li>写作与整理：擅长文献阅读、材料整理与内容撰写。</li>
        <li>资格证书：普通话二级甲等、英语四级、驾驶证。</li>
      </ul>
    </div>
  </div>
</section>

<section id="service" class="panel reveal">
  <div class="section-heading">
    <p class="eyebrow">Leadership & Service</p>
    <h2>任职经历与志愿服务</h2>
  </div>
  <div class="service-list">
    <article class="service-item">
      <h3>小班班长</h3>
      <p>2019.09 - 2023.07，组织班级活动、协调班委工作，配合老师推进教学与学风建设，所在班级获 2021 年“五好团支部”称号。</p>
    </article>
    <article class="service-item">
      <h3>朋辈导师</h3>
      <p>指导学生科研与竞赛文件打磨，辅导团队选题、文献查取、项目文档与 PPT 制作，辅导团队成员 30 余人。</p>
    </article>
    <article class="service-item">
      <h3>医工研创工作室外联部部长</h3>
      <p>负责活动资源报备、教授联络、现场秩序维护与问题协调，支撑工作室专业活动落地。</p>
    </article>
    <article class="service-item">
      <h3>第七次人口普查普查员 / 志愿者</h3>
      <p>参与师生信息录入与核对工作，并在疫情防控、疫苗接种、核酸采集与返乡服务中承担信息录入和秩序维护任务。</p>
    </article>
  </div>
</section>
```

```css
/* append these section styles to styles.css */
.award-summary,
.award-groups,
.dual-grid,
.service-list {
  display: grid;
  gap: 18px;
}

.award-summary {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 22px;
}

.award-summary article,
.award-group,
.content-card,
.service-item {
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.84);
}

.award-summary strong {
  display: block;
  margin-bottom: 8px;
  color: var(--accent);
}

.award-groups {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.award-group h3,
.content-card h3,
.service-item h3,
.timeline-item h3 {
  margin-top: 0;
  margin-bottom: 12px;
}

.award-group ul,
.stack-list {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--muted);
  line-height: 1.8;
}

.timeline {
  position: relative;
  display: grid;
  gap: 18px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 11px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: rgba(23, 50, 39, 0.14);
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 18px;
  padding: 6px 0 6px 0;
}

.timeline-mark {
  width: 24px;
  height: 24px;
  margin-top: 4px;
  border-radius: 999px;
  background: linear-gradient(135deg, #173227, #5d7c6a);
  box-shadow: 0 0 0 6px rgba(219, 229, 220, 0.9);
}

.timeline-role {
  margin: 0 0 8px;
  color: var(--accent);
  font-size: 0.86rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dual-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.stack-list li + li {
  margin-top: 10px;
}

.service-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

- [ ] **Step 4: Run the content and UI tests to verify they pass**

Run:

```powershell
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-content.test.cjs
$env:NODE_PATH='C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-ui.test.cjs
```

Expected: PASS for the expanded content assertions and the existing hero smoke test

- [ ] **Step 5: Record a checkpoint**

Run:

```powershell
Get-Item index.html, styles.css, tests\site-content.test.cjs | Select-Object Name,Length
```

Expected: `index.html` now contains the full content sections and `styles.css` includes award/timeline/grid rules

### Task 4: Add polished interaction behavior and responsive guarantees

**Files:**
- Modify: `script.js`
- Modify: `styles.css`
- Modify: `tests/site-ui.test.cjs`

- [ ] **Step 1: Expand the UI test to fail on the required interactions and mobile layout**

```js
// replace tests/site-ui.test.cjs with the fuller version below
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

async function openPage(viewport) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  const pageUrl = pathToFileURL(path.resolve(process.cwd(), 'index.html')).href;
  await page.goto(pageUrl);
  return { browser, page };
}

test('hero renders a split layout with four stat cards and abstract artwork', async () => {
  const { browser, page } = await openPage({ width: 1440, height: 1200 });

  try {
    await page.waitForSelector('.hero-grid');
    assert.equal(await page.locator('.stat-card').count(), 4);
    assert.equal(await page.locator('.hero-art').isVisible(), true);
  } finally {
    await browser.close();
  }
});

test('desktop navigation scrolls to the awards section and marks content as visible', async () => {
  const { browser, page } = await openPage({ width: 1440, height: 1200 });

  try {
    await page.click('a[href="#awards"]');
    await page.waitForTimeout(400);

    const hash = await page.evaluate(() => window.location.hash);
    assert.equal(hash, '#awards');

    const awardsTop = await page.locator('#awards').evaluate((node) => node.getBoundingClientRect().top);
    assert.ok(awardsTop < 220, `awards section did not scroll close enough to top: ${awardsTop}`);

    const visibleCount = await page.locator('.reveal.is-visible').count();
    assert.ok(visibleCount >= 3, `expected at least 3 visible reveal sections, got ${visibleCount}`);
  } finally {
    await browser.close();
  }
});

test('mobile layout collapses grids into a single column', async () => {
  const { browser, page } = await openPage({ width: 390, height: 844 });

  try {
    const heroColumns = await page.locator('.hero-grid').evaluate((node) => getComputedStyle(node).gridTemplateColumns);
    const awardsColumns = await page.locator('.award-groups').evaluate((node) => getComputedStyle(node).gridTemplateColumns);

    assert.equal(heroColumns.split(' ').length, 1);
    assert.equal(awardsColumns.split(' ').length, 1);
  } finally {
    await browser.close();
  }
});
```

- [ ] **Step 2: Run the UI test to verify it fails**

Run:

```powershell
$env:NODE_PATH='C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-ui.test.cjs
```

Expected: FAIL because the current `script.js` does not mark reveal items visible during scroll and the stylesheet has not added mobile collapse rules yet

- [ ] **Step 3: Implement scroll reveals, active navigation feedback, and responsive collapse**

```js
// replace script.js with the interaction layer below
const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const revealNodes = Array.from(document.querySelectorAll('.reveal'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function setActiveLink(activeId) {
  for (const link of navLinks) {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('is-active', isActive);
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    }
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -10% 0px'
  }
);

for (const node of revealNodes) {
  revealObserver.observe(node);
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleSection) {
      setActiveLink(visibleSection.target.id);
    }
  },
  {
    threshold: [0.2, 0.45, 0.7],
    rootMargin: '-18% 0px -55% 0px'
  }
);

for (const section of sections) {
  sectionObserver.observe(section);
}

setActiveLink('hero');

for (const link of navLinks) {
  link.addEventListener('click', () => {
    const targetId = link.getAttribute('href').slice(1);
    setActiveLink(targetId);
  });
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  for (const node of revealNodes) {
    node.classList.add('is-visible');
  }
}
```

```css
/* append these interaction and responsive rules to styles.css */
.site-nav a.is-active {
  background: var(--accent);
  color: #f7faf7;
}

.award-group,
.service-item,
.timeline-item,
.content-card,
.stat-card {
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
}

.award-group:hover,
.service-item:hover,
.timeline-item:hover,
.content-card:hover,
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 36px rgba(16, 32, 26, 0.08);
  border-color: rgba(23, 50, 39, 0.2);
}

@media (max-width: 980px) {
  .hero-grid,
  .intro-grid,
  .award-groups,
  .award-summary,
  .dual-grid,
  .service-list {
    grid-template-columns: 1fr;
  }

  .site-header {
    border-radius: 28px;
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 720px) {
  .page-shell {
    padding: 16px 16px 56px;
  }

  .panel {
    padding: 22px;
    border-radius: 24px;
  }

  .site-nav {
    gap: 10px;
  }

  .site-nav a {
    padding: 7px 10px;
    font-size: 0.94rem;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 4: Run the full test suite to verify it passes**

Run:

```powershell
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-content.test.cjs
$env:NODE_PATH='C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\12066\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-ui.test.cjs
```

Expected: PASS for all content and UI assertions

- [ ] **Step 5: Record the final implementation checkpoint**

Run:

```powershell
Get-Item index.html, styles.css, script.js, tests\site-content.test.cjs, tests\site-ui.test.cjs | Select-Object Name,Length
```

Expected: all five files exist, and the site is ready for visual review in a browser
