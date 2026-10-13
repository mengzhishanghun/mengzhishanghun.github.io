export const articleTypes=new Set(['work','case','blog','doc']);
export function validateArticleIdentities(entries,registry){
  if(registry?.version!==1 || !Array.isArray(registry.articles))throw new Error('永久文章身份登记缺失');
  const ids=new Map();
  for(const item of registry.articles){
    if(typeof item.id!=='string' || !/^[a-z][a-z0-9_-]*:[a-zA-Z0-9_-]+$/.test(item.id) || typeof item.translationKey!=='string' || !item.translationKey || ids.has(item.id))throw new Error('永久文章身份重复或无效');
    ids.set(item.id,item.translationKey);
  }
  return entries.filter(e=>articleTypes.has(e.type)).map(entry=>{
    if(ids.get(entry.id)!==(entry.translationKey || entry.id))throw new Error('永久文章身份不符: '+entry.id);
    return entry.id;
  });
}
export function shareRoute(entry,locale,localizedRoute){
  if(localizedRoute)return localizedRoute.replace(new RegExp('^/'+locale+'(?=/)'),'');
  const original=entry.legacyRoutes[0];
  return original.replace(/^\/docs\/(?:zh|en)\//,'/docs/').replace(new RegExp('^/'+locale+'(?=/)'),'');
}
