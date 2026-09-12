import { defineCollection, getCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { products, works } from './catalog';
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const blogCollection = defineCollection({
  loader:glob({pattern:'**/*.md',base:new URL('./posts/',import.meta.url),generateId:({entry})=>entry.replace(/\.md$/,'')}),
  schema:z.object({
    title:z.string().min(1),description:z.string().min(1),lang:z.enum(['zh','en']),slug:slug.refine(value=>value!=='drafts','Reserved article URL: drafts'),
    translationKey:slug,date:z.coerce.date(),draft:z.boolean().default(true),tags:z.array(z.string().min(1)).default([]),
    productIds:z.array(z.string().refine(id=>products.some(p=>p.id===id),'Unknown product')).default([]),
    workIds:z.array(z.string().refine(id=>works.some(w=>w.id===id),'Unknown work')).default([]),
    docIds:z.array(z.string().refine(id=>products.some(p=>p.id===id&&p.docPath),'Unknown document')).default([]),
  })
});
export async function getPosts() {
  const posts = await getCollection('blog');
  const urls = new Set<string>(), translations = new Set<string>();
  for(const post of posts){
    const url=post.data.lang+'/'+post.data.slug, translation=post.data.lang+'/'+post.data.translationKey;
    if(urls.has(url)||translations.has(translation)) throw new Error('Duplicate blog URL or translation: '+url);
    urls.add(url);translations.add(translation);
  }
  return posts.sort((a,b)=>b.data.date.getTime()-a.data.date.getTime() || a.id.localeCompare(b.id));
}
export const isPublished = (post:{data:{draft:boolean;date:Date}}) => !post.data.draft && post.data.date.getTime() <= Date.now();
export const getPublishedPosts = async () => (await getPosts()).filter(isPublished);
export const postHref = (post:{data:{lang:string;slug:string}}) => '/'+post.data.lang+'/blog/'+post.data.slug+'/';
