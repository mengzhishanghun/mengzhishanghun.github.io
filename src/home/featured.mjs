import {parse} from 'parse5';
import {attrs,walk,applyEdits} from '../build/extract-dom.mjs';

const hasClass=(node,name)=>(attrs(node).class || '').split(/\s+/).includes(name);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderFeaturedCategories(html,entries,locale) {
  const targets=new Map(entries.flatMap(entry=>(entry.legacyRoutes || []).map(route=>[route,entry])));
  const edits=[];
  walk(parse(html,{sourceCodeLocationInfo:true}),panel=>{
    if(!Object.hasOwn(attrs(panel),'data-feature-panel'))return;
    let category,target;
    walk(panel,node=>{
      if(hasClass(node,'feature-category'))category=node;
      if(node.tagName==='h3')walk(node,link=>{if(link.tagName==='a')target ??= attrs(link).href;});
    });
    const entry=targets.get(target);
    if(!entry)throw Error('精选内容未登记: '+target);
    const label=entry.projectedCategory?.[locale]?.name;
    if(typeof label!=='string'||!label.trim())throw Error('精选分类缺失: '+entry.id+' '+locale);
    const loc=category?.sourceCodeLocation;
    if(!loc?.endTag)throw Error('精选分类容器缺失: '+entry.id);
    edits.push([loc.startTag.endOffset,loc.endTag.startOffset,escape(label)]);
  });
  return applyEdits(html,edits);
}
