import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {attrs,walk} from '../build/extract-dom.mjs';
import {regularPath} from '../build/resources.mjs';
const roots={work:'001-作品',case:'002-案例',blog:'003-博客',doc:'004-文档'};
const legacyBlogs=new Set(['19136345','19165484','19165541','19204715','19770930','19770934','20030737','20159718'].map(id=>'blog:cnblogs-'+id));
const numbered=name=>{const match=/^(\d{3})-(.+)$/.exec(name);if(!match||Number(match[1])<1)throw Error('分类编号缺失或无效');return {order:Number(match[1]),name:match[2]};};
const categoryId=(type,name)=>type+'-'+createHash('sha256').update(name).digest('hex').slice(0,12);
export function createTaxonomy({site,vault,config,manifest,parseSource,previous}) {
  const sections={},mapped=new Set(),outputs=new Set();
  const hiddenSources=new Set(),hiddenDirectories=new Set(),hiddenIDs=new Set(),sourceKeys=new Set(),blogRoot='网站/'+roots.blog+'/';
  if(!Array.isArray(config.reprints??[]))throw Error('隐藏转载配置无效');
  for(const record of config.reprints??[]){
    if(typeof record.source!=='string'||!record.source.startsWith(blogRoot))continue;
    const parts=record.source.split('/'),slug=record.id?.match(/^reprint:([a-z0-9]+(?:-[a-z0-9]+)*)$/)?.[1];
    if(!slug||parts.length<4||!/^\d+-.+\.md$/.test(parts.at(-1)))throw Error('隐藏转载来源目录或编号不符');
    numbered(parts[2]);
    const file=regularPath(vault,record.source),key=process.platform==='win32'?file.toLowerCase():file;
    if(sourceKeys.has(key)||hiddenIDs.has(record.id))throw Error('隐藏转载来源或身份重复');sourceKeys.add(key);hiddenIDs.add(record.id);
    const {data}=parseSource(fs.readFileSync(file,'utf8'));
    if(data.slug!==slug||data.websiteRoute!=='/zh/blog/reprints/'+slug+'/'||data.sitePublish!==true||data.visibility!=='unlisted')throw Error('隐藏转载来源身份不符');
    hiddenSources.add(record.source);hiddenDirectories.add(parts[2]);
  }
  const assertNoPublicReprints=({categories=[],legacyQueries={}}={})=>{
    for(const directory of hiddenDirectories){
      const {name}=numbered(directory);
      if(categories.some(category=>category.name===name)||Object.values(legacyQueries).some(query=>query.name===name))throw Error('已有公开分类不得转为隐藏转载分类');
    }
  };
  for(const directory of hiddenDirectories)if(config.records.some(record=>record.source.startsWith(blogRoot+directory+'/')))throw Error('普通记录不得与隐藏转载混用分类');
  assertNoPublicReprints(previous?.sections?.blog);
  for(const [type,root]of Object.entries(roots)){
    const relative='网站/'+root,base=path.join(vault,relative);
    if(fs.lstatSync(base).isSymbolicLink())throw Error('分类目录符号链接越界');
    const categories=fs.readdirSync(base,{withFileTypes:true}).filter(item=>item.isDirectory()).map(item=>{
      if(fs.lstatSync(path.join(base,item.name)).isSymbolicLink())throw Error('分类目录符号链接越界');
      const meta=numbered(item.name);return {...meta,id:previous?.sections?.[type]?.categories.find(c=>c.name===meta.name)?.id||categoryId(type,meta.name),entities:[],supplements:[],directory:item.name};
    }).sort((a,b)=>a.order-b.order);
    if(new Set(categories.map(c=>c.order)).size!==categories.length||new Set(categories.map(c=>c.name)).size!==categories.length)throw Error('分类编号或名称重复');
    const legacyQueries=structuredClone(previous?.sections?.[type]?.legacyQueries||{});
    for(const category of previous?.sections?.[type]?.categories||[]){
      const query={name:category.name,entities:[...category.entities]};
      if(legacyQueries[category.id]&&JSON.stringify([...legacyQueries[category.id].entities].sort())!==JSON.stringify([...query.entities].sort()))throw Error('历史分类ID集合冲突');
      legacyQueries[category.id]=query;
    }
    const folder=type==='work'?'works':type==='case'?'cases':type;
    const template=path.join(site,`src/${folder}/templates/page--${folder}-index.html`);
    let entityOrder=previous?.sections?.[type]?.entityOrder;
    if(!previous&&type!=='doc'&&fs.existsSync(template))walk(parse(fs.readFileSync(template,'utf8')),node=>{
      const a=attrs(node);if(a['data-content-group']!==undefined)legacyQueries[a['data-category']]={name:a['data-category-name'],entities:[]};
      if(a['data-content-index-data']!==undefined)entityOrder=JSON.parse(node.childNodes.map(n=>n.value||'').join('')).map(r=>type+':'+r.slug);
    });
    if(type==='blog')assertNoPublicReprints({legacyQueries});
    sections[type]={categories:type==='blog'?categories.filter(category=>!hiddenDirectories.has(category.directory)):categories,legacyQueries,entityOrder:entityOrder||manifest.entries.filter(e=>e.type===type).map(e=>e.id)};
    const scan=dir=>{for(const item of fs.readdirSync(path.join(vault,dir),{withFileTypes:true})){
      const relative=dir+'/'+item.name;if(item.isSymbolicLink())throw Error('分类来源符号链接越界');
      if(item.isDirectory())scan(relative);else if(item.name.endsWith('.md')&&item.name!=='README.md')mapped.add(relative);
    }};scan(relative);
  }
  for(const source of hiddenSources)if(!mapped.delete(source))throw Error('隐藏转载来源未在博客扫描中登记');
  const seen=new Set();
  for(const record of config.records){
    const type=record.kind==='supplement'?'doc':record.kind,section=sections[type];
    if(!section||record.lang!==config.primary||outputs.has(record.output)||!mapped.has(record.source))throw Error('分类同步身份或来源重复');outputs.add(record.output);mapped.delete(record.source);
    const parts=record.source.split('/');if(parts[0]!=='网站'||parts[1]!==roots[type]||!/^\d+-.+\.md$/.test(parts.at(-1)))throw Error('分类来源目录或编号不符');
    const category=section.categories.find(c=>c.directory===parts[2]);if(!category)throw Error('未知来源分类');
    const source=parseSource(fs.readFileSync(regularPath(vault,record.source),'utf8'));
    const entity=manifest.entries.find(e=>e.id===record.id);
    if(record.kind!=='supplement'){
      if(!entity||entity.type!==type||entity.slug!==record.slug||source.data.slug!==record.slug||seen.has(record.id))throw Error('分类主实体身份不符或重复');
      if(source.data.translationKey!==undefined&&source.data.translationKey!==record.translationKey)throw Error('分类翻译身份不符');
      seen.add(record.id);category.entities.push(record.id);
    }else{
      const owner=config.records.find(r=>r.kind==='doc'&&r.supplements?.includes(record.output));
      if(!owner||!manifest.entries.some(e=>e.id===owner.id))throw Error('分类补充文档主实体缺失');
      category.supplements.push({id:record.translationKey||record.output.split('/').at(-1).replace(/\.md$/,''),owner:owner.id});
    }
    if(!previous&&record.kind!=='supplement'){
      const data=parseSource(fs.readFileSync(regularPath(path.join(site,'src'),record.output),'utf8')).data;
      if(data.categoryId){section.legacyQueries[data.categoryId]||={name:data.categoryName||data.categoryId,entities:[]};section.legacyQueries[data.categoryId].entities.push(record.id);}
    }
  }
  if(mapped.size)throw Error('存在未登记分类来源');
  const legacyOnly=[];
  for(const entity of manifest.entries.filter(e=>Object.hasOwn(roots,e.type)&&!seen.has(e.id))){
    if(!legacyBlogs.has(entity.id))throw Error('缺失来源分类: '+entity.id);
    const category=sections.blog.categories.find(c=>c.name==='UE开发');if(!category)throw Error('历史博客承接分类缺失');
    category.entities.push(entity.id);legacyOnly.push(entity.id);
    if(!previous){sections.blog.legacyQueries.ue||={name:'UE',entities:[]};sections.blog.legacyQueries.ue.entities.push(entity.id);}
  }
  for(const [type,section]of Object.entries(sections))for(const category of section.categories){
    delete category.directory;category.entities.sort();category.supplements.sort((a,b)=>a.id.localeCompare(b.id));
    const old=section.legacyQueries[category.id];
    if(old&&JSON.stringify([...old.entities].sort())!==JSON.stringify(category.entities))category.id=categoryId(type,JSON.stringify([category.name,category.entities]));
    section.legacyQueries[category.id]||={name:category.name,entities:[...category.entities]};
  }
  for(const section of Object.values(sections))for(const query of Object.values(section.legacyQueries))query.entities.sort();
  return {version:1,sections,legacyOnly:legacyOnly.sort()};
}
