const contentOwners=new Map();
function cleanupIndexes(){
  const current=new Set(document.querySelectorAll('[data-content-index]'));
  for(const [element,dispose]of contentOwners)if(!element.isConnected || !current.has(element)){dispose();contentOwners.delete(element);}
}
function readIndex(text){
  const records=JSON.parse(text);
  if(!Array.isArray(records) || records.some(record=>!record || !['slug','title','description','body','categoryId','categoryName'].every(key=>typeof record[key]==='string') || !Array.isArray(record.tags) || record.tags.some(tag=>typeof tag!=='string')))throw Error('Invalid content index');
  return records;
}
document.addEventListener('astro:after-swap',cleanupIndexes);
var e={title:120,tags:90,categoryName:70,description:55,body:20};function t(e){return e.normalize(`NFKC`).toLocaleLowerCase(document.documentElement.lang).replace(/\s+/g,` `).trim()}function n(e){return[...new Set(t(e).split(` `).filter(Boolean))]}function r(e){let n=t(e),r=t(e.replace(/([a-z\d])([A-Z])/g,`$1 $2`));return[...new Set([n,r,...n.split(/[^\p{L}\p{N}]+/u).filter(Boolean),...r.split(/[^\p{L}\p{N}]+/u).filter(Boolean)])]}function i(e,t,n){if(Math.abs(e.length-t.length)>n)return n+1;let r=Array.from({length:t.length+1},(e,t)=>t);for(let i=1;i<=e.length;i+=1){let a=[i],o=a[0];for(let n=1;n<=t.length;n+=1){let s=r[n-1]+(e[i-1]===t[n-1]?0:1),c=Math.min(r[n]+1,a[n-1]+1,s);a.push(c),o=Math.min(o,c)}if(o>n)return n+1;r=a}return r[t.length]}function a(e,n,a){let o=t(e);if(!o)return 0;if(o===n)return a*4;if(r(e).includes(n))return a*3;if(o.includes(n))return a*2+Math.min(n.length,20);if(n.length<4)return 0;let s=n.length>=9?2:1;return r(e).some(e=>e.length<3||Math.abs(e.length-n.length)>s?!1:i(e,n,s)<=s)?a:0}function o(t,n){let r=0,i=0;for(let o of n){let n=Math.max(a(t.title,o,e.title),...[...t.tags,...t.searchTags??[]].map(t=>a(t,o,e.tags)),a(t.categoryName,o,e.categoryName),a(t.description,o,e.description),a(t.body,o,e.body));n>0&&(r+=1,i+=n)}return{matchedTerms:r,score:i}}function s(e,t=1,n=9){let r=Math.ceil(e.length/n),i=Math.min(Math.max(Number.isFinite(t)?Math.floor(t):1,1),Math.max(r,1));return{items:e.slice(0,i*n),page:i,pageCount:r,total:e.length}}function c(e){if(e.dataset.ready===`true`)return;let t=e.querySelector(`[data-content-index-data]`),r=e.querySelector(`[data-content-query]`),i=e.querySelector(`[data-content-tags]`),a=e.querySelector(`[data-content-clear]`),c=e.querySelector(`[data-content-status]`),l=e.querySelector(`[data-content-empty]`),u=[...e.querySelectorAll(`[data-content-card]`)],d=[...e.querySelectorAll(`[data-content-group]`)],f=e.querySelector(`[data-content-pagination]`),p=e.querySelector(`[data-content-prev]`),m=e.querySelector(`[data-content-next]`),h=e.querySelector(`.content-index-main`),g=e.querySelector(`[data-content-query-label]`),_=e.querySelector(`.content-sort-label`),v=Number(e.dataset.pageSize),y=e.dataset.contentName||`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:2214"]||""}`,b=y===`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:2225"]||""}`?`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:2230"]||""}`:y===`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:2238"]||""}`?`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:2243"]||""}`:`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:2247"]||""}`;if(!t||!r||!i||!a||!c||!l||d.length===0)return;let x=t,S=r,C=i,w=a,T=c,E=l,D=readIndex(x.textContent||`[]`),O=new URLSearchParams(location.search),k=Number(O.get(`page`)||1),A=new Set(d.map(e=>e.dataset.category||``)),j=O.get(`category`)||d[0].dataset.category||``;A.has(j)||(j=d[0].dataset.category||``);const aliases=JSON.parse(e.dataset.contentTopicAliases||`{}`);if(!aliases||Array.isArray(aliases)||typeof aliases!==`object`||Object.values(aliases).some(value=>typeof value!==`string`))throw Error(`Invalid topic aliases`);let M=new Set(O.getAll(`tag`).map(tag=>Object.hasOwn(aliases,tag)?aliases[tag]:tag));S.value=O.get(`q`)||``;let N=()=>D.filter(e=>e.categoryId===j);
const legacyTags=new Map(u.map(card=>{
  const tags=JSON.parse(card.dataset.contentLegacyTags || '[]');
  if(!Array.isArray(tags)||tags.some(tag=>typeof tag!=='string'))throw Error('Invalid legacy tags');
  return [card.dataset.slug,tags];
}));
const savedTags=history.state?.mzshContentTags;
let expanded=savedTags?.key===location.pathname && savedTags.category===j && savedTags.expanded===true;
const tagsAlwaysVisible=e.dataset.contentTagsDisplay==='all';
const tagToggle=tagsAlwaysVisible?null:document.createElement('button');
if(tagToggle){
tagToggle.type='button';tagToggle.className='content-tag content-tags-toggle';tagToggle.dataset.contentTagsToggle='';
C.id ||= 'content-tags-'+[...document.querySelectorAll('[data-content-index]')].indexOf(e);
tagToggle.setAttribute('aria-controls',C.id);C.after(tagToggle);
tagToggle.addEventListener('click',()=>{
  expanded=!expanded;
  C.querySelectorAll('[data-tag]').forEach(button=>button.hidden=!expanded && button.dataset.tagOverflow==='true' && !M.has(button.dataset.tag));
  updateToggle();I();
});
}
function updateToggle(){
  if(!tagToggle)return;
  tagToggle.setAttribute('aria-expanded',String(expanded));
  tagToggle.textContent=window.SiteCopy[expanded?'content-index:tags-less':'content-index:tags-more']||'';
}
function focusTag(tag){
  const button=C.querySelector('[data-tag="'+CSS.escape(tag)+'"]');
  if(button && !button.hidden)button.focus();
  else if(tagToggle && !tagToggle.hidden)tagToggle.focus();
  else C.querySelector('[data-tag-all]')?.focus();
}

const scrollRoot=e.closest('.site-chrome-main');
let observer,checkFrame=0,exhausted=false;
const active=()=>e.isConnected && [...document.querySelectorAll('[data-content-index]')].includes(e);
function queueCheck(){
  if(!observer || exhausted || checkFrame)return;
  checkFrame=requestAnimationFrame(()=>{
    checkFrame=0;
    if(!active() || exhausted || m.hidden || m.disabled)return;
    const edge=m.getBoundingClientRect(),bounds=scrollRoot.getBoundingClientRect();
    if(edge.top<=bounds.bottom && edge.bottom>=bounds.top)R();
  });
}
if(scrollRoot && m && typeof IntersectionObserver==='function'){
  observer=new IntersectionObserver(entries=>{
    if(active() && !exhausted && !m.hidden && !m.disabled && entries.some(entry=>entry.target===m && entry.isIntersecting))R();
  },{root:scrollRoot});
  observer.observe(m);
}
contentOwners.set(e,()=>{observer?.disconnect();cancelAnimationFrame(checkFrame);});
function P(){let e=n(S.value);return N().map((t,n)=>({document:t,originalIndex:n,rank:o(t,e)})).filter(t=>e.length===0||t.rank.matchedTerms>0).sort((t,n)=>e.length>0&&(n.rank.matchedTerms-t.rank.matchedTerms||n.rank.score-t.rank.score)||t.originalIndex-n.originalIndex)}function F(e,t){let n=new Set(M);return t&&n.add(t),[...n].every(t=>e.tags.includes(t) || legacyTags.get(e.slug)?.includes(t))}function I(){let e=new URLSearchParams;j!==d[0].dataset.category&&e.set(`category`,j),S.value.trim()&&e.set(`q`,S.value.trim()),[...M].forEach(t=>e.append(`tag`,t)),k>1&&e.set(`page`,String(k)),history.replaceState({...history.state,mzshContentTags:{key:location.pathname,category:j,expanded}},``,location.pathname+(e.size?`?${e}`:``)+location.hash)}function L(records){
  const counts=new Map();N().forEach(record=>record.tags.forEach(tag=>counts.set(tag,(counts.get(tag)||0)+1)));
  const publicTags=[...counts.keys()].sort((a,b)=>(counts.get(b)||0)-(counts.get(a)||0)||a.localeCompare(b,document.documentElement.lang));
  const tags=[...publicTags,...[...M].filter(tag=>!counts.has(tag))];
  const all=document.createElement('button');all.type='button';all.className='content-tag';all.dataset.tagAll='';
  all.textContent=window.SiteCopy['_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:3624']||'';
  all.setAttribute('aria-pressed',String(M.size===0));
  all.addEventListener('click',()=>{M.clear();k=1;B();C.querySelector('[data-tag-all]')?.focus();});
  C.replaceChildren(all,...tags.map(tag=>{
    const selected=M.has(tag),matches=records.filter(record=>selected?F(record):F(record,tag)).length;
    const button=document.createElement('button');button.type='button';button.className='content-tag';button.dataset.tag=tag;
    const overflow=!tagsAlwaysVisible && (publicTags.indexOf(tag)>=8 || !counts.has(tag));
    button.dataset.tagOverflow=String(overflow);button.hidden=!expanded && overflow && !selected;
    button.setAttribute('aria-pressed',String(selected));button.disabled=!selected && matches===0;button.textContent=tag;
    button.setAttribute('aria-label',(window.SiteCopy[selected?'_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:4066':'_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:4078']||'')+tag);
    button.addEventListener('click',()=>{M.has(tag)?M.delete(tag):M.add(tag);k=1;B();focusTag(tag);});
    return button;
  }));
  if(tagToggle)tagToggle.hidden=publicTags.length<=8;
  updateToggle();
}function R(){if(!active()||exhausted||m?.disabled)return;k+=1;B(false)}function z(t){
  if(!f||!m)return;
  exhausted=k>=t;
  const focused=document.activeElement===m;
  f.hidden=(t<=1 || exhausted) && !focused;
  m.disabled=exhausted && !focused;
  m.hidden=exhausted && !focused;
  m.setAttribute('aria-disabled',String(exhausted));
  if(p)p.hidden=true;
  m.textContent=window.SiteCopy[exhausted?'content-index:all-shown':'content-index:load-more']||'';
  queueCheck();
}function B(rebuildTags=true){let e=P();if(rebuildTags)L(e.map(e=>e.document));let t=e.filter(e=>F(e.document)),r=s(t,k,v);k=r.page;let i=new Map(r.items.map((e,t)=>[e.document.slug,t]));u.forEach(e=>{let t=i.get(e.dataset.slug||``);e.hidden=t===void 0,t!==void 0&&(e.style.order=String(t))}),E.hidden=t.length>0;let a=n(S.value).length>0;_&&(_.textContent=a?`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:4746"]||""}`:`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:4754"]||""}`),T.textContent=`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:4776"]||""}${t.length} ${b}${y}${a?`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:4803"]||""}`:``}`,w.hidden=M.size===0&&!S.value.trim(),d.forEach(e=>{let t=e.dataset.category===j;e.setAttribute(`aria-pressed`,String(t))});let o=d.find(e=>e.dataset.category===j)?.dataset.categoryName||``;S.placeholder=`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:5023"]||""}${o}${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:5029"]||""}`,g&&(g.textContent=`${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:5061"]||""}${o}`),h?.setAttribute(`aria-label`,`${o}${window.SiteLanguageCode!==window.SitePrimaryCode?` `:``}${y}${window.SiteCopy["_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js:5108"]||""}`),z(r.pageCount),I()}d.forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=e.dataset.category||``;n!==j&&(M.clear(),expanded=false),j=n,k=1,B()})}),S.addEventListener(`input`,()=>{k=1,B()}),w.addEventListener(`click`,()=>{S.value=``,M.clear(),k=1,B(),S.focus()}),m?.addEventListener('blur',()=>{if(exhausted){m.hidden=true;m.disabled=true;if(f)f.hidden=true;}}),m?.addEventListener(`click`,R),B(),e.dataset.ready=`true`,e.querySelectorAll(`.content-category-nav, .content-filter`).forEach(control=>control.hidden=false),document.dispatchEvent(new CustomEvent(`mzsh:content-index-ready`,{detail:{element:e}})),queueCheck(),performance.clearMarks(`mzsh-filters-ready`),performance.mark(`mzsh-filters-ready`),requestAnimationFrame(()=>requestAnimationFrame(()=>{e.isConnected&&(performance.clearMarks(`mzsh-filters-painted`),performance.mark(`mzsh-filters-painted`))}))}function l(){
  cleanupIndexes();
  document.querySelectorAll('[data-content-index]').forEach(element=>{
    if(element.dataset.ready==='true' || element.dataset.ready==='failed')return;
    try{c(element);if(element.dataset.ready!=='true')throw Error('Incomplete content index');}
    catch{
      contentOwners.get(element)?.();contentOwners.delete(element);
      element.querySelectorAll('[data-content-card]').forEach(card=>card.hidden=false);
      element.querySelectorAll('.content-category-nav, .content-filter, [data-content-pagination]').forEach(control=>control.hidden=true);
      element.dataset.ready='failed';
      document.dispatchEvent(new CustomEvent('mzsh:content-index-ready',{detail:{element}}));
    }
  });
}document.addEventListener(`astro:page-load`,l),l();
