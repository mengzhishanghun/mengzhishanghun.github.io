import fs from 'node:fs';
import path from 'node:path';
const indexes={work:'page:works-index',case:'page:cases-index',blog:'page:blog-index'};
export function projectTaxonomy({site,entries,config,copy,taxonomy}) {
  if(!taxonomy){const file=path.join(site,'src/build/taxonomy.json');if(!fs.existsSync(file))throw Error('分类快照缺失');taxonomy=JSON.parse(fs.readFileSync(file,'utf8'));}
  if(taxonomy.version!==1||!taxonomy.sections||typeof taxonomy.sections!=='object'||Array.isArray(taxonomy.sections)||!Array.isArray(taxonomy.legacyOnly))throw Error('分类快照无效');
  for(const type of ['work','case','blog','doc'])if(!Object.hasOwn(taxonomy.sections,type))throw Error('分类分区缺失: '+type);
  const label=(category,code)=>{
    const value=code===config.primary?category.name:copy[code].scriptSlots['category:'+category.name];
    if(typeof value!=='string'||!value.trim())throw Error('分类译名缺失: '+code+' '+category.name);return value;
  };
  for(const [type,section]of Object.entries(taxonomy.sections)){
    if(!['work','case','blog','doc'].includes(type)||!Array.isArray(section.categories)||!section.legacyQueries)throw Error('分类分区无效');
    const items=entries.filter(e=>e.type===type),seen=new Set(),categoryIDs=new Set();let last=0;
    for(const category of section.categories){
      if(typeof category.name!=='string'||!category.name.trim()||!/^\w[\w-]*$/.test(category.id)||categoryIDs.has(category.id)||!Number.isInteger(category.order)||category.order<=last||!Array.isArray(category.entities)||!Array.isArray(category.supplements))throw Error('分类编号或身份重复无效');
      last=category.order;categoryIDs.add(category.id);
      for(const {code}of config.languages)label(category,code);
      for(const id of category.entities){const entry=items.find(e=>e.id===id);if(!entry||seen.has(id))throw Error('分类实体缺失或重复: '+id);seen.add(id);entry.projectedCategory=Object.fromEntries(config.languages.map(({code})=>[code,{id:category.id,name:label(category,code),order:category.order}]));}
      for(const supplement of category.supplements)if(!items.some(e=>e.id===supplement.owner))throw Error('分类补充主实体缺失');
    }
    if(seen.size!==items.length)throw Error('分类实体覆盖不完整: '+type);
    if(!Array.isArray(section.entityOrder)||section.entityOrder.length!==items.length||new Set(section.entityOrder).size!==items.length||section.entityOrder.some(id=>!seen.has(id)))throw Error('分类文章排序身份缺失或重复');
    for(const [id,query]of Object.entries(section.legacyQueries)){
      if(!query||typeof query.name!=='string'||!Array.isArray(query.entities)||new Set(query.entities).size!==query.entities.length||query.entities.some(id=>!seen.has(id)))throw Error('旧分类集合无效');
      const current=section.categories.find(c=>c.id===id);if(current&&JSON.stringify([...current.entities].sort())!==JSON.stringify([...query.entities].sort()))throw Error('新旧分类ID集合冲突');
    }
    const index=entries.find(e=>e.id===indexes[type]);if(index)index.taxonomy={...section,categories:section.categories.map(c=>({...c,labels:Object.fromEntries(config.languages.map(({code})=>[code,label(c,code)]))})),legacyQueries:Object.fromEntries(Object.entries(section.legacyQueries).map(([id,q])=>[id,{...q,slugs:q.entities.map(id=>items.find(e=>e.id===id).slug)}]))};
  }
}

const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function categoryNavigation(index,locale){return index.taxonomy.categories.map((category,i)=>`<button type="button" class="content-category" data-content-group data-category="${escape(category.id)}" data-category-name="${escape(category.labels[locale])}" aria-pressed="${i===0}"><span>${escape(category.labels[locale])}</span><span class="content-category-count">${category.entities.length}</span></button>`).join('');}
