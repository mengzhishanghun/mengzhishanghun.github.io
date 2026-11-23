import {isDeepStrictEqual} from 'node:util';
import {localeRoute} from '../build/build.mjs';
import {assertDocPage,parseDocumentFilename,validateDocumentSource} from '../build/work-documents.mjs';

export function normalizeDocumentSource(source,record,entry){
  if(!entry){validateDocumentSource(source.data,{});return source;}
  assertDocPage(entry.docPage);
  const {work,group,slug,order}=entry.docPage;
  const {title}=parseDocumentFilename(record.source.split('/').at(-1));
  const expected={title,type:'doc',draft:false,workIds:[work],docPage:{work,group,slug,order},documentKind:'product-manual',websiteRoute:localeRoute(entry,record.lang),lang:record.lang,translationKey:entry.translationKey};
  const {data}=source;
  if(record.id!==entry.id||entry.type!=='doc'||entry.id!==`doc:${work}:${slug}`||entry.translationKey!==entry.id||entry.slug!==`${work}-${slug}`||!data||data.slug!==record.slug||data.sitePublish!==true)throw Error('章节同步发布权限或身份不符: '+record.id);
  for(const [key,value]of Object.entries(expected))if(Object.hasOwn(data,key)&&!isDeepStrictEqual(data[key],value))throw Error('章节同步发布权限或身份不符: '+record.id+' ('+key+')');
  const normalized={...data,...expected};
  validateDocumentSource(normalized,entry);
  return {...source,data:normalized};
}
