export const publicFields=['title','description','type','slug','categoryId','categoryName','categoryOrder','order','status','featured','date','publishedAt','draft','sitePublish','tags','searchTags','sourcePlatform','sourceUrl','links','productIds','workIds','docIds','coverAlt','websiteCoverUrl','sourceDate','documentKind','websiteRoute','template'];
export const commonFields=['title','type','language','languageLabels','shellSlots','scriptSlots','bodyUtilitySlots','missingPublicFileNote','codeLabels','engagementLabels'];
const translationFields=['lang','translationKey','sourceHash','generatedBodyHash','translationStatus','supplementSources'];
export function assertPublicFields(data,common=false){
  const allowed=new Set([...(common?commonFields:publicFields),...translationFields]);
  if(!data||Object.keys(data).some(key=>!allowed.has(key)))throw new Error('公开来源含未授权字段');
}
