import fs from 'node:fs';
import {createRequire} from 'node:module';
import {walk,attrs} from './extract-dom.mjs';
const require=createRequire(new URL('../../package.json',import.meta.url));
const {parse}=require('parse5');
export function generatedPage(relative='zh/blog/cnblogs-19136316/index.html',transform=html=>html) {
  const tree=parse(transform(fs.readFileSync(new URL('../../'+(process.env.SITE_OUTPUT||'dist/site')+'/'+relative,import.meta.url),'utf8')));
  const nodes=[];walk(tree,node=>nodes.push(node));
  const matches=(node,selector)=>{
    const tag=selector.match(/^[a-z][\w-]*/)?.[0],classes=[...selector.matchAll(/\.([\w-]+)/g)].map(x=>x[1]),attributes=[...selector.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)];
    const a=attrs(node);return !!node.tagName && (!tag || node.tagName===tag) && classes.every(c=>(a.class||'').split(/\s+/).includes(c)) && attributes.every(([,key,value])=>Object.hasOwn(a,key)&&(value===undefined||a[key]===value));
  };
  const select=selector=>nodes.find(node=>selector.split(',').some(part=>{
    const chain=part.trim().split(/\s+/);if(!matches(node,chain.pop()))return false;let parent=node.parentNode;
    while(chain.length){const part=chain.pop();while(parent&&!matches(parent,part))parent=parent.parentNode;if(!parent)return false;parent=parent.parentNode;}return true;
  }));
  const copyScript=nodes.find(node=>node.tagName==='script' && node.childNodes?.some(child=>child.value?.startsWith('window.SiteCopy=')));
  const copyText=copyScript?.childNodes.map(child=>child.value || '').join('');
  const copy=copyText?JSON.parse(copyText.slice('window.SiteCopy='.length,copyText.indexOf(';window.SiteLanguageCode='))):{};
  const closest=(node,selector)=>{for(let parent=node;parent;parent=parent.parentNode)if(selector.split(',').some(part=>matches(parent,part.trim())))return parent;};
  return {tree,nodes,select,attrs,matches,copy,closest};
}

export function toolbarGeometry(docs=false) {
  const css=fs.readFileSync(new URL('../../'+(process.env.SITE_OUTPUT||'dist/site')+(docs?'/docs/_astro/common.citybP12.css':'/_astro/MasterDetail.CHMC8WZC.css'),import.meta.url),'utf8');
  const sticky=css.match(/mobile-outline\[data-ready\]\{([^}]+)\}/)?.[1];
  const controls=css.match(/mobile-outline\[data-ready\] \.outline-mobile-controls\{([^}]+)\}/)?.[1];
  const button=css.match(/mobile-outline\[data-ready\] \.outline-mobile-toggle,\.outline-mobile-controls \.outline-mobile-back\{([^}]+)\}/)?.[1];
  if(!sticky?.includes('position:sticky') || !controls || !button)throw Error('generated toolbar CSS contract is missing');
  return Number(button.match(/min-height:(\d+)px/)[1])+2*Number(controls.match(/padding:(\d+)px 0/)[1]);
}
