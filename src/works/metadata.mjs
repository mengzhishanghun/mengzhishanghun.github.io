import {parseFragment} from 'parse5';
import {attrs,walk,applyEdits} from '../build/extract-dom.mjs';
import {assertWorkInfo} from '../build/source-schema.mjs';
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderWorkTitles(html,entry,entries,locale){
  if(entry.type!=='work'&&!['page:home','page:works-index'].includes(entry.id))return html;
  const works=entries.filter(item=>item.type==='work');
  const bySlug=new Map(works.map(item=>[item.slug,item]));
  const byRoute=new Map(works.flatMap(item=>(item.legacyRoutes||[]).map(route=>[route,item])));
  const hasClass=(node,name)=>(attrs(node).class||'').split(/\s+/).includes(name);
  const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
  const edits=[];
  walk(parseFragment(html,{sourceCodeLocationInfo:true}),group=>{
    if(!hasClass(group,'project-title-group'))return;
    let heading,secondary;
    walk(group,node=>{if(/^h[1-3]$/.test(node.tagName||''))heading=node;if(hasClass(node,'project-title-secondary'))secondary=node;});
    if(!heading)return;
    let work=entry.type==='work'?entry:undefined,headingContent=heading,card;
    if(!work)for(let parent=group.parentNode;parent;parent=parent.parentNode){const slug=attrs(parent)['data-slug'];if(slug){work=bySlug.get(slug);card=parent;break;}}
    walk(heading,node=>{if(node.tagName==='a'){headingContent=node;work??=byRoute.get(attrs(node).href);}});
    if(!work)return;
    const name=work.sources[locale].data.title,current=text(heading).trim(),subtitle=secondary?text(secondary).trim():'';
    const label=card&&attrs(card)['aria-label'];
    if(label&&!label.includes(name)){const at=card.sourceCodeLocation.attrs['aria-label'];edits.push([at.startOffset,at.endOffset,'aria-label="'+escapeHTML(name+' · '+label)+'"']);}
    if(current===name){
      if(subtitle===name){const loc=secondary.sourceCodeLocation;edits.push([loc.startOffset,loc.endOffset,'']);}
      return;
    }
    const loc=headingContent.sourceCodeLocation;
    edits.push([loc.startTag.endOffset,loc.endTag.startOffset,escapeHTML(name)]);
    if(secondary){const at=secondary.sourceCodeLocation;edits.push([at.startTag.endOffset,at.endTag.startOffset,escapeHTML(current)]);}
    else {const at=heading.sourceCodeLocation;edits.push([at.endOffset,at.endOffset,'<p class="project-title-secondary">'+escapeHTML(current)+'</p>']);}
  });
  return applyEdits(html,edits);
}
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
  const a=actions.sourceCodeLocation;
  edits.push([a.startTag.endOffset,a.endTag.startOffset,buttons]);
  return applyEdits(html,edits);
}
