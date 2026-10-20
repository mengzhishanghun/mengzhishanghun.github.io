import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import YAML from 'yaml';
import {createMarkdownProcessor} from '@astrojs/markdown-remark';
import {publicFields,commonFields,assertPublicFields} from '../build/source-schema.mjs';
import {createLinkResolver} from './links.mjs';
import {resourcePath} from '../build/resources.mjs';
import {createTaxonomy} from './taxonomy.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
export const canonicalText=value=>String(value).replaceAll('\r\n','\n');
export const canonicalTextHash=value=>createHash('sha256').update(canonicalText(value)).digest('hex');
const safePath=(root,relative)=>{
  if(typeof relative!=='string'||!relative||path.isAbsolute(relative)||relative.includes('\\')||relative.split('/').some(p=>!p||p==='.'||p==='..'))throw new Error('同步路径越界');
  const file=path.resolve(root,relative);if(!file.startsWith(path.resolve(root)+path.sep))throw new Error('同步路径越界');
  let current=path.resolve(root);for(const part of relative.split('/')){current=path.join(current,part);if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())throw new Error('同步符号链接越界');}
  if(fs.existsSync(file)&&!fs.realpathSync(file).startsWith(fs.realpathSync(root)+path.sep))throw new Error('同步路径越界');return file;
};
export function parseSource(raw){
  const match=raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);if(!match)throw new Error('frontmatter缺失');
  return {raw,data:YAML.parse(match[1]),body:raw.slice(match[0].length)};
}
export const sourceText=(data,body)=>'---\n'+YAML.stringify(data,{lineWidth:0})+'---\n\n'+canonicalText(body).replace(/^\n/,'');
const binaryHash=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function projectSource(source,record,site,resolveLink){
  if(source.data.draft===true)throw new Error('草稿不得同步');
  if(source.data.lang!==undefined && source.data.lang!==record.lang)throw new Error('同步语言身份不符');
  if(record.slug && source.data.slug!==undefined && source.data.slug!==record.slug)throw new Error('同步slug身份不符');
  if(record.cover && (source.data.cover!==record.cover.source || source.data.websiteCoverUrl!==record.cover.websiteUrl))throw new Error('封面授权漂移');
  if(record.cover && site && binaryHash(fs.readFileSync(resourcePath(site,record.cover.websiteUrl.slice(1))))!==record.cover.publicSha256)throw new Error('封面hash漂移');
  const data=Object.fromEntries((record.kind==='common'?commonFields:publicFields).filter(k=>source.data[k]!==undefined).map(k=>[k,source.data[k]]));
  assertPublicFields(data,record.kind==='common');
  if(record.kind!=='common' && !record.cover){delete data.coverAlt;delete data.websiteCoverUrl;}
  if(record.kind!=='common')data.lang=record.lang;
  if(record.translationKey)data.translationKey=record.translationKey;
  if(record.supplements?.length)data.supplementSources=record.supplements;
  let body=source.body,ordinal=0;const edits=[];
  const projector=()=>tree=>{
    const visit=node=>{
      if(node.type==='html')throw new Error('来源原始HTML未授权');
      if(node.type==='imageReference')throw new Error('媒体引用未登记');
      if(node.type==='image'){
        const image=record.images?.[ordinal++];
        if(!image || image.id!==record.id+':media:'+image.ordinal || decodeURIComponent(image.source)!==decodeURIComponent(node.url))throw new Error('媒体occurrence身份或数量不符');
        if(!['public','withheld'].includes(image.state)||image.state==='withheld'&&(image.websiteUrl||image.publicSha256))throw new Error('媒体权限无效');
        if(image.state==='public'){
          if(!/^\/(?:assets|media|_astro)\//.test(image.websiteUrl||'') || /[?#]|\/\.\.\//.test(image.websiteUrl))throw new Error('公开媒体地址越界');
          if(site && binaryHash(fs.readFileSync(resourcePath(site,decodeURIComponent(image.websiteUrl.slice(1)))))!==image.publicSha256)throw new Error('公开媒体hash漂移');
        }
        const replacement=image.utilityId||image.state==='withheld'?'![](/media-occurrence/'+encodeURIComponent(image.id)+')':'!['+(node.alt||'')+'](/media-occurrence/'+encodeURIComponent(image.id)+')';
        edits.push([node.position.start.offset,node.position.end.offset,replacement]);
      }
      if(node.type==='link' && /^(?:javascript|data|file|obsidian):/i.test(node.url))throw new Error('不安全链接');
      if(resolveLink && ['link','definition'].includes(node.type)){
        const url=resolveLink(node.url,record);
        if(url!==node.url){
          const segment=body.slice(node.position.start.offset,node.position.end.offset),start=node.type==='definition'?segment.indexOf(':')+1:segment.lastIndexOf('](')+2;
          const offset=segment.indexOf(node.url,start);
          if(offset<start||start<1)throw new Error('链接URL位置不能唯一定位');
          edits.push([node.position.start.offset+offset,node.position.start.offset+offset+node.url.length,url]);
        }
      }
      for(const child of node.children||[])visit(child);
    };visit(tree);
  };
  const processor=await createMarkdownProcessor({syntaxHighlight:false,remarkPlugins:[projector]});await processor.render(body);
  if(ordinal!==(record.images||[]).length)throw new Error('媒体occurrence数量不符');
  for(const [start,end,value]of edits.sort((a,b)=>b[0]-a[0]))body=body.slice(0,start)+value+body.slice(end);
  return {data,body:canonicalText(body),raw:sourceText(data,body)};
}
export async function importContent({site,vault,sync,check=false,taxonomyOnly=false}){
  const configFile=sync?path.resolve(sync):safePath(site,'src/import/000-sync.local');
  if(!fs.existsSync(configFile))throw new Error('本机中文同步配置缺失；请配置 src/import/000-sync.local 或显式指定 --sync');
  const config=parseSource(fs.readFileSync(configFile,'utf8')).data;
  if(config.version!==1||config.primary!=='zh'||!Array.isArray(config.records))throw new Error('中文同步配置无效');
  if(config.records.some(record=>!['blog','work','case','doc','supplement'].includes(record.kind)||record.id==='site-copy'||record.id?.startsWith('page:')))throw new Error('页面与公共文案仅在网站仓库维护，不得从笔记库同步');
  const contentRoot=path.join(site,'src'),files=new Map(),updates=[];
  for(const [relative,fingerprint]of Object.entries(config.foreignFingerprints||{})){
    const file=safePath(contentRoot,relative);
    if(!fs.existsSync(file)||canonicalTextHash(fs.readFileSync(file,'utf8'))!==fingerprint)throw new Error('外语来源存在人工修改，先审核并更新同步指纹');
  }
  const manifest=JSON.parse(fs.readFileSync(safePath(site,'src/build/manifest.json'),'utf8'));
  if(taxonomyOnly){
    for(const record of config.records){const output=safePath(contentRoot,record.output);safePath(vault,record.source);if(record.publishedFingerprint&&(!fs.existsSync(output)||canonicalTextHash(fs.readFileSync(output,'utf8'))!==record.publishedFingerprint))throw Error('公开中文来源存在人工修改，保留并等待审核');}
    const target=safePath(site,'src/build/taxonomy.json'),previous=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):undefined;
    const raw=JSON.stringify(createTaxonomy({site,vault,config,manifest,parseSource,previous}),null,2)+'\n';
    const differences=!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==raw?['build/taxonomy.json']:[];
    if(!check)fs.writeFileSync(target,raw);return {files:1,differences};
  }
  const resolveLink=createLinkResolver({site,vault,records:config.records,manifest});
  for(const record of config.records){
    if(record.lang!==config.primary)throw new Error('同步仅允许中文来源');
    const output=safePath(contentRoot,record.output),input=safePath(vault,record.source);
    if(files.has(output))throw new Error('同步输出重复');
    if(record.publishedFingerprint && (!fs.existsSync(output)||canonicalTextHash(fs.readFileSync(output,'utf8'))!==record.publishedFingerprint))throw new Error('公开中文来源存在人工修改，保留并等待审核');
    const raw=fs.readFileSync(input,'utf8'),projection=await projectSource(parseSource(raw),record,site,resolveLink);
    files.set(output,projection.raw);updates.push({record,publishedFingerprint:canonicalTextHash(projection.raw),sourceFingerprint:binaryHash(Buffer.from(raw))});
  }
  const differences=[...files].filter(([file,raw])=>!fs.existsSync(file)||canonicalText(fs.readFileSync(file,'utf8'))!==raw).map(([file])=>path.relative(contentRoot,file).replaceAll('\\','/'));
  if(!check){for(const [file,raw]of files){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,raw)}for(const update of updates)Object.assign(update.record,{publishedFingerprint:update.publishedFingerprint,sourceFingerprint:update.sourceFingerprint});fs.writeFileSync(configFile,sourceText(config,'本机中文手动同步配置；包含私有路径与媒体权限，禁止提交。\n'));}
  return {files:files.size,differences};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),at=args.indexOf('--vault');
  if(at<0||!args[at+1])throw new Error('手动导入必须指定 --vault <中文笔记库>；静态构建请运行 src/build/build.mjs');
  const syncAt=args.indexOf('--sync');if(syncAt>=0&&!args[syncAt+1])throw new Error('--sync 必须指定配置文件路径');
  const result=await importContent({site:path.resolve(here,'../..'),vault:path.resolve(args[at+1]),sync:syncAt>=0?args[syncAt+1]:undefined,check:args.includes('--check'),taxonomyOnly:args.includes('--taxonomy-only')});
  console.log(`中文公开来源 ${result.files}，差异 ${result.differences.length}`);if(args.includes('--check')&&result.differences.length)process.exitCode=1;
}
