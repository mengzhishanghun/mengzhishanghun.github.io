import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, '../..');
const manifest = JSON.parse(fs.readFileSync(path.join(here, 'manifest.json'), 'utf8'));
const position = process.argv.indexOf('--vault');
if (position < 0 || !process.argv[position + 1]) throw new Error('必须指定 --vault');
const originalVault = path.resolve(process.argv[position + 1]);
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'mzsh-import-reject-'));
const casePath = manifest.cases[0].source;
const contactPath = manifest.manuals[0].source;
const paths = new Set([...manifest.blogs, ...manifest.cases, ...manifest.manuals, ...manifest.works].map(x => '网站/' + x.source));
const workPath = '作品/UE工具/010-SimpleBPInheritFix.md';
paths.add('网站/' + workPath);
for (const manual of manifest.manuals) for (const supplement of manual.supplementSources || []) paths.add(supplement);

function treeHash() {
  const digest = createHash('sha256');
  const walk = (dir, relative = '') => {
    for (const item of fs.readdirSync(dir, {withFileTypes:true}).sort((a,b) => a.name.localeCompare(b.name))) {
      if (!relative && ['.git','.idea','tools','website-next'].includes(item.name)) continue;
      const next = path.join(dir, item.name);
      const name = path.posix.join(relative.replaceAll('\\','/'), item.name);
      if (item.isDirectory()) walk(next, name);
      else if (item.isFile()) { digest.update(name); digest.update(fs.readFileSync(next)); }
    }
  };
  walk(site);
  return digest.digest('hex');
}
function run(check = true) {
  return spawnSync(process.execPath, [path.join(here,'import.mjs'),'--vault',fixture,...(check ? ['--check'] : [])], {cwd:here, encoding:'utf8'});
}
try {
  for (const relative of paths) {
    const from = path.join(originalVault, relative), to = path.join(fixture, relative);
    fs.mkdirSync(path.dirname(to), {recursive:true});
    fs.copyFileSync(from, to);
  }
  for (const work of manifest.works) for (const media of work.media || []) {
    const from = path.join(originalVault, media.path), to = path.join(fixture, media.path);
    fs.mkdirSync(path.dirname(to), {recursive:true});
    fs.copyFileSync(from, to);
  }
  const baseline = treeHash();
  const caseFile = path.join(fixture, '网站', casePath);
  const contactFile = path.join(fixture, '网站', contactPath);
  const workFile = path.join(fixture, '网站', workPath);
  const mediaWorkFile = path.join(fixture, '网站', '作品/UE工具/200-UEPackageManager.md');
  const originalCase = fs.readFileSync(caseFile,'utf8');
  const originalContact = fs.readFileSync(contactFile,'utf8');
  const originalWork = fs.readFileSync(workFile,'utf8');
  const originalMediaWork = fs.readFileSync(mediaWorkFile,'utf8');
  const tests = [
    ['引用式未知图片', caseFile, originalCase + '\n\n![未知图][pic]\n\n[pic]: /media/never-published.png\n', /未公开图片地址/],
    ['原始 img', caseFile, originalCase + '\n\n<img src="/assets/beian-official.png">\n', /原始 HTML/],
    ['原始 script', caseFile, originalCase + '\n\n<script>alert(1)</script>\n', /原始 HTML/],
    ['事件属性', caseFile, originalCase + '\n\n<img src="/assets/beian-official.png" onerror="alert(1)">\n', /原始 HTML/],
    ['引用式危险链接', caseFile, originalCase + '\n\n[危险链接][target]\n\n[target]: javascript:alert(1)\n', /不安全链接/],
    ['联系段未知图片', contactFile, originalContact + '\n\n![未知图](/media/never-published.png)\n', /未知媒体|未公开图片地址/],
    ['作品缺必需章节', workFile, originalWork.replace(/^## 适用场景\s*$/m, '### 适用场景'), /作品章节|作品正文/],
    ['作品未知图片', mediaWorkFile, originalMediaWork + '\n\n![未知图](/media/never-published.png)\n', /作品含未知媒体/],
    ['作品尖括号未知图片', mediaWorkFile, originalMediaWork + '\n\n![未知图](</media/never-published.png>)\n', /作品含未知媒体/],
    ['作品引用式未知图片', mediaWorkFile, originalMediaWork + '\n\n![未知图][unknown]\n\n[unknown]: /media/never-published.png\n', /作品含未知媒体/],
    ['作品 frontmatter 漂移', workFile, originalWork.replace('draft: false', 'draft: true'), /未授权的草稿/],
    ['作品摘要漂移', workFile, originalWork.replace(/^description: .+$/m, 'description: "changed"'), /作品 frontmatter 漂移/],
    ['作品出现 H1', workFile, originalWork + '\n\n# 多出的标题\n', /作品标题层级/],
    ['作品原始 HTML', workFile, originalWork + '\n\n<img src="/assets/beian-official.png">\n', /原始 HTML/],
    ['作品危险链接', workFile, originalWork + '\n\n[危险链接](javascript:alert(1))\n', /不安全链接/],
  ];
  for (const [label, file, mutated, expected] of tests) {
    fs.writeFileSync(file, mutated);
    const result = run(false);
    if (result.status === 0 || !expected.test(result.stderr + result.stdout)) throw new Error(label + ' 未被预期门禁拒绝: ' + result.stderr);
    if (treeHash() !== baseline) throw new Error(label + ' 失败后发布树发生变化');
    fs.writeFileSync(file, file === caseFile ? originalCase : file === contactFile ? originalContact : file === workFile ? originalWork : originalMediaWork);
    console.log(label + '：拒绝通过，发布树零变化');
  }
  const imageFile = path.join(fixture, manifest.works.find(x => x.media.length).media[0].path);
  const image = fs.readFileSync(imageFile);
  fs.writeFileSync(imageFile, Buffer.concat([image, Buffer.from('changed')]));
  const alteredImage = run(false);
  if (alteredImage.status === 0 || !/作品媒体源 hash 漂移/.test(alteredImage.stderr + alteredImage.stdout))
    throw new Error('作品图片 hash 漂移未被拒绝: ' + alteredImage.stderr);
  if (treeHash() !== baseline) throw new Error('作品图片 hash 漂移后发布树发生变化');
  fs.writeFileSync(imageFile, image);
  console.log('作品图片 hash 漂移：拒绝通过，发布树零变化');
  for (const [label, changed] of [
    ['作品正文变化', originalWork.replace('SimpleBPInheritFix 是', 'SimpleBPInheritFix 当前是')],
    ['作品重复 H3', originalWork.replace('### 定向修复与资产保存', '### 继承链扫描与定位')],
  ]) {
    fs.writeFileSync(workFile, changed);
    const result = run();
    if (result.status !== 1 || !/网站内容与 OB 不一致/.test(result.stderr + result.stdout))
      throw new Error(label + ' 未进入同步差异检查: ' + result.stderr);
    if (treeHash() !== baseline) throw new Error(label + ' 预检后发布树发生变化');
    fs.writeFileSync(workFile, originalWork);
    console.log(label + '：检测到待同步正文，发布树零变化');
  }
} finally {
  if (!fixture.startsWith(path.resolve(os.tmpdir()) + path.sep)) throw new Error('临时目录越界，拒绝清理');
  fs.rmSync(fixture, {recursive:true,force:true});
}
