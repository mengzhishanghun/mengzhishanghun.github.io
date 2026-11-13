import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {projectPublication,filterPublicationHTML} from './publication.mjs';
const item=(id,type,status,stage)=>({id,type,slug:id.split(':')[1],legacyRoutes:['/'+id.replace(':','/')+'/'],languageCodes:['zh','en'],sources:{zh:{data:{status,workInfo:{stage}}}}});
test('development projects are excluded while independent tutorials and legacy publish flags remain public',()=>{
 const hidden=item('work:prototype','work','开发中'),ready=item('work:ready','work','完成'),doc=item('doc:guide','doc','开发中');ready.sources.zh.data.sitePublish=false;
 const entries=[hidden,ready,doc,item('case:robot','case',null,'developing')];
 const result=projectPublication({entries,config:{primary:'zh'},redirects:[{id:hidden.id,route:'/old/'},{id:doc.id,route:'/guide/'}]});
 assert.deepEqual(result.entries.map(e=>e.id),[ready.id,doc.id]);assert.deepEqual(result.redirects,[{id:doc.id,route:'/guide/'}]);
 hidden.sources.zh.data.status='完成';assert.ok(projectPublication({entries,config:{primary:'zh'}}).entries.some(e=>e.id===hidden.id));
 assert.throws(()=>projectPublication({entries,config:{primary:'zh'},redirects:[{id:'missing',route:'/bad/'}]}),/旧链目标缺失/);
});

test('development blogs are removed individually from routes, category membership and discovery markup',()=>{
 const hidden=item('blog:draft','blog','开发中'),ready=item('blog:ready','blog','完成');
 const index={id:'page:blog-index',type:'page',taxonomy:{categories:[{id:'notes',entities:[hidden.id,ready.id],supplements:[]}],entityOrder:[hidden.id,ready.id],legacyQueries:{notes:{entities:[hidden.id,ready.id]}}}};
 const options={entries:[hidden,ready,index],config:{primary:'zh'},redirects:[{id:hidden.id,route:'/old-draft/'},{id:ready.id,route:'/old-ready/'}]};
 const result=projectPublication(options),taxonomy=result.entries.at(-1).taxonomy;
 assert.deepEqual(result.entries.map(e=>e.id),['blog:ready','page:blog-index']);
 assert.deepEqual(result.redirects,[{id:'blog:ready',route:'/old-ready/'}]);
 assert.deepEqual([...result.hiddenRoutes].sort(),['/blog/draft/','/en/blog/draft/','/old-draft/','/zh/blog/draft/']);
 assert.deepEqual(taxonomy.categories,[{id:'notes',entities:['blog:ready'],supplements:[]}]);
 assert.deepEqual(taxonomy.entityOrder,['blog:ready']);
 assert.deepEqual(taxonomy.legacyQueries.notes.slugs,['ready']);
 const html='<a data-content-card data-slug="draft" href="/blog/draft/">draft card</a><a data-content-card data-slug="ready" href="/blog/ready/">ready card</a><script type="application/json">[{"id":"blog:draft","slug":"draft","type":"blog"},{"id":"blog:ready","slug":"ready","type":"blog"}]</script>';
 const markup=filterPublicationHTML(html,result);assert.doesNotMatch(markup,/draft/);assert.match(markup,/ready card/);
 hidden.sources.zh.data.status='完成';
 const restored=projectPublication(options);assert.deepEqual(restored.entries.map(e=>e.id),['blog:draft','blog:ready','page:blog-index']);assert.equal(restored.hiddenRoutes.size,0);
});
test('removed list cards do not grant resource sharing, but public article bodies do',t=>{
 const site=fs.mkdtempSync(path.join(os.tmpdir(),'publication-resource-'));t.after(()=>fs.rmSync(site,{recursive:true,force:true}));fs.mkdirSync(path.join(site,'src'));
 const hidden=item('case:robot','case','开发中');hidden.cover={websiteUrl:'/assets/robot.png'};
 const index={...item('page:cases-index','page'),template:'cases.html',mediaOccurrences:[{state:'public',websiteUrl:'/assets/robot.png'}]};
 fs.writeFileSync(path.join(site,'src/cases.html'),'<a data-content-card data-slug="robot" href="/case/robot/"><img src="/assets/robot.png"></a>');
 const options={site,entries:[hidden,index],config:{primary:'zh'}};
 assert.ok(projectPublication(options).hiddenResources.has('/assets/robot.png'));
 const article=item('doc:guide','doc');article.mediaOccurrences=[{state:'public',websiteUrl:'/assets/robot.png'}];
 assert.equal(projectPublication({...options,entries:[...options.entries,article]}).hiddenResources.has('/assets/robot.png'),false);
 fs.writeFileSync(path.join(site,'src/cases.html'),'<img src="/assets/robot.png">');
 assert.equal(projectPublication(options).hiddenResources.has('/assets/robot.png'),false);
});
test('removing hidden links preserves nested strong and emphasis markup',()=>{
 const projection=projectPublication({entries:[item('work:prototype','work','开发中')],config:{primary:'zh'}});
 assert.equal(filterPublicationHTML('<p><a href="/work/prototype/"><strong>MCPBlueprint</strong> <em>guide</em></a></p>',projection),'<p><strong>MCPBlueprint</strong> <em>guide</em></p>');
});
test('static hidden cards and JSON records are removed, ordinary links retain their text',()=>{
 const projection=projectPublication({entries:[item('work:prototype','work','开发中')],config:{primary:'zh'}});
 const html='<a data-content-card data-slug="prototype" href="/works/prototype/"><b>card</b></a><p><a href="/work/prototype/#x">reference</a></p><script type="application/json">[{"slug":"prototype","type":"work"},{"slug":"guide","type":"doc"}]</script>';
 const out=filterPublicationHTML(html,projection);assert.doesNotMatch(out,/card|href=|prototype/);assert.match(out,/<p>reference<\/p>/);assert.match(out,/guide/);
});
test('public taxonomy counts and resource ownership exclude only hidden project assets',()=>{
 const hidden=item('case:robot','case','开发中'),ready=item('case:driver','case','完成');
 hidden.cover={websiteUrl:'/assets/robot.png'};ready.cover={websiteUrl:'/assets/shared.png'};
 hidden.mediaOccurrences=[{state:'public',websiteUrl:'/assets/shared.png'}];
 const index={id:'page:cases-index',type:'page',taxonomy:{categories:[{id:'projects',entities:[hidden.id,ready.id],supplements:[{owner:hidden.id}]}],entityOrder:[hidden.id,ready.id],legacyQueries:{projects:{entities:[hidden.id,ready.id]}}}};
 const result=projectPublication({entries:[hidden,ready,index],config:{primary:'zh'}}),taxonomy=result.entries.at(-1).taxonomy;
 assert.deepEqual(taxonomy.categories[0].entities,[ready.id]);assert.deepEqual(taxonomy.categories[0].supplements,[]);
 assert.deepEqual(taxonomy.entityOrder,[ready.id]);assert.deepEqual(taxonomy.legacyQueries.projects.slugs,['driver']);
 assert.deepEqual([...result.hiddenResources],['/assets/robot.png']);
 assert.equal(index.taxonomy.categories[0].entities.length,2);
 const markup=filterPublicationHTML('<aside class="article-sidebar"><a class="article-back" href="/case/robot/">Back</a></aside>',result);
 assert.match(markup,/<span class="article-back">Back<\/span>/);assert.doesNotMatch(markup,/href=/);
});
