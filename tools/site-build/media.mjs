import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {attrs,walk,extractTemplate} from './extract-dom.mjs';
import {readSource,hash,boundedPath} from './build.mjs';
const require=createRequire(new URL('../content-import/package.json',import.meta.url));
const {parse}=require('parse5');
const {createMarkdownProcessor}=await import(pathToFileURL(require.resolve('@astrojs/markdown-remark')));
export async function mapMedia(entry,{vault,site}) {
  const source=readSource(vault,entry.locales.zh.source,'来源'),images=[];
  let currentAbs=source.abs;
  const collector=()=>tree=>{
    let sectionId='';
    const visit=node=>{
      if(node.type==='heading') sectionId=(node.children || []).map(x=>x.value || '').join('');
      if(node.type==='image')images.push({source:node.url,sectionId,sourceAbs:currentAbs});
      for(const child of node.children || [])visit(child);
    };visit(tree);
  };
  const processor=await createMarkdownProcessor({syntaxHighlight:false,remarkPlugins:[collector]});
  await processor.render(source.body);
  for(const relative of entry.supplementSources || []) {
    const supplement=readSource(vault,relative,'补充来源'); currentAbs=supplement.abs;
    await processor.render(supplement.body);
  }
  const baselinePath=entry.baselineTemplate || entry.template;
  const html=fs.readFileSync(boundedPath(site,baselinePath),'utf8'),doc=parse(html,{sourceCodeLocationInfo:true}),nodes=[];
  walk(doc,node=>{
    const classes=(attrs(node).class || '').split(/\s+/);
    if(node.tagName==='figure' && classes.some(c=>['media-figure','media-withheld'].includes(c)))nodes.push(node);
    if(node.tagName==='p' && node.childNodes?.some(n=>n.tagName==='a' && (attrs(n).class || '').split(/\s+/).includes('media-image-trigger')))nodes.push(node);
  });
  if(images.length!==nodes.length)throw new Error(`媒体DOM/AST不能唯一配对: ${entry.id} source=${images.length},DOM=${nodes.length}`);
  return images.map((image,i)=>{
    const node=nodes[i],publicURLs=[];
    walk(node,n=>{if(n.tagName==='img' && attrs(n).src)publicURLs.push(attrs(n).src);});
    const withheld=(attrs(node).class || '').split(/\s+/).includes('media-withheld');
    if(!withheld && (publicURLs.length<1 || new Set(publicURLs).size!==1))throw new Error('公开媒体地址不唯一: '+entry.id+' '+(i+1));
    const ref=(entry.sourceMediaReferences || []).find(r=>decodeURIComponent(r.source)===decodeURIComponent(image.source));
    const vaultPath=ref?.vaultPath || (image.source.startsWith('/') ? image.source.slice(1) : path.relative(vault,path.resolve(path.dirname(image.sourceAbs),decodeURIComponent(image.source))).replaceAll('\\','/'));
    const sourceBytes=fs.readFileSync(boundedPath(vault,vaultPath,'媒体'));
    const websiteUrl=withheld?undefined:publicURLs[0];
    const sourceSha256=hash(sourceBytes),publicSha256=websiteUrl?hash(fs.readFileSync(boundedPath(site,websiteUrl.slice(1),'媒体'))):undefined;
    if(publicSha256 && publicSha256!==sourceSha256)throw new Error('公开媒体hash漂移: '+entry.id+' '+(i+1));
    const markup=html.slice(node.sourceCodeLocation.startOffset,node.sourceCodeLocation.endOffset);
    const scaffold=extractTemplate('<html><body>'+markup+'</body></html>');
    return {id:entry.id+':media:'+(i+1),ordinal:i+1,source:image.source,sectionId:image.sectionId,vaultPath,sourceSha256,state:withheld?'withheld':'public',websiteUrl,publicSha256,baselineNodeSha256:hash(markup),scaffold:scaffold.template.replace(/^.*?<body>|<\/body>[\s\S]*$/g,''),slots:scaffold.slots};
  });
}
export function exportBodyUtilities(manifest,site,output) {
  const bodyUtilitySlots={},scaffolds={};
  for(const entry of manifest.entries) {
    const html=fs.readFileSync(boundedPath(site,entry.baselineTemplate),'utf8'),doc=parse(html,{sourceCodeLocationInfo:true});
    let ordinal=0;
    walk(doc,node=>{
      const a=attrs(node),classes=(a.class || '').split(/\s+/);
      const media=node.tagName==='figure' && classes.some(c=>['media-figure','media-withheld'].includes(c)) || node.tagName==='p' && node.childNodes?.some(n=>n.tagName==='a' && (attrs(n).class || '').split(/\s+/).includes('media-image-trigger'));
      const utility=node.tagName==='button' && (classes.some(c=>/copy/.test(c)) || a['data-copy-code']!==undefined) || node.tagName==='a' && classes.includes('sl-anchor-link');
      if(!media && !utility)return;
      const loc=node.sourceCodeLocation;
      if(!loc)return;
      const id=entry.id+':body-utility:'+ ++ordinal;
      const original=html.slice(loc.startOffset,loc.endOffset);
      const result=extractTemplate('<html><body>'+original+'</body></html>');
      bodyUtilitySlots[id]=result.slots;
      scaffolds[id]=result.template.replace(/^.*?<body>|<\/body>[\s\S]*$/g,'');
    });
  }
  fs.writeFileSync(output,JSON.stringify({version:1,bodyUtilitySlots},null,2)+'\n');
  return {bodyUtilitySlots,scaffolds};
}
export function exportHeadingScaffolds(manifest,site,utilityScaffolds) {
  const output={};
  for(const entry of manifest.entries.filter(e=>e.type==='doc')) {
    const html=fs.readFileSync(boundedPath(site,entry.baselineTemplate),'utf8'),doc=parse(html,{sourceCodeLocationInfo:true}),records=[];
    walk(doc,node=>{
      if(!(attrs(node).class || '').split(/\s+/).includes('sl-heading-wrapper'))return;
      const heading=node.childNodes?.find(n=>/^h[1-6]$/.test(n.tagName || ''));
      const anchor=node.childNodes?.find(n=>n.tagName==='a' && (attrs(n).class || '').split(/\s+/).includes('sl-anchor-link'));
      if(!heading)throw new Error('文档heading wrapper缺heading: '+entry.id);
      const loc=node.sourceCodeLocation,h=heading.sourceCodeLocation,oldId=attrs(heading).id;
      let template=html.slice(loc.startOffset,loc.endOffset);
      const changes=[[h.startTag.endOffset-loc.startOffset,h.endTag.startOffset-loc.startOffset,'{{headingMarkup}}']];
      if(anchor) {
        const a=anchor.sourceCodeLocation,raw=html.slice(a.startOffset,a.endOffset),extract=extractTemplate('<html><body>'+raw+'</body></html>').template.replace(/^.*?<body>|<\/body>[\s\S]*$/g,'');
        const utilityId=Object.keys(utilityScaffolds).find(id=>id.startsWith(entry.id+':body-utility:') && utilityScaffolds[id]===extract);
        if(!utilityId)throw new Error('文档heading辅助槽缺失: '+entry.id);
        changes.push([a.startOffset-loc.startOffset,a.endOffset-loc.startOffset,'{{anchor}}']);
        records.push({depth:Number(heading.tagName[1]),oldId,utilityId,template:null});
      } else records.push({depth:Number(heading.tagName[1]),oldId,template:null});
      changes.sort((a,b)=>b[0]-a[0]);for(const [start,end,value] of changes)template=template.slice(0,start)+value+template.slice(end);
      records.at(-1).template=template.replace(`id="${oldId}"`,'id="{{headingId}}"');
    });
    output[entry.id]=records;
  }
  return output;
}
export function mapBodyTitle(entry,site) {
  const html=fs.readFileSync(boundedPath(site,entry.baselineTemplate),'utf8'),doc=parse(html,{sourceCodeLocationInfo:true});
  let record;
  walk(doc,node=>{
    if(!(attrs(node).class || '').split(/\s+/).includes('article-source-title'))return;
    if(record)throw new Error('来源首标题不唯一: '+entry.id);
    const loc=node.sourceCodeLocation;
    record={id:attrs(node).id,tag:node.tagName,template:html.slice(loc.startTag.startOffset,loc.startTag.endOffset)+'{{sourceTitleMarkup}}'+html.slice(loc.endTag.startOffset,loc.endTag.endOffset)};
  });
  return record;
}
export function mapPlainHeadings(entry,site) {
  const html=fs.readFileSync(boundedPath(site,entry.baselineTemplate),'utf8'),doc=parse(html,{sourceCodeLocationInfo:true});
  const records=[];
  let body;
  walk(doc,node=>{if((attrs(node).class || '').split(/\s+/).includes('prose') && node.parentNode?.tagName==='article')body=node;});
  if(!body)return records;
  walk(body,node=>{
    if(!/^h[1-6]$/.test(node.tagName || ''))return;
    const loc=node.sourceCodeLocation;
    records.push({depth:Number(node.tagName[1]),oldId:attrs(node).id,template:html.slice(loc.startTag.startOffset,loc.startTag.endOffset).replace(/id="[^"]*"/,'id="{{headingId}}"')+'{{headingMarkup}}'+html.slice(loc.endTag.startOffset,loc.endTag.endOffset)});
  });
  return records;
}
