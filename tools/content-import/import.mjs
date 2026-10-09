import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { parse, parseFragment } from 'parse5';
import YAML from 'yaml';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeExpressiveCode from 'rehype-expressive-code';
import * as pagefind from 'pagefind';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, '../..');
const manifest = JSON.parse(fs.readFileSync(path.join(here, 'manifest.json'), 'utf8'));
const args = process.argv.slice(2);
const check = args.includes('--check');
const vaultAt = args.indexOf('--vault');
if (vaultAt < 0 || !args[vaultAt + 1]) throw new Error('必须指定 --vault <MyObsidian 路径>');
const vault = path.resolve(args[vaultAt + 1]);
if (manifest.blogs.length !== 36 || manifest.cases.length !== 7 || manifest.manuals.length !== 16 || manifest.works?.length !== 24) throw new Error('清单数量不符');
if (manifest.deleteRoutes.join(',') !== '/blog/cnblogs-19165647/') throw new Error('删除清单不符');
const allEntries = [...manifest.blogs.map(x => ({...x, kind: 'blog'})), ...manifest.cases.map(x => ({...x, kind: 'case'})), ...manifest.manuals.map(x => ({...x, kind: 'manual'})), ...manifest.works.map(x => ({...x, kind: 'work'}))];
const unique = new Set(allEntries.map(x => x.route));
if (unique.size !== allEntries.length) throw new Error('清单 route 重复');
if (new Set(allEntries.map(x => x.source)).size !== allEntries.length) throw new Error('清单 source 重复');
const processor = await createMarkdownProcessor({ syntaxHighlight: false, remarkPlugins: [rejectRawHTML], rehypePlugins: [rehypeExpressiveCode] });
const headingProcessor = await createMarkdownProcessor({ syntaxHighlight: false });
const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeJSON = x => JSON.stringify(x).replace(/</g, '\\u003c');
const changes = new Map();
const removed = new Set();
const input = new Map();
const normalized = s => s.replace(/\r\n/g, '\n').trim();
const sha256 = s => createHash('sha256').update(normalized(s)).digest('hex');
function contactSection(body, source) {
  const headings = [...body.matchAll(/^## (联系方式|联系|支持)\s*$/gm)];
  const heading = headings.at(-1);
  if (!heading) throw new Error('手册缺联系章节: ' + source);
  const following = body.slice(heading.index + heading[0].length);
  if (/^##?\s/m.test(following)) throw new Error('联系章节不是主文末节: ' + source);
  const contact = following.trim();
  if (!contact || !contact.includes('https://mzsh.me/contact/')) throw new Error('联系章节内容不符: ' + source);
  return {main: body.slice(0, heading.index + heading[0].length), contact};
}

function safePath(base, rel) {
  if (path.isAbsolute(rel) || rel.includes('..') || rel.includes('\\')) throw new Error('非法清单路径: ' + rel);
  const result = path.resolve(base, rel);
  if (!result.startsWith(path.resolve(base) + path.sep)) throw new Error('路径越界: ' + rel);
  return result;
}
function routeFile(route) {
  if (!/^\/(blog|cases|docs|works)\/[a-z0-9/_-]+\/$/.test(route)) throw new Error('非法 route: ' + route);
  return safePath(site, route.slice(1) + 'index.html');
}
function readSource(entry) {
  const abs = safePath(path.join(vault, '网站'), entry.source);
  const raw = fs.readFileSync(abs, 'utf8');
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if (!match) throw new Error('缺少 frontmatter: ' + entry.source);
  const data = YAML.parse(match[1]);
  if (data.draft !== false || data.slug !== entry.route.split('/').filter(Boolean).at(-1)) throw new Error('未授权的草稿或 slug: ' + entry.source);
  if (data.type !== ({blog:'blog',case:'case',manual:'doc',work:'work'})[entry.kind]) throw new Error('内容类型不符: ' + entry.source);
  if (entry.kind === 'work' && JSON.stringify(data) !== JSON.stringify(entry.frontmatterBaseline))
    throw new Error('作品 frontmatter 漂移: ' + entry.source);
  const unsupported = value => {
    const copy = structuredClone(value);
    delete copy.title;
    delete copy.description;
    return copy;
  };
  if (entry.kind !== 'work' && JSON.stringify(unsupported(data)) !== JSON.stringify(unsupported(entry.frontmatterBaseline))) throw new Error('不支持同步的 frontmatter 字段变动: ' + entry.source);
  if (entry.kind === 'blog') {
    const first = raw.slice(match[0].length).match(/^\s*#\s+[^\n]+\n/);
    if (!first && entry.route !== '/blog/markdown-images/') throw new Error('笔记缺唯一首 H1: ' + entry.source);
    if (first && first[0].trim().replace(/^#\s*/, '').trim() !== data.title) throw new Error('笔记首 H1 与标题属性不一致: ' + entry.source);
    if (sha256(raw.slice(match[0].length + (first?.[0].length || 0))) !== entry.bodyBaselineSha256) throw new Error('笔记正文变动，局部同步拒绝: ' + entry.source);
  }
  if (entry.kind === 'manual') {
    const body = raw.slice(match[0].length);
    const section = contactSection(body, entry.source);
    if (sha256(section.main) !== entry.mainBodyBaselineSha256) throw new Error('手册非联系正文变动: ' + entry.source);
    for (const supplement of entry.supplementBodyBaselines || []) {
      const supplementRaw = fs.readFileSync(safePath(vault, supplement.source), 'utf8');
      const supplementBody = supplementRaw.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n/, '');
      if (sha256(supplementBody) !== supplement.sha256) throw new Error('手册补充正文变动: ' + supplement.source);
    }
  }
  if (entry.kind === 'manual' && (data.websiteRoute !== entry.route || JSON.stringify(data.supplementSources || []) !== JSON.stringify(entry.supplementSources || []))) throw new Error('手册 route/补充来源漂移: ' + entry.source);
  return {data, body: raw.slice(match[0].length), abs};
}
function attrs(node) { return Object.fromEntries((node.attrs || []).map(x => [x.name, x.value])); }
function walk(node, fn) { fn(node); for (const child of node.childNodes || []) walk(child, fn); }
function select(doc, pred, label, count = 1) {
  const found = []; walk(doc, n => { if (n.tagName && pred(n, attrs(n))) found.push(n); });
  if (found.length !== count) throw new Error(`${label}: 预期 ${count} 处，实际 ${found.length} 处`);
  return count === 1 ? found[0] : found;
}
function innerRange(node) {
  const loc = node.sourceCodeLocation;
  if (!loc?.startTag || !loc.endTag) throw new Error('HTML 节点无可替换边界');
  return [loc.startTag.endOffset, loc.endTag.startOffset];
}
function outerRange(node) { return [node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset]; }
function replace(html, edits) {
  let end = html.length;
  for (const [start, stop, value] of edits.sort((a,b) => b[0] - a[0])) {
    if (start < 0 || stop > end || start > stop) throw new Error('HTML 替换区间重叠');
    html = html.slice(0, start) + value + html.slice(stop);
    end = start;
  }
  return html;
}
function textOf(node) { let s = ''; walk(node, n => { if (n.nodeName === '#text') s += n.value; }); return s; }
function editText(node, value) { return [...innerRange(node), escapeHTML(value)]; }
function editAttr(node, name, value) {
  const loc = node.sourceCodeLocation?.attrs?.[name];
  if (!loc) throw new Error('缺少属性: ' + name);
  return [loc.startOffset, loc.endOffset, `${name}="${escapeHTML(value)}"`];
}
function sourceMedia(url, sourceAbs) {
  if (/^(https?:\/\/|mailto:|#)/i.test(url)) return url;
  if (url.startsWith('/') && !url.startsWith('//')) {
    let decoded;
    try { decoded = decodeURIComponent(url.split(/[?#]/)[0]); }
    catch { throw new Error('资源地址编码异常: ' + url); }
    if (fs.existsSync(safePath(site, decoded.slice(1)))) return url;
  }
  throw new Error('未知媒体或相对链接: ' + url + ' in ' + sourceAbs);
}
function rejectRawHTML() {
  return tree => {
    const visit = node => {
      if (node.type === 'html') throw new Error('来源包含未批准的原始 HTML');
      for (const child of node.children || []) visit(child);
    };
    visit(tree);
  };
}
function workImagePlugin(media, used) {
  return tree => {
    const definitions = new Map();
    const visit = (node, fn) => { fn(node); for (const child of node.children || []) visit(child, fn); };
    visit(tree, node => {
      if (node.type === 'definition') definitions.set(node.identifier.toLowerCase(), node.url);
    });
    visit(tree, node => {
      if (node.type !== 'image' && node.type !== 'imageReference') return;
      const url = node.type === 'image' ? node.url : definitions.get(node.identifier.toLowerCase());
      let decoded;
      try { decoded = decodeURIComponent(url); } catch { throw new Error('作品媒体地址编码异常: ' + url); }
      if (!url || media.length !== 1 || decoded !== media[0].source)
        throw new Error('作品含未知媒体: ' + url);
      used.push(media[0]);
      node.type = 'text';
      node.value = 'MZSH_WITHHELD_WORK_MEDIA_0';
      delete node.url;
      delete node.children;
    });
  };
}
function validateRendered(markup, item) {
  const forbidden = new Set(['script','style','link','meta','base','iframe','video','audio','object','embed','picture','source','svg','math','form','input','button']);
  const fragment = parseFragment(markup);
  walk(fragment, node => {
    if (!node.tagName) return;
    if (forbidden.has(node.tagName)) throw new Error('渲染内容含未批准节点: ' + node.tagName + ' in ' + item.abs);
    for (const attribute of node.attrs || []) {
      const name = attribute.name.toLowerCase(), value = attribute.value.trim();
      if (name.startsWith('on') || ['style','srcset','srcdoc','formaction','xlink:href'].includes(name))
        throw new Error('渲染内容含不安全属性: ' + name + ' in ' + item.abs);
      if (name === 'src' && node.tagName !== 'img') throw new Error('未批准媒体地址: ' + value + ' in ' + item.abs);
      if (name === 'href' && !(/^(https?:\/\/|mailto:|\/[^\/]|#)/i.test(value)) ||
          /[\u0000-\u001f\\]/.test(value)) throw new Error('不安全链接: ' + value + ' in ' + item.abs);
    }
    if (node.tagName === 'img') {
      const src = attrs(node).src;
      if (!src || !src.startsWith('/') || src.startsWith('//') || /[?#]/.test(src)) throw new Error('未批准图片地址: ' + src + ' in ' + item.abs);
      let decoded;
      try { decoded = decodeURIComponent(src); } catch { throw new Error('图片地址编码异常: ' + src); }
      if (!fs.existsSync(safePath(site, decoded.slice(1)))) throw new Error('未公开图片地址: ' + src + ' in ' + item.abs);
    }
  });
}
async function render(body, item) {
  const linked = body.replace(/(!?\[[^\]]*\]\()([^)]*)(\))/g, (all, lead, url, tail) => {
    const destination = sourceMedia(url, item.abs);
    return lead + destination + tail;
  });
  const result = await processor.render(linked);
  validateRendered(result.code, item);
  return result;
}
async function renderWork(body, item, withheld) {
  const media = item.media || [];
  if (body.includes('MZSH_WITHHELD_WORK_MEDIA_0')) throw new Error('作品正文含媒体保留标记: ' + item.abs);
  for (const image of media) {
    const actual = createHash('sha256').update(fs.readFileSync(safePath(vault, image.path))).digest('hex');
    if (actual !== image.sha256) throw new Error('作品媒体源 hash 漂移: ' + image.path);
  }
  const used = [];
  const workProcessor = await createMarkdownProcessor({syntaxHighlight:false, remarkPlugins:[rejectRawHTML, () => workImagePlugin(media, used)], rehypePlugins:[rehypeExpressiveCode]});
  const rendered = await workProcessor.render(body);
  if (used.length !== media.length || new Set(used).size !== used.length) throw new Error('作品媒体节点数量不符: ' + item.abs);
  let code = rendered.code;
  if (media.length) {
    const token = '<p>MZSH_WITHHELD_WORK_MEDIA_0</p>';
    if (code.split(token).length !== 2) throw new Error('作品媒体节点结构不符: ' + item.abs);
    code = code.replace(token, withheld);
  }
  validateRendered(code, item);
  return {...rendered, code};
}
function workHeadings(headings, route) {
  const required = ['作品简介','背景与目标','核心能力','适用场景','适用范围与边界'];
  const h2 = headings.filter(h => h.depth === 2).map(h => h.text);
  if (JSON.stringify(h2) !== JSON.stringify(required) &&
      JSON.stringify(h2) !== JSON.stringify([...required, '效果展示']))
    throw new Error('作品章节不符: ' + route);
  if (headings.some(h => h.depth < 2 || h.depth > 3) || !headings.some(h => h.depth === 3) ||
      new Set(headings.map(h => h.slug)).size !== headings.length)
    throw new Error('作品标题层级或锚点重复: ' + route);
  let section = '';
  for (const h of headings) {
    if (h.depth === 2) section = h.text;
    if (h.depth === 3 && section !== '核心能力') throw new Error('作品 H3 不在核心能力内: ' + route);
  }
}
function outline(headings) {
  const roots = [], stack = [];
  for (const h of headings.filter(x => x.depth >= 2 && x.depth <= 5)) {
    const node = {...h, children: []};
    while (stack.length && stack.at(-1).depth >= h.depth) stack.pop();
    if (stack.length) stack.at(-1).children.push(node);
    else roots.push(node);
    stack.push(node);
  }
  const renderList = (nodes, root = false) => nodes.map(h =>
    `<li class="outline-node" data-heading-depth="${h.depth}"><a href="#${encodeURIComponent(h.slug)}" class="outline-link${root ? ' outline-root-link' : ''}">${escapeHTML(h.text)}</a>${h.children.length ? `<ol class="outline-tree">${renderList(h.children)}</ol>` : ''}</li>`
  ).join('');
  return renderList(roots, true);
}
function readHTML(file) {
  const html = fs.readFileSync(file, 'utf8');
  return {html, doc: parse(html, {sourceCodeLocationInfo: true})};
}
function save(file, before, after) { if (before !== after) changes.set(file, after); }
function publicLabel(html) {
  return html.replace(/(<a\b[^>]*href="\/blog\/"[^>]*>)博客(?=<\/a>)/g, '$1笔记')
    .replace(/(<p class="master-section-title">)博客(<\/p>)/g, '$1笔记$2')
    .replace(/(<h1 class="list-page-title">)博客(<\/h1>)/g, '$1笔记$2')
    .replace(/<title>博客 · 小毛<\/title>/g, '<title>笔记 · 小毛</title>')
    .replace(/(data-content-name=")博客(")/g, '$1笔记$2')
    .replace(/(aria-label="返回)博客列表(")/g, '$1笔记列表$2')
    .replace(/(>返回)博客列表(<)/g, '$1笔记列表$2')
    .replace(/(title="小毛)博客( RSS")/g, '$1笔记$2')
    .replace(/(aria-label=")博客上下篇(")/g, '$1笔记上下篇$2')
    .replace(/(aria-label=")博客分类(")/g, '$1笔记分类$2')
    .replace(/精选博客/g, '精选笔记')
    .replace(/(data-content-name=")文章(")/g, '$1笔记$2');
}
function readingStyles(html) {
  if (html.includes('href="/assets/reading-area.css"')) return html;
  if (html.split('</head>').length !== 2) throw new Error('页面 head 边界异常');
  return html.replace('</head>', '<link rel="stylesheet" href="/assets/reading-area.css"></head>');
}
function ignorePagefind(html, node, edits) {
  if (attrs(node)['data-pagefind-ignore'] !== undefined) return;
  const loc = node.sourceCodeLocation?.startTag;
  if (!loc) throw new Error('缺少 Pagefind 忽略节点边界');
  const opening = html.slice(loc.startOffset, loc.endOffset);
  edits.push([loc.startOffset, loc.endOffset, opening.replace(/>$/, ' data-pagefind-ignore>')]);
}
function blogLayoutEdits(html, doc, item) {
  const label = item.route;
  const detail = select(doc, (n,a) => n.tagName === 'div' && a.class?.split(' ').includes('reading-detail'), '笔记详情容器 ' + label);
  const article = select(detail, (n,a) => n.tagName === 'article' && a.class?.split(' ').includes('master-panel'), '笔记 article ' + label);
  const oldHeads = article.childNodes.filter(n => n.tagName === 'header' && attrs(n).class?.split(' ').includes('item-heading'));
  const heroes = detail.childNodes.filter(n => n.tagName === 'header' && attrs(n)['data-note-hero'] !== undefined);
  if (oldHeads.length + heroes.length !== 1) throw new Error('笔记布局必须是旧版或新版唯一结构: ' + label);
  if (attrs(article)['aria-labelledby'] !== 'detail-' + item.data.slug) throw new Error('笔记 H1 关联失配: ' + label);
  const edits = [];
  const aside = select(detail, (n,a) => n.tagName === 'aside' && a.class?.split(' ').includes('article-sidebar'), '笔记目录侧栏 ' + label);
  const adjacent = select(article, (n,a) => n.tagName === 'nav' && a.class?.split(' ').includes('blog-adjacent'), '笔记上下篇 ' + label);
  ignorePagefind(html, aside, edits);
  ignorePagefind(html, adjacent, edits);
  if (oldHeads.length) {
    const old = oldHeads[0], parts = old.childNodes.filter(n => n.tagName);
    if (article.childNodes.find(n => n.tagName) !== old || parts.length !== 3 || parts[0].tagName !== 'p' ||
        parts[1].tagName !== 'h1' || parts[2].tagName !== 'p' ||
        !attrs(parts[0]).class?.split(' ').includes('eyebrow') || attrs(parts[1])['data-pagefind-meta'] !== 'title')
      throw new Error('旧版笔记标题区结构不符: ' + label);
    const headingId = attrs(parts[1]).id;
    if (headingId !== 'detail-' + item.data.slug || textOf(parts[0]).trim() !== item.data.categoryName)
      throw new Error('旧版笔记分类或 ID 不符: ' + label);
    const detailLoc = detail.sourceCodeLocation.startTag;
    const opening = html.slice(detailLoc.startOffset,detailLoc.endOffset)
      .replace('reading-detail', 'reading-detail has-project-hero note-detail')
      .replace(/>$/, ' data-blog-article="true" data-pagefind-body>');
    const hero = `<header class="project-hero note-hero" data-note-hero><div class="project-hero-copy"><p class="project-breadcrumb" data-pagefind-ignore><a href="/blog/">笔记</a><span>/</span><span class="note-category">${escapeHTML(item.data.categoryName)}</span></p><div class="project-title-group"><h1 id="${escapeHTML(headingId)}" data-pagefind-meta="title">${escapeHTML(item.data.title)}</h1></div><p class="project-description">${escapeHTML(item.data.description || '')}</p></div></header>`;
    edits.push([detailLoc.startOffset, detailLoc.endOffset, opening + hero]);
    edits.push([...outerRange(old), '']);
    const articleLoc = article.sourceCodeLocation.startTag;
    const articleOpening = html.slice(articleLoc.startOffset,articleLoc.endOffset)
      .replace(/\sdata-pagefind-body(?:="")?/, '')
      .replace(/\sdata-blog-article="true"/, '');
    if (articleOpening === html.slice(articleLoc.startOffset,articleLoc.endOffset)) throw new Error('旧版 Pagefind 标记缺失: ' + label);
    edits.push([articleLoc.startOffset,articleLoc.endOffset,articleOpening]);
  } else {
    const hero = heroes[0];
    if (detail.childNodes.find(n => n.tagName) !== hero ||
        !attrs(detail).class?.split(' ').includes('has-project-hero') ||
        attrs(detail)['data-blog-article'] !== 'true' || attrs(detail)['data-pagefind-body'] === undefined ||
        attrs(article)['data-blog-article'] !== undefined || attrs(article)['data-pagefind-body'] !== undefined)
      throw new Error('新版笔记布局或 Pagefind 标记不符: ' + label);
    const h1 = select(hero, (n,a) => n.tagName === 'h1' && a.id === 'detail-' + item.data.slug && a['data-pagefind-meta'] === 'title', '笔记 H1 ' + label);
    const category = select(hero, (n,a) => n.tagName === 'span' && a.class?.split(' ').includes('note-category'), '笔记分类 ' + label);
    const breadcrumb = select(hero, (n,a) => n.tagName === 'p' && a.class?.split(' ').includes('project-breadcrumb'), '笔记面包屑 ' + label);
    if (attrs(breadcrumb)['data-pagefind-ignore'] === undefined) throw new Error('笔记面包屑缺 Pagefind 忽略标记: ' + label);
    const summary = select(hero, (n,a) => n.tagName === 'p' && a.class?.split(' ').includes('project-description'), '笔记摘要 ' + label);
    edits.push(editText(h1,item.data.title),editText(category,item.data.categoryName),editText(summary,item.data.description || ''));
  }
  return edits;
}
for (const entry of allEntries) {
  const source = readSource(entry);
  const item = {...entry, ...source};
  const file = routeFile(entry.route);
  const {html, doc} = readHTML(file);
  const bodyNode = select(doc, (n,a) => n.tagName === 'div' && a.class?.split(' ').includes(entry.kind === 'manual' ? 'sl-markdown-content' : 'prose') && (entry.kind === 'manual' ? true : n.parentNode?.tagName === 'article'), '正文 ' + entry.route);
  const outlineNode = entry.kind === 'blog' ? null : select(doc, (n,a) => n.tagName === 'ol' && a.class?.split(' ').includes('outline-tree-root'), '目录 ' + entry.route);
  const edits = [];
  if (entry.kind === 'case') {
    const rendered = await render(source.body, item);
    const names = rendered.metadata.headings.map(x => x.text);
    if (JSON.stringify(names) !== JSON.stringify(['主要说明','环境','出现的问题','解决方案','结果'])) throw new Error('案例五节不符: ' + entry.route);
    edits.push([...innerRange(bodyNode), rendered.code], [...innerRange(outlineNode), outline(rendered.metadata.headings)]);
  }
  if (entry.kind === 'work') {
    const figures = [];
    walk(bodyNode, n => {
      if (n.tagName === 'figure' && attrs(n).class?.split(' ').includes('media-withheld')) figures.push(n);
    });
    if (figures.length !== (entry.media || []).length) throw new Error('作品屏蔽媒体占位数量不符: ' + entry.route);
    let withheld = '';
    if (figures.length) {
      withheld = html.slice(...outerRange(figures[0]));
      if (sha256(withheld) !== entry.media[0].withheldHtmlSha256)
        throw new Error('作品屏蔽媒体占位 hash 漂移: ' + entry.route);
    }
    const rendered = await renderWork(source.body, item, withheld);
    workHeadings(rendered.metadata.headings, entry.route);
    const fragment = parseFragment(rendered.code);
    for (const heading of rendered.metadata.headings) {
      select(fragment, (n,a) => n.tagName === 'h' + heading.depth && a.id === heading.slug,
        '作品正文锚点 ' + entry.route + ' #' + heading.slug);
    }
    edits.push([...innerRange(bodyNode), rendered.code], [...innerRange(outlineNode), outline(rendered.metadata.headings)]);
    save(file, html, replace(html, edits));
    input.set(entry.route, item);
    continue;
  }
  if (entry.kind === 'blog') {
    edits.push(...blogLayoutEdits(html,doc,item));
    if (entry.route !== '/blog/markdown-images/') {
      const sourceTitles = [];
      walk(bodyNode, n => { if (n.tagName === 'p' && attrs(n).class?.split(' ').includes('article-source-title')) sourceTitles.push(n); });
      if (sourceTitles.length > 1) throw new Error('重复来源首标题超过一处: ' + entry.route);
      if (sourceTitles.length) edits.push([...outerRange(sourceTitles[0]), '']);
    }
  }
  if (entry.kind === 'manual') {
    const sourceHeadings = (await headingProcessor.render(source.body)).metadata.headings;
    if (sourceHeadings[0]?.depth !== 1) throw new Error('手册缺源 H1: ' + entry.route);
    const mainHeadings = sourceHeadings.slice(1);
    const wrappers = bodyNode.childNodes.filter(n => n.tagName === 'div' && attrs(n).class?.includes('sl-heading-wrapper'));
    const supplementAt = wrappers.findIndex(n => /^使用说明补充$/.test(textOf(n).replace(/Section titled.*$/s, '').trim()));
    const mainWrappers = supplementAt < 0 ? wrappers : wrappers.slice(0, supplementAt);
    if (mainWrappers.length !== mainHeadings.length) throw new Error('手册主章节数量不符: ' + entry.route + ' source=' + mainHeadings.length + ' site=' + mainWrappers.length);
    const finalHeadings = [];
    for (let i = 0; i < mainWrappers.length; i++) {
      const heading = select(mainWrappers[i], n => /^h[2-6]$/.test(n.tagName || ''), '手册标题');
      const name = textOf(heading).trim();
      const expected = mainHeadings[i];
      if (name !== expected.text) throw new Error('手册主章节文本不符: ' + entry.route + ' ' + name + ' / ' + expected.text);
      const currentDepth = Number(heading.tagName[1]);
      const desiredDepth = expected.depth;
      if (currentDepth !== desiredDepth) {
        const wrapperClass = attrs(mainWrappers[i]).class;
        const classLoc = mainWrappers[i].sourceCodeLocation.attrs.class;
        edits.push([classLoc.startOffset, classLoc.endOffset, 'class="' + escapeHTML(wrapperClass.replace(/level-h[2-6]/, 'level-h' + desiredDepth)) + '"']);
        edits.push([heading.sourceCodeLocation.startTag.startOffset, heading.sourceCodeLocation.startTag.endOffset,
          html.slice(heading.sourceCodeLocation.startTag.startOffset, heading.sourceCodeLocation.startTag.endOffset).replace(/^<h[2-6]/, '<h' + desiredDepth)]);
        edits.push([heading.sourceCodeLocation.endTag.startOffset, heading.sourceCodeLocation.endTag.endOffset, '</h' + desiredDepth + '>']);
      }
      finalHeadings.push({depth: desiredDepth, slug: attrs(heading).id, text: name, rawId: true});
    }
    const duplicateTitles = [];
    walk(bodyNode, n => { if (n.tagName === 'p' && attrs(n).class?.split(' ').includes('article-source-title')) duplicateTitles.push(n); });
    if (duplicateTitles.length > 1) throw new Error('手册重复首标题超过一处: ' + entry.route);
    if (duplicateTitles.length) edits.push([...outerRange(duplicateTitles[0]), '']);
    const contactIndex = mainHeadings.length - 1;
    if (!['联系方式','联系','支持'].includes(mainHeadings[contactIndex]?.text)) throw new Error('手册联系章节不是主文末节: ' + entry.route);
    const contactWrapper = mainWrappers[contactIndex];
    const contactStart = contactWrapper.sourceCodeLocation.endOffset;
    const next = wrappers[contactIndex + 1];
    const contactEnd = next ? next.sourceCodeLocation.startOffset : bodyNode.sourceCodeLocation.endTag.startOffset;
    const contactHTML = (await render(contactSection(source.body, entry.source).contact, item)).code;
    edits.push([contactStart, contactEnd, '\n' + contactHTML + '\n']);
    for (const wrapper of wrappers.slice(mainWrappers.length)) {
      const heading = select(wrapper, n => /^h[2-6]$/.test(n.tagName || ''), '补充标题');
      finalHeadings.push({depth: Number(heading.tagName[1]), slug: attrs(heading).id, text: textOf(heading).trim(), rawId: true});
    }
    edits.push([...innerRange(outlineNode), outline(finalHeadings)]);
  }
  const pageTitle = select(doc, n => n.tagName === 'title', 'title ' + entry.route);
  edits.push(editText(pageTitle, entry.kind === 'manual' ? `${item.data.title} | MZSH Docs` : `${item.data.title} · 小毛`));
  if (entry.kind !== 'blog') {
    const h1 = select(doc, n => n.tagName === 'h1', 'h1 ' + entry.route);
    edits.push(editText(h1, item.data.title));
  }
  const description = select(doc, (n,a) => n.tagName === 'meta' && a.name === 'description', 'description ' + entry.route);
  edits.push(editAttr(description, 'content', item.data.description || ''));
  save(file, html, readingStyles(publicLabel(replace(html, edits))));
  input.set(entry.route, item);
}
function scriptJSON(doc, label) {
  const node = select(doc, (n,a) => n.tagName === 'script' && a['data-content-index-data'] !== undefined, label);
  return node;
}
let orderedBlogs = [];
for (const section of ['blog','cases']) {
  const file = path.join(site, section, 'index.html');
  const {html, doc} = readHTML(file);
  const script = scriptJSON(doc, section + ' 列表数据');
  const records = JSON.parse(html.slice(...innerRange(script)));
  const edits = [];
  for (const record of records) {
    const route = `/${section}/${record.slug}/`;
    if (manifest.deleteRoutes.includes(route)) continue;
    const item = input.get(route);
    if (!item || item.kind !== (section === 'blog' ? 'blog' : 'case')) throw new Error('列表存在清单外内容: ' + route);
    if (section === 'blog') {
      record.title = item.data.title;
      record.description = item.data.description || '';
    } else {
      record.body = normalized(item.body);
    }
    const card = select(doc, (n,a) => n.tagName === 'a' && a['data-content-card'] !== undefined && a['data-slug'] === record.slug, '卡片 ' + route);
    if (section === 'blog') {
      edits.push(editAttr(card, 'aria-label', record.title));
      const h2 = select(card, n => n.tagName === 'h2', '卡片标题 ' + route);
      edits.push(editText(h2, record.title));
    }
  }
  const finalRecords = records.filter(x => !manifest.deleteRoutes.includes(`/${section}/${x.slug}/`));
  if (section === 'blog' && finalRecords.length !== 36) throw new Error('笔记列表非 36 篇');
  if (section === 'cases' && finalRecords.length !== 7) throw new Error('案例列表非 7 篇');
  if (section === 'blog') orderedBlogs = finalRecords;
  edits.push([...innerRange(script), safeJSON(finalRecords)]);
  if (section === 'blog') {
    if (records.length === 37) {
      const deadCard = select(doc, (n,a) => n.tagName === 'a' && a['data-content-card'] !== undefined && a['data-slug'] === 'cnblogs-19165647', '删除卡片');
      edits.push([...outerRange(deadCard), '']);
      const notesButton = select(doc, (n,a) => n.tagName === 'button' && a['data-category'] === 'notes', '随笔数量');
      const count = select(notesButton, (n,a) => n.tagName === 'span' && a.class?.includes('content-category-count'), '分类计数');
      edits.push(editText(count, String(Number(textOf(count)) - 1)));
    } else if (records.length !== 36) throw new Error('笔记列表原始数量不符');
  }
  save(file, html, publicLabel(replace(html, edits)));
}
const rssFile = path.join(site, 'blog', 'rss.xml');
{
  const xml = fs.readFileSync(rssFile, 'utf8');
  let seen = new Set();
  const next = xml.replace(/<item>[\s\S]*?<\/item>/g, item => {
    const route = item.match(/<link>https:\/\/mzsh\.me(\/blog\/[a-z0-9-]+\/)\<\/link>/)?.[1];
    if (!route || seen.has(route)) throw new Error('RSS 链接异常');
    seen.add(route);
    if (manifest.deleteRoutes.includes(route)) return '';
    const source = input.get(route);
    if (!source) throw new Error('RSS 清单外项目: ' + route);
    return item.replace(/<title>[^<]*<\/title>/, '<title>' + escapeHTML(source.data.title) + '</title>');
  }).replace('<title>小毛博客</title>', '<title>小毛笔记</title>');
  if (![36,37].includes(seen.size)) throw new Error('RSS 原始项目数不符');
  save(rssFile, xml, next);
}
for (let index = 0; index < orderedBlogs.length; index++) {
  const record = orderedBlogs[index];
  const file = routeFile('/blog/' + record.slug + '/');
  const html = changes.get(file) || fs.readFileSync(file, 'utf8');
  const doc = parse(html, {sourceCodeLocationInfo:true});
  const nav = select(doc, (n,a) => n.tagName === 'nav' && a.class?.split(' ').includes('blog-adjacent'), '上下篇 ' + record.slug);
  const edits = [];
  for (const [relation, neighbour] of [['prev', orderedBlogs[index-1]], ['next', orderedBlogs[index+1]]]) {
    const links = nav.childNodes.filter(n => n.tagName === 'a' && attrs(n).rel === relation);
    if (links.length > 1 || (neighbour && links.length !== 1)) throw new Error('上下篇结构不符: ' + record.slug + ' ' + relation);
    if (!neighbour && links.length) { edits.push([...outerRange(links[0]), '']); continue; }
    if (!neighbour) continue;
    const link = links[0];
    edits.push(editAttr(link, 'href', '/blog/' + neighbour.slug + '/'));
    edits.push(editText(select(link, n => n.tagName === 'strong', '上下篇标题'), input.get('/blog/' + neighbour.slug + '/').data.title));
  }
  save(file, html, publicLabel(replace(html, edits)));
}
for (const route of manifest.deleteRoutes) {
  const file = routeFile(route);
  if (fs.existsSync(file)) removed.add(file);
}
const trackedHTML = execFileSync('git', ['ls-files', '-z', '--', '*.html'], {cwd:site}).toString('utf8').split('\0').filter(Boolean);
const previousThemeSha = '340052362f8cd68621cffaf2fbd5947045dc371065491c69bad60ce5fca823d4';
function fixDocsTheme(html, relative) {
  const doc = parse(html, {sourceCodeLocationInfo:true});
  const head = select(doc, n => n.tagName === 'head', '文档 head ' + relative);
  const scripts = head.childNodes.filter(n => n.tagName === 'script');
  const inline = scripts.filter(n => textOf(n).includes('StarlightThemeProvider'));
  const external = scripts.filter(n => attrs(n).src === '/assets/docs-theme.js');
  if (inline.length + external.length !== 1) throw new Error('未知文档主题脚本: ' + relative);
  let themed = html;
  if (inline.length) {
    const original = html.slice(...outerRange(inline[0]));
    if (sha256(original) !== previousThemeSha) throw new Error('文档主题初始化脚本已变化: ' + relative);
    themed = replace(html, [[...outerRange(inline[0]), '<script src="/assets/docs-theme.js"></script>']]);
  }
  return readingStyles(themed);
}
let docsPages = 0, docsRedirects = 0, workPages = 0, workRedirects = 0;
for (const relative of trackedHTML) {
  const file = path.join(site, relative);
  if (removed.has(file)) continue;
  if (!fs.existsSync(file)) {
    if (manifest.deleteRoutes.some(route => routeFile(route) === file)) continue;
    throw new Error('已跟踪 HTML 不存在: ' + relative);
  }
  const original = fs.readFileSync(file, 'utf8');
  const current = changes.get(file) || original;
  const doc = parse(current, {sourceCodeLocationInfo:true});
  const referenceEdits = [];
  walk(doc, node => {
    if (node.tagName !== 'a') return;
    const href = attrs(node).href;
    const source = input.get(href);
    if (source?.kind !== 'blog' || node.childNodes?.length !== 1 || node.childNodes[0].nodeName !== '#text') return;
    const existing = textOf(node).trim();
    if (/^(UE|C\+\+|Perforce|Python)：/.test(existing) && existing.endsWith(source.data.title)) referenceEdits.push(editText(node, source.data.title));
  });
  let updated = publicLabel(replace(current, referenceEdits));
  if (relative.startsWith('docs/')) {
    if (updated.includes('StarlightThemeProvider') || updated.includes('src="/assets/docs-theme.js"')) {
      updated = fixDocsTheme(updated, relative);
      docsPages++;
    } else if (/http-equiv=["']refresh/i.test(updated)) docsRedirects++;
    else throw new Error('未知文档页面类型: ' + relative);
  }
  if (relative.startsWith('works/') && relative !== 'works/index.html') {
    if (input.get('/' + relative.replace(/index\.html$/, ''))?.kind === 'work') {
      select(doc, (n,a) => n.tagName === 'header' && a.class?.split(' ').includes('project-hero'), '作品详情主视觉 ' + relative);
      workPages++;
      continue;
    }
    if (updated.includes('reading-detail')) {
      const workDoc = parse(updated, {sourceCodeLocationInfo:true});
      select(workDoc, (n,a) => n.tagName === 'header' && a.class?.split(' ').includes('project-hero'), '作品详情主视觉 ' + relative);
      updated = readingStyles(updated);
      workPages++;
    } else if (/http-equiv=["']refresh/i.test(updated)) workRedirects++;
    else throw new Error('未知作品页面类型: ' + relative);
  }
  save(file, original, updated);
}
if (docsPages !== 25 || docsRedirects !== 22 || workPages !== 24 || workRedirects !== 3)
  throw new Error(`文档或作品页面集合变化: docs=${docsPages}/${docsRedirects}, works=${workPages}/${workRedirects}`);
const stagedIndex = fs.mkdtempSync(path.join(site, 'tools', 'content-import', '.index-stage-'));
let indexChanged = false;
function filesUnder(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(x => x.isDirectory()
    ? filesUnder(path.join(dir,x.name)).map(y => x.name + '/' + y)
    : [x.name]).sort();
}
try {
  const created = await pagefind.createIndex({rootSelector:'[data-blog-article]', forceLanguage:'zh-cn'});
  if (created.errors.length || !created.index) throw new Error('Pagefind 创建失败: ' + created.errors.join('; '));
  for (const record of orderedBlogs) {
    const route = '/blog/' + record.slug + '/';
    const file = routeFile(route);
    const content = changes.get(file) || fs.readFileSync(file,'utf8');
    const indexed = parse(content);
    const root = select(indexed, (n,a) => a['data-blog-article'] === 'true', 'Pagefind 笔记根节点 ' + route);
    if (attrs(root)['data-pagefind-body'] === undefined || !attrs(root).class?.split(' ').includes('reading-detail'))
      throw new Error('Pagefind 笔记根节点无效: ' + route);
    const h1 = select(root, (n,a) => n.tagName === 'h1' && a['data-pagefind-meta'] === 'title', 'Pagefind 标题 ' + route);
    if (textOf(h1).trim() !== record.title) throw new Error('Pagefind 标题不符: ' + route);
    for (const name of ['project-breadcrumb','article-sidebar','blog-adjacent']) {
      const node = select(root, (n,a) => a.class?.split(' ').includes(name), 'Pagefind 导航 ' + name + ' ' + route);
      if (attrs(node)['data-pagefind-ignore'] === undefined) throw new Error('Pagefind 导航未忽略: ' + route + ' ' + name);
    }
    const result = await created.index.addHTMLFile({url:route, content});
    if (result.errors.length) throw new Error('Pagefind 索引失败 ' + route + ': ' + result.errors.join('; '));
    if (result.file.url !== route || result.file.meta.title !== record.title) throw new Error('Pagefind URL 或标题不符: ' + route);
  }
  const written = await created.index.writeFiles({outputPath:stagedIndex});
  if (written.errors.length) throw new Error('Pagefind 写出失败: ' + written.errors.join('; '));
  await pagefind.close();
  const target = path.join(site,'blog-search');
  const stagedFiles = filesUnder(stagedIndex), oldFiles = filesUnder(target);
  indexChanged = JSON.stringify(stagedFiles) !== JSON.stringify(oldFiles) ||
    stagedFiles.some(relative => !fs.readFileSync(path.join(stagedIndex,relative)).equals(fs.readFileSync(path.join(target,relative))));
  console.log(`预检 36/7/16/24；静态文件待更新 ${changes.size}、待删除 ${removed.size}、Pagefind 文件 ${stagedFiles.length}`);
  if (check) {
    if (changes.size || removed.size || indexChanged) { console.error('网站内容与 OB 不一致'); process.exitCode = 1; }
  } else {
    for (const [file, content] of changes) fs.writeFileSync(file, content);
    for (const file of removed) fs.rmSync(path.dirname(file), {recursive:true});
    if (indexChanged) {
      const backup = path.join(site,'tools','content-import','.index-backup');
      if (fs.existsSync(backup)) throw new Error('索引备份目录已存在');
      fs.renameSync(target, backup);
      try { fs.renameSync(stagedIndex, target); }
      catch (error) { fs.renameSync(backup, target); throw error; }
      fs.rmSync(backup,{recursive:true});
    }
  }
} finally {
  if (fs.existsSync(stagedIndex)) fs.rmSync(stagedIndex,{recursive:true});
}
