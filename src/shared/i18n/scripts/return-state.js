// A session cache is a fallback destination, never evidence of a previous entry.
const pagesKey='mzsh:return-pages:v1',intentKey='mzsh:return-intent:v1';
const pageLifetime=6*60*60*1000,intentLifetime=30000,maxPages=32;
const currentURL=()=>location.pathname+location.search+location.hash;
function localURL(value){
  if(typeof value!=='string'||value.length>4096)return null;
  try{const url=new URL(value,location.href);return url.origin===location.origin&&/^https?:$/.test(url.protocol)&&!url.username&&!url.password?url:null;}catch{return null;}
}
const language=url=>url.pathname.match(/^\/([a-z]{2,3}(?:-[a-z0-9]{2,8})*)\//)?.[1];
const validTop=value=>Number.isFinite(value)&&value>=0&&value<=10000000;
const validTime=(value,lifetime)=>Number.isFinite(value)&&value<=Date.now()&&Date.now()-value<=lifetime;
const validTags=(value,pathname)=>value&&value.key===pathname&&typeof value.category==='string'&&value.category.length<=200&&typeof value.expanded==='boolean';
function read(key){try{const raw=window.sessionStorage.getItem(key);return raw&&raw.length<=200000?JSON.parse(raw):null;}catch{return null;}}
function write(key,value){try{window.sessionStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
function remove(key){try{window.sessionStorage.removeItem(key);}catch{}}
function cleanRecord(value,lifetime){
  const url=localURL(value?.url);
  if(!url||!language(url)||!validTime(value.time,lifetime))return null;
  const record={url:url.pathname+url.search+url.hash,time:value.time};
  if(validTop(value.top))record.top=value.top;
  if(validTags(value.tags,url.pathname))record.tags={key:url.pathname,category:value.tags.category,expanded:value.tags.expanded};
  return record;
}
function pages(){const value=read(pagesKey);return Array.isArray(value)?value.slice(-maxPages).map(record=>cleanRecord(record,pageLifetime)).filter(Boolean):[];}
export function rememberSessionPage(options={}){
  const url=localURL(currentURL());if(!url||!language(url))return;
  const records=pages(),previous=records.find(record=>localURL(record.url)?.pathname===url.pathname),record={url:currentURL(),time:Date.now()};
  const saved=history.state?.mzshViewport,top=options.top??(saved?.key===record.url?saved.top:previous?.top);
  if(validTop(top))record.top=top;
  const tags=history.state?.mzshContentTags;
  if(validTags(tags,url.pathname))record.tags={key:url.pathname,category:tags.category,expanded:tags.expanded};
  write(pagesKey,[...records.filter(item=>localURL(item.url)?.pathname!==url.pathname),record].slice(-maxPages));
}
export function clearSessionReturn(expected){
  if(expected){const value=read(intentKey);if(value?.url!==expected.url||value?.time!==expected.time)return;}
  remove(intentKey);
}
export function prepareSessionReturn(href){
  clearSessionReturn();
  const target=localURL(href),from=localURL(currentURL());
  const fallback={url:target?target.pathname+target.search+target.hash:href,intent:null};
  if(!target||!from||target.search||target.hash||!language(from)||language(from)!==language(target))return fallback;
  const saved=pages().find(record=>localURL(record.url)?.pathname===target.pathname);
  if(!saved)return fallback;
  const intent={...saved,time:Date.now()};
  return write(intentKey,intent)?{url:intent.url,intent:{url:intent.url,time:intent.time}}:fallback;
}
export function applySessionReturn(){
  const raw=read(intentKey);remove(intentKey);if(!raw)return false;
  const intent=cleanRecord(raw,intentLifetime);if(!intent||intent.url!==currentURL())return false;
  const state=history.state&&typeof history.state==='object'&&!Array.isArray(history.state)?history.state:{};
  const additions={};
  if(validTop(intent.top))additions.mzshViewport={key:intent.url,top:intent.top};
  if(intent.tags)additions.mzshContentTags=intent.tags;
  history.replaceState({...state,...additions},'');
  return true;
}
