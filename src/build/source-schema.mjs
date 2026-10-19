export const publicFields=['title','description','type','slug','categoryId','categoryName','categoryOrder','order','status','workInfo','featured','date','publishedAt','draft','sitePublish','tags','searchTags','sourcePlatform','sourceUrl','links','productIds','workIds','docIds','coverAlt','websiteCoverUrl','sourceDate','documentKind','websiteRoute','template'];
export const commonFields=['title','type','language','languageLabels','shellSlots','scriptSlots','bodyUtilitySlots','missingPublicFileNote','codeLabels','engagementLabels','workLabels'];
const translationFields=['lang','translationKey','sourceHash','generatedBodyHash','translationStatus','supplementSources'];
const objectWithKeys=(value,keys)=>value && typeof value==='object' && !Array.isArray(value) && Object.keys(value).every(key=>keys.includes(key));
const textList=value=>Array.isArray(value) && value.every(item=>typeof item==='string' && item.trim() && !/[\u0000-\u001f]/.test(item)) && new Set(value).size===value.length;
export function assertWorkInfo(info){
  if(!objectWithKeys(info,['channels','compatibility','stage','supportHref']) || !Array.isArray(info.channels) || !Array.isArray(info.compatibility))throw new Error('workInfo 格式无效');
  if(info.stage!==undefined && info.stage!=='developing')throw new Error('workInfo 阶段无效');
  const assertURL=href=>{
    if(typeof href!=='string' || /[\s\\<>"'\u0000-\u001f]/.test(href) || !(href.startsWith('/')&&!href.startsWith('//') || /^https:\/\//.test(href)) || decodeURIComponent(href.split(/[?#]/)[0]).split('/').includes('..'))throw new Error('workInfo URL 不安全');
    const url=new URL(href,'https://mzsh.me');
    if(url.protocol!=='https:' || url.username || url.password)throw new Error('workInfo URL 不安全');
  };
  if(info.supportHref!==undefined)assertURL(info.supportHref);
  const kinds=new Set();
  for(const channel of info.channels){
    if(!objectWithKeys(channel,['kind','href']) || !['sale','open-source','docs'].includes(channel.kind) || kinds.has(channel.kind))throw new Error('workInfo 渠道无效');
    assertURL(channel.href);
    kinds.add(channel.kind);
  }
  for(const group of info.compatibility)if(!objectWithKeys(group,['platforms','requirements']) || !textList(group.platforms) || !textList(group.requirements))throw new Error('workInfo 兼容信息无效');
}
export function assertPublicFields(data,common=false){
  if(data?.workInfo!==undefined)assertWorkInfo(data.workInfo);
  const allowed=new Set([...(common?commonFields:publicFields),...translationFields]);
  if(!data||Object.keys(data).some(key=>!allowed.has(key)))throw new Error('公开来源含未授权字段');
}
