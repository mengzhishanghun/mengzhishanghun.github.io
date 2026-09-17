import { defineCollection, getCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const slug=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const blogCollection=defineCollection({loader:glob({pattern:'**/*.md',base:new URL('./posts/',import.meta.url),generateId:({entry})=>entry.replace(/\.md$/,'')}),schema:z.object({title:z.string(),description:z.string(),lang:z.enum(['zh','en']),slug,translationKey:slug,date:z.coerce.date(),draft:z.boolean(),tags:z.array(z.string()),productIds:z.array(slug).default([]),workIds:z.array(slug).default([]),docIds:z.array(slug).default([]),categoryId:slug,categoryName:z.string(),categoryOrder:z.number(),order:z.number(),status:z.string(),featured:z.boolean(),links:z.array(z.any()).default([])})});
export async function getPosts() {
  const posts = await getCollection('blog');
  const urls = new Set<string>();
  for(const post of posts){
    const url=post.data.lang+'/'+post.data.slug;
    if(urls.has(url)) throw new Error('Duplicate blog URL: '+url);
    urls.add(url);
  }
  return posts.sort((a,b)=>b.data.date.getTime()-a.data.date.getTime() || a.id.localeCompare(b.id));
}
export const isPublished = (post:{data:{draft:boolean;date:Date}}) => !post.data.draft && post.data.date.getTime() <= Date.now();
export const getPublishedPosts = async () => (await getPosts()).filter(isPublished);
export const getCategorizedPosts = async (lang:'zh'|'en') => (await getPublishedPosts()).filter(post=>post.data.lang===lang).sort((a,b)=>a.data.categoryOrder-b.data.categoryOrder || a.data.order-b.data.order || a.data.title.localeCompare(b.data.title));
export const postHref = (post:{data:{lang:string;slug:string}}) => post.data.lang==='zh'?'/blog/'+post.data.slug+'/':'/en/blog/'+post.data.slug+'/';
