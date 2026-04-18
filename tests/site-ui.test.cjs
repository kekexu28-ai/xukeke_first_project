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
