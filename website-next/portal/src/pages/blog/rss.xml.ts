import type { APIRoute } from 'astro'; import { getPublishedPosts } from '../../../../shared/blog';
const xml=(text:string)=>text.replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]!));
export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('RSS requires the configured site URL');
  const posts = (await getPublishedPosts()).filter(post => post.data.lang === 'zh');
  const items = posts.map(post => {
    const href = xml(new URL(`/blog/${post.data.slug}/`, site).href);
    return `<item><title>${xml(post.data.title)}</title><link>${href}</link><guid>${href}</guid><description>${xml(post.data.description)}</description><pubDate>${post.data.date.toUTCString()}</pubDate></item>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>梦之殇魂博客</title><link>${xml(new URL('/blog/', site).href)}</link><description>技术思考、排障与开发记录。</description><language>zh-CN</language>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
