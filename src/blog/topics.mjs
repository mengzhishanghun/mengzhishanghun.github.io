import fs from 'node:fs';
import {regularPath} from '../build/resources.mjs';
const unique=values=>[...new Set(values)];
const strings=value=>Array.isArray(value)&&value.every(v=>typeof v==='string'&&v.trim())&&unique(value).length===value.length;
export function projectBlogTopics({site,entries,copy,config,topics}) {
  const blogs=entries.filter(e=>e.type==='blog');if(!blogs.length)return;
  topics ||= JSON.parse(fs.readFileSync(regularPath(site,'src/blog/topics.json'),'utf8'));
  if(topics.version!==1 || !Array.isArray(topics.topics) || !strings(topics.topics) || topics.topics.some(id=>!/^([a-z]+-)*[a-z]+$/.test(id)) || !topics.articles || typeof topics.articles!=='object')throw Error('博客主题配置无效');
  const ids=new Set(blogs.map(e=>e.id));
  if(Object.keys(topics.articles).some(id=>!ids.has(id)))throw Error('博客主题映射含未知身份');
  for(const entry of blogs){
    const record=topics.articles[entry.id];
    if(!record || !strings(record.topics) || record.topics.length<1 || record.topics.length>2 || record.topics.some(id=>!topics.topics.includes(id)))throw Error('博客主题映射缺失或重复: '+entry.id);
    entry.projectedTags={};
    for(const {code}of config.languages){
      const tags=record.topics.map(id=>{const label=copy[code].scriptSlots?.['blog-topic:'+id];if(typeof label!=='string'||!label.trim())throw Error('博客主题译名缺失: '+code+' '+id);return label;});
      const snapshot=record.legacyTags?.[code];if(!strings(snapshot))throw Error('博客旧标签快照缺失: '+entry.id+' '+code);
      const source=entry.sources[code].data,legacyTags=unique([...(source.tags || []),...snapshot]);
      entry.projectedTags[code]={tags,legacyTags,searchTags:unique([...tags,...legacyTags,...source.searchTags || []])};
    }
  }
  const aliases=new Map();
  for(const {code}of config.languages){
    const labels=topics.topics.map(id=>copy[code].scriptSlots?.['blog-topic:'+id]);
    if(labels.some(label=>typeof label!=='string'||!label.trim())||unique(labels).length!==labels.length)throw Error('博客主题译名缺失或重复: '+code);
    for(const [index,label]of labels.entries()){
      const id=topics.topics[index];
      if(aliases.has(label)&&aliases.get(label)!==id)throw Error('博客主题跨语别名冲突: '+label);
      aliases.set(label,id);
    }
  }
  for(const {code}of config.languages){
    for(const [label,id]of aliases){
      const old=blogs.filter(e=>e.projectedTags[code].legacyTags.includes(label)).map(e=>e.id).sort();
      const current=blogs.filter(e=>topics.articles[e.id].topics.includes(id)).map(e=>e.id).sort();
      if(old.length&&JSON.stringify(old)!==JSON.stringify(current))throw Error('博客主题与旧标签同名集合冲突: '+code+' '+label);
    }
  }
  const index=entries.find(e=>e.id==='page:blog-index');
  if(index)index.topicAliases=Object.fromEntries(config.languages.map(({code})=>[code,Object.fromEntries([...aliases].map(([label,id])=>[label,copy[code].scriptSlots['blog-topic:'+id]]))]));
}
