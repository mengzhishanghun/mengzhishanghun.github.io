import {parseFragment} from 'parse5';
import {attrs,walk,applyEdits} from '../build/extract-dom.mjs';
import {assertWorkInfo} from '../build/source-schema.mjs';
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderWorkBadges(data,labels){
  if(!data.workInfo)return '';
  assertWorkInfo(data.workInfo);
  const stage=data.workInfo.stage?'<span class="work-status work-status-'+data.workInfo.stage+'">'+escapeHTML(labels[data.workInfo.stage])+'</span>':'';
  return stage+data.workInfo.channels.filter(c=>c.kind!=='docs').map(c=>'<span class="work-status work-status-'+c.kind+'">'+escapeHTML(labels[c.kind])+'</span>').join('');
}
export function renderWorkCardStatuses(html,entries,locale,labels){
  const doc=parseFragment(html,{sourceCodeLocationInfo:true}),edits=[];
  const works=new Map(entries.filter(entry=>entry.type==='work').map(entry=>[entry.slug,entry]));
  walk(doc,card=>{
    const a=attrs(card);if(a['data-content-card']===undefined)return;
    const work=works.get(a['data-slug']);if(!work)return;
    const badges=renderWorkBadges(work.sources[locale].data,labels);if(!badges)return;
    let heading;walk(card,node=>{if(node.tagName==='h2' && (attrs(node.parentNode).class||'').split(/\s+/).includes('project-title-group'))heading=node;});
    if(!heading)throw new Error('作品卡片标题缺失: '+work.slug);
    const loc=heading.sourceCodeLocation;
    edits.push([loc.startOffset,loc.endOffset,'<div class="work-card-title-line">'+html.slice(loc.startOffset,loc.endOffset)+badges+'</div>']);
  });
  return applyEdits(html,edits);
}
export function renderWorkMetadata(html,data,labels){
  if(!data.workInfo)return html;
  const info=data.workInfo;assertWorkInfo(info);
  const doc=parseFragment(html,{sourceCodeLocationInfo:true}),edits=[];let title,actions;
  walk(doc,node=>{const classes=(attrs(node).class||'').split(/\s+/);if(classes.includes('project-title-group'))title=node;if(classes.includes('work-actions'))actions=node;});
  if(!title||!actions)throw new Error('作品信息插槽缺失');
  if(typeof data.description==='string')walk(doc,node=>{
    const a=attrs(node),loc=node.sourceCodeLocation;if(!loc)return;
    if((a.class||'').split(/\s+/).includes('project-description')&&loc.endTag)edits.push([loc.startTag.endOffset,loc.endTag.startOffset,escapeHTML(data.description)]);
    if(node.tagName==='meta'&&['description','og:description','twitter:description'].includes(a.name||a.property)&&loc.attrs?.content)edits.push([loc.attrs.content.startOffset,loc.attrs.content.endOffset,'content="'+escapeHTML(data.description)+'"']);
  });
  let heading;walk(title,node=>{if(node.tagName==='h1')heading=node;});
  if(!heading)throw new Error('作品标题缺失');
  const badges=renderWorkBadges(data,labels);
  const h=heading.sourceCodeLocation;
  edits.push([h.startOffset,h.endOffset,'<div class="work-title-line">'+html.slice(h.startOffset,h.endOffset)+badges+'</div>']);
  const missing=!info.channels.some(c=>c.kind==='docs')?'<button type="button" class="work-action work-action-unavailable" disabled>'+escapeHTML(labels.noDocs)+'</button>':'';
  const buttons=info.channels.map((c,index)=>'<a class="work-action'+(index===0?' work-action-primary':'')+'" href="'+escapeHTML(c.href)+'"'+(c.href.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':'')+'>'+escapeHTML(labels[c.kind==='sale'?'saleAction':c.kind==='open-source'?'sourceAction':'docsAction'])+'</a>').join('')+missing;
  // Keep unclassified source links as neutral legacy entries, never as open-source claims.
  const neutral=[];walk(actions,node=>{if(node.tagName==='a' && /^https:\/\/github\.com\//.test(attrs(node).href||'') && !info.channels.some(c=>c.href===attrs(node).href)){const loc=node.sourceCodeLocation;neutral.push(html.slice(loc.startOffset,loc.endOffset));}});
  const a=actions.sourceCodeLocation;
  edits.push([a.startTag.endOffset,a.endTag.startOffset,buttons+neutral.join('')]);
  return applyEdits(html,edits);
}
