import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {localeRoute} from '../site-build/build.mjs';

// This private source map exists only during an explicitly requested vault import.
export function createLinkResolver({site,vault,records,manifest}){
  const root=fs.realpathSync(vault),sources=new Map(),publicPaths=new Set(),publicMedia=new Set();
  const key=file=>process.platform==='win32'?file.toLowerCase():file;
  const inside=file=>{const full=path.resolve(file);if(!full.startsWith(root+path.sep))throw new Error('本地链接越界');const actual=fs.existsSync(full)?fs.realpathSync(full):full;if(!actual.startsWith(root+path.sep))throw new Error('本地链接越界');return actual;};
  const codes=fs.existsSync(path.join(site,'site-languages.json'))?JSON.parse(fs.readFileSync(path.join(site,'site-languages.json'),'utf8')).languages.map(l=>l.code):['zh','en'];
  for(const entry of manifest.entries){for(const code of codes)publicPaths.add(localeRoute(entry,code));for(const route of entry.legacyRoutes)publicPaths.add(route);for(const image of entry.mediaOccurrences||[])if(image.state==='public')publicMedia.add(image.websiteUrl);if(entry.cover)publicMedia.add(entry.cover.websiteUrl);}
  for(const redirect of manifest.redirects||[])publicPaths.add(redirect.route);
  for(const record of records){
    const file=inside(path.join(root,record.source)),entry=manifest.entries.find(e=>e.id===record.id);
    if(!entry)throw new Error('本地链接来源未登记公开实体');
    if(sources.has(key(file)))throw new Error('本地链接来源映射歧义');
    sources.set(key(file),{record,entry});
    for(const attachment of record.attachments||[]){
      if(typeof attachment.source!=='string'||attachment.source.startsWith('/')||attachment.source.includes('\\')||attachment.source.split('/').some(p=>!p||p==='.'||p==='..'))throw new Error('本地附件授权路径越界');
      const allowed=Object.values(entry.relativeLinkTargets||{}),target=inside(path.join(root,attachment.source));
      if(!/^https:\/\//.test(attachment.websiteUrl)||!allowed.includes(attachment.websiteUrl))throw new Error('本地附件公开目标未登记');
      if(!fs.existsSync(target)||createHash('sha256').update(fs.readFileSync(target)).digest('hex')!==attachment.sha256)throw new Error('本地附件hash漂移');
    }
  }
  return (url,record)=>{
    if(/^(?:https?|mailto|tel):/i.test(url))return url;
    if(/^[a-z][a-z0-9+.-]*:/i.test(url)||url.startsWith('//'))throw new Error('不安全链接协议');
    if(url.startsWith('#')||url.startsWith('?'))return url;
    const match=url.match(/^([^?#]*)([\s\S]*)$/),rawPath=match[1],suffix=match[2],decoded=decodeURIComponent(rawPath);
    if(!decoded||/[\\\0]/.test(decoded))throw new Error('本地链接路径无效');
    if(publicPaths.has(decoded)||publicMedia.has(decoded))return url;
    const paths=decoded.startsWith('/')?[path.join(root,decoded.slice(1))]:[path.resolve(root,decoded),path.resolve(path.dirname(path.join(root,record.source)),decoded)].filter(file=>file.startsWith(root+path.sep));
    if(!paths.length)throw new Error('本地链接越界');
    const candidates=paths.map(inside).filter(file=>fs.existsSync(file)&&fs.statSync(file).isFile());
    const unique=[...new Set(candidates.map(key))],authorized=[];
    if(unique.length>1)throw new Error('本地链接目标歧义');
    for(const candidate of unique){
      const source=sources.get(candidate);if(source)authorized.push({source});
      for(const attachment of record.attachments||[])if(key(inside(path.join(root,attachment.source)))===candidate)authorized.push({attachment});
    }
    if(authorized.length!==1)throw new Error(authorized.length?'本地链接目标歧义':'本地链接目标未登记');
    const target=authorized[0];
    if(target.source?.record.kind==='supplement')throw new Error('本地补充稿链接没有独立公开路由');
    if(suffix.includes('#'))throw new Error('本地Markdown或附件链接锚点不可核验');
    return (target.attachment?.websiteUrl||localeRoute(target.source.entry,'zh'))+suffix;
  };
}
