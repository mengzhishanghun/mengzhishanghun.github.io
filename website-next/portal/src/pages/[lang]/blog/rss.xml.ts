import type {APIRoute} from 'astro';
import {getPublishedPosts,postHref} from '../../../../../shared/blog';
// RSS 统一由 /blog/rss.xml 提供，不再发布语言前缀版本。
export function getStaticPaths(){return [];}
const xml=(value:string)=>value.replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]!));
export const GET:APIRoute=async({params})=>{
 const lang=params.lang==='en'?'en':'zh';
 const origin=new URL(process.env.BLOG_SITE_URL??'http://127.0.0.1:4321');
 if(!['http:','https:'].includes(origin.protocol)||origin.username||origin.password)throw new Error('Invalid BLOG_SITE_URL');
 const absolute=(value:string)=>xml(new URL(value,origin).href);
 const posts=(await getPublishedPosts()).filter(post=>post.data.lang===lang);
 const items=posts.map(post=>'<item><title>'+xml(post.data.title)+'</title><link>'+absolute(postHref(post))+'</link><guid isPermaLink="true">'+absolute(postHref(post))+'</guid><description>'+xml(post.data.description)+'</description><pubDate>'+post.data.date.toUTCString()+'</pubDate>'+post.data.tags.map(tag=>'<category>'+xml(tag)+'</category>').join('')+'</item>').join('');
 return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>MZSH Blog</title><link>'+absolute('/'+lang+'/blog/')+'</link><description>'+xml(lang==='zh'?'工具开发与实践记录':'Notes on tools and development')+'</description><language>'+(lang==='zh'?'zh-CN':'en')+'</language>'+items+'</channel></rss>',{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
};
