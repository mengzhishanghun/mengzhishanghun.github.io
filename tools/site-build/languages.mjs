import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../content-import/package.json',import.meta.url)),YAML=require('yaml');
export const languageCode=/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/;
export function validateLanguages(config,ids) {
  if(config?.version!==1 || !Array.isArray(config.languages) || !config.languages.length)throw new Error('语言配置格式不符');
  const codes=new Set(),roots=new Set();
  for(const lang of config.languages) {
    if(!languageCode.test(lang.code) || codes.has(lang.code))throw new Error('语言code无效或重复');codes.add(lang.code);
    if(typeof lang.root!=='string' || !/^[a-zA-Z0-9_-]+$/.test(lang.root) || roots.has(lang.root.toLowerCase()))throw new Error('语言root越界或重复');roots.add(lang.root.toLowerCase());
    if(typeof lang.enabled!=='boolean' || typeof lang.label!=='string' || !lang.label.trim() || ['htmlLang','searchLanguage'].some(key=>typeof lang[key]!=='string' || !/^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/.test(lang[key])) || !Array.isArray(lang.browserTags) || lang.browserTags.some(t=>typeof t!=='string' || !/^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*(?:-\*)?$/.test(t)))throw new Error('语言元数据缺失');
    if(!lang.enabled)continue;
    if(!lang.sources || typeof lang.sources!=='object' || Array.isArray(lang.sources) || Object.keys(lang.sources).length!==ids.length || ids.some(id=>typeof lang.sources[id]!=='string'))throw new Error('语言来源映射缺失');
    for(const relative of [lang.commonSource,...Object.values(lang.sources)])if(typeof relative!=='string' || !relative || path.isAbsolute(relative) || relative.includes('\\') || relative.split('/').some(p=>p==='..' || p===''))throw new Error('语言来源路径越界');
    if(new Set(Object.values(lang.sources)).size!==ids.length)throw new Error('语言来源映射重复');
  }
  const languages=config.languages.filter(l=>l.enabled);
  const rules=[];
  for(const lang of languages)for(const value of lang.browserTags) {
    const rule=value.toLowerCase(),prefix=rule.endsWith('-*')?rule.slice(0,-1):null;
    if(rules.some(other=>other.code!==lang.code && (other.rule===rule || prefix && other.rule.startsWith(prefix) || other.prefix && rule.startsWith(other.prefix))))throw new Error('浏览器语言规则歧义');
    rules.push({code:lang.code,rule,prefix});
  }
  if(!languages.some(l=>l.code===config.primary) || !languages.some(l=>l.code===config.fallback))throw new Error('primary/fallback未启用');
  return {...config,languages};
}
export function readLanguages(vault,ids) {
  const raw=fs.readFileSync(path.join(vault,'网站/000-languages.md'),'utf8'),fm=raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if(!fm)throw new Error('语言配置frontmatter缺失');
  const config=YAML.parse(fm[1]);
  if(!Array.isArray(config.languages))throw new Error('语言配置格式不符');
  config.languages=config.languages.map(item=>{
    if(['code','label','htmlLang','searchLanguage','browserTags'].some(key=>key in item))throw new Error('global语言元数据重复');
    if(typeof item.root!=='string' || !/^[a-zA-Z0-9_-]+$/.test(item.root))throw new Error('语言root越界');
    const base=path.resolve(vault,'网站',item.root),file=path.resolve(base,item.commonSource || '');
    if(!file.startsWith(base+path.sep))throw new Error('公共来源路径越界');
    if(!fs.existsSync(file))throw new Error('公共来源缺失');
    const source=fs.readFileSync(file,'utf8').match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if(!source)throw new Error('公共来源frontmatter缺失');
    const meta=YAML.parse(source[1]).language;
    if(!meta || Object.keys(meta).some(key=>!['code','label','htmlLang','searchLanguage','browserTags'].includes(key)))throw new Error('公共语言元数据无效');
    return {...item,...meta};
  });
  return validateLanguages(config,ids);
}
export const languageSource=(language,relative)=>'网站/'+language.root+'/'+relative;
export function publicLanguages(config) {
  return {version:1,primary:config.primary,fallback:config.fallback,languages:config.languages.map(({code,label,htmlLang,searchLanguage,browserTags})=>({code,label,htmlLang,searchLanguage,browserTags}))};
}
