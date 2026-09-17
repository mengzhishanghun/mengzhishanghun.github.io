import { existsSync, realpathSync, readdirSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';

const mediaRoot = resolve(process.cwd(), 'portal/public/media');
const videoExtensions = new Set(['.mp4', '.webm', '.ogv']);
const audioExtensions = new Set(['.mp3', '.m4a', '.ogg', '.wav']);
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function extension(url: string) { return extname(new URL(url, 'https://media.invalid').pathname).toLowerCase(); }
function exactLocalPath(url: string, expected: Set<string>, label: string) {
  if (!url.startsWith('/media/')) throw new Error(`${label} must use /media/ or https: ${url}`);
  const parts = url.slice('/media/'.length).split('/');
  if (parts.some(part => !part || part === '.' || part === '..')) throw new Error(`Unsafe ${label} path: ${url}`);
  let cursor = mediaRoot;
  for (const part of parts) {
    if (!existsSync(cursor) || !readdirSync(cursor).includes(part)) throw new Error(`Missing or incorrectly cased ${label}: ${url}`);
    cursor = join(cursor, part);
  }
  if (!existsSync(cursor) || !realpathSync(cursor).startsWith(realpathSync(mediaRoot) + sep)) throw new Error(`Media must stay within portal/public/media: ${url}`);
  if (!expected.has(extension(url))) throw new Error(`Unsupported ${label} extension: ${url}`);
}
function validateUrl(url: string, expected: Set<string>, label: string) {
  if (url.startsWith('/media/')) return exactLocalPath(url, expected, label);
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error(`Invalid ${label} URL: ${url}`); }
  if (parsed.protocol !== 'https:' || !expected.has(extension(url))) throw new Error(`${label} must be an https URL with a supported extension: ${url}`);
}
function walk(node: any, visit: (node: any) => void) { visit(node); for (const child of node.children ?? []) walk(child, visit); }
function attributes(node: any) { return Object.fromEntries(Object.entries(node.attributes ?? {}).map(([key, value]) => [key, String(value)])); }

export function remarkMedia() {
  return (tree: any) => walk(tree, node => {
    if (node.type === 'html') throw new Error('Raw HTML is not allowed in content Markdown; use the supported media directives');
    if (node.type === 'image') {
      const decorative = node.title === 'decorative';
      if (!node.alt?.trim() && !decorative) throw new Error(`Markdown image requires non-empty alt text: ${node.url}`);
      validateUrl(node.url, imageExtensions, 'image');
      const alt = decorative ? '' : node.alt.trim();
      node.type = 'html';
      node.value = `<figure class="media-figure media-image"><button type="button" class="media-image-trigger" data-media-image data-media-src="${escapeHtml(node.url)}" data-media-alt="${escapeHtml(alt)}" aria-label="放大查看图片：${escapeHtml(alt || '装饰图片')}"><img src="${escapeHtml(node.url)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async"${decorative ? ' aria-hidden="true"' : ''}></button>${alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : ''}</figure>`;
      delete node.children;
      return;
    }
    if (node.type !== 'leafDirective') return;
    if (!['video', 'audio', 'bilibili'].includes(node.name)) throw new Error(`Unknown media directive ::${node.name}`);
    const props = attributes(node);
    const allowed = node.name === 'video' ? new Set(['src', 'poster', 'captions', 'transcript']) : node.name === 'audio' ? new Set(['src', 'transcript']) : new Set(['bvid', 'page']);
    for (const key of Object.keys(props)) if (!allowed.has(key)) throw new Error(`Illegal ::${node.name} attribute: ${key}`);
    const caption = (node.children ?? []).map((child: any) => child.value ?? '').join('').trim();
    if (!caption || (node.name !== 'bilibili' && !props.src)) throw new Error(`::${node.name} requires a description and ${node.name==='bilibili'?'bvid':'src'}`);
    if (node.name === 'bilibili') {
      if (!/^BV[1-9A-HJ-NP-Za-km-z]{10}$/.test(props.bvid ?? '') || !/^[1-9]\d*$/.test(props.page ?? '1')) throw new Error('::bilibili requires a strict BVID and positive page');
      node.type='html'; node.value=`<figure class="media-figure media-bilibili" data-bilibili data-bvid="${escapeHtml(props.bvid)}" data-page="${props.page??'1'}"><div class="bilibili-stage" data-bilibili-stage></div><figcaption>${escapeHtml(caption)}</figcaption><p class="media-actions"><button type="button" data-bilibili-load aria-label="加载 Bilibili 播放器：${escapeHtml(caption)}">加载播放器</button><button type="button" data-media-open-bilibili aria-label="放大播放：${escapeHtml(caption)}">放大播放</button><a href="https://www.bilibili.com/video/${escapeHtml(props.bvid)}/?p=${props.page??'1'}" target="_blank" rel="noopener noreferrer">前往 Bilibili 查看</a></p></figure>`; delete node.children; return;
    }
    validateUrl(props.src, node.name === 'video' ? videoExtensions : audioExtensions, node.name);
    if (props.poster) validateUrl(props.poster, imageExtensions, 'video poster');
    if (props.captions) validateUrl(props.captions, new Set(['.vtt']), 'video captions');
    if (props.transcript && !/^https:\/\//.test(props.transcript) && !props.transcript.startsWith('/')) throw new Error(`Transcript must be an https or site-absolute link: ${props.transcript}`);
    const source = escapeHtml(props.src), description = escapeHtml(caption);
    const transcript = props.transcript ? `<a href="${escapeHtml(props.transcript)}">文字稿</a>` : '';
    if (node.name === 'video') {
      const poster = props.poster ? ` poster="${escapeHtml(props.poster)}"` : '';
      const captions = props.captions ? `<track kind="captions" src="${escapeHtml(props.captions)}" srclang="zh" label="中文">` : '';
      node.type = 'html'; node.value = `<figure class="media-figure media-video"><video controls playsinline preload="none"${poster} data-managed-media><source src="${source}">${captions}</video><figcaption>${description}</figcaption><p class="media-actions"><button type="button" data-media-open-video aria-label="放大播放：${description}">放大播放</button><a href="${source}">直接访问视频</a>${transcript}</p></figure>`;
    } else {
      node.type = 'html'; node.value = `<figure class="media-figure media-audio"><audio controls preload="none" data-managed-media><source src="${source}"></audio><figcaption>${description}</figcaption><p class="media-actions"><a href="${source}">直接访问音频</a>${transcript}</p></figure>`;
    }
    delete node.children;
  });
}
