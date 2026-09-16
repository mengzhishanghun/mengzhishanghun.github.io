import {products,cases} from './catalog';
import {getPublishedPosts} from './blog';
export type ContentKind='product'|'case'|'doc'|'blog';
export type ContentLink={key:string;kind:ContentKind;title:string;description:string;href:string};
export async function relatedContent(key:string,lang:'zh'|'en') {
  const nodes=new Map<string,ContentLink>();const edges=new Map<string,Set<string>>();
  const add=(node:ContentLink)=>{if(nodes.has(node.key))throw new Error('Duplicate content ID: '+node.key);nodes.set(node.key,node);};
  const connect=(left:string,right:string)=>{for(const [a,b] of [[left,right],[right,left]]){if(!nodes.has(a)||!nodes.has(b))throw new Error('Unknown content relationship: '+a+' -> '+b);if(a===b)continue;if(!edges.has(a))edges.set(a,new Set());edges.get(a)!.add(b);}};
  for(const p of products){add({key:'product:'+p.id,kind:'product',title:p.name,description:p[lang].description,href:'/works/'+p.id+'/'});if(p.docPath)add({key:'doc:'+p.id,kind:'doc',title:p.name,description:lang==='zh'?'使用文档':'Documentation',href:'/docs/zh/'+p.docPath+'/'});}
  for(const item of cases)add({key:'work:'+item.id,kind:'case',title:item[lang].title,description:item[lang].summary,href:'/cases/'+item.id+'/'});
  const posts=(await getPublishedPosts()).filter(p=>p.data.lang===lang);
  for(const post of posts)add({key:'blog:'+post.data.slug,kind:'blog',title:post.data.title,description:post.data.description,href:'/blog/'+post.data.slug+'/'});
  for(const p of products)if(p.docPath)connect('product:'+p.id,'doc:'+p.id);
  for(const item of cases)for(const id of item.productIds){connect('work:'+item.id,'product:'+id);if(products.find(p=>p.id===id)?.docPath)connect('work:'+item.id,'doc:'+id);}
  for(const post of posts)for(const [kind,ids] of [['product',post.data.productIds],['work',post.data.workIds],['doc',post.data.docIds]] as const)for(const id of ids)connect('blog:'+post.data.slug,kind+':'+id);
  return [...(edges.get(key)??[])].map(id=>nodes.get(id)!);
}
