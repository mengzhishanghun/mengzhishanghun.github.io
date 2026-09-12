import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createIndex,close} from 'pagefind';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','portal','dist');
const {index,errors}=await createIndex({rootSelector:'[data-blog-article]'});
if(errors.length||!index)throw new Error(errors.join('; ')||'No search index');
let count=0;
try{
 for(const lang of ['zh','en']){
  const blog=path.join(root,lang,'blog');
  for(const entry of await fs.readdir(blog,{withFileTypes:true})){
   if(!entry.isDirectory()||entry.name==='drafts')continue;
   const file=path.join(blog,entry.name,'index.html');
   const content=await fs.readFile(file,'utf8');
   if(!content.includes('data-blog-article'))continue;
   const result=await index.addHTMLFile({url:'/'+lang+'/blog/'+entry.name+'/',content});
   if(result.errors.length)throw new Error(result.errors.join('; '));count++;
  }
 }
 const result=await index.writeFiles({outputPath:path.join(root,'blog-search')});
 if(result.errors.length)throw new Error(result.errors.join('; '));
 console.log('Blog search indexed '+count+' published articles; drafts excluded.');
}finally{await close();}
