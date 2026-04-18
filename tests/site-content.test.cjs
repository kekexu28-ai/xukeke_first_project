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
