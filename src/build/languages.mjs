import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {regularPath,safeRelative} from './resources.mjs';
const require=createRequire(new URL('../../package.json',import.meta.url)),YAML=require('yaml');
export const languageCode=/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/;
export function validateLanguages(config,ids) {
  if(![1,2].includes(config?.version) || !Array.isArray(config.languages) || !config.languages.length)throw new Error('语言配置格式不符');
  const codes=new Set(),roots=new Set();
  for(const lang of config.languages) {
    if(!languageCode.test(lang.code) || codes.has(lang.code))throw new Error('语言code无效或重复');codes.add(lang.code);
    if(config.version===1){if(typeof lang.root!=='string' || !/^[a-zA-Z0-9_-]+$/.test(lang.root) || roots.has(lang.root.toLowerCase()))throw new Error('语言root越界或重复');roots.add(lang.root.toLowerCase());}
    else if(Object.hasOwn(lang,'root'))throw new Error('v2语言不得包含root');
    if(typeof lang.enabled!=='boolean' || typeof lang.label!=='string' || !lang.label.trim() || ['htmlLang','searchLanguage'].some(key=>typeof lang[key]!=='string' || !/^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/.test(lang[key])) || !Array.isArray(lang.browserTags) || lang.browserTags.some(t=>typeof t!=='string' || !/^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*(?:-\*)?$/.test(t)))throw new Error('语言元数据缺失');
    if(!lang.enabled)continue;
    if(!lang.sources || typeof lang.sources!=='object' || Array.isArray(lang.sources) || Object.keys(lang.sources).length!==ids.length || ids.some(id=>typeof lang.sources[id]!=='string'))throw new Error('语言来源映射缺失');
    for(const relative of [lang.commonSource,...Object.values(lang.sources)]){try{safeRelative(relative);}catch{throw new Error('语言来源路径越界');}}
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
export function readLanguages(sourceRoot,ids) {
  const current=fs.existsSync(path.join(sourceRoot,'shared/languages.md'));
  const raw=fs.readFileSync(regularPath(sourceRoot,current?'shared/languages.md':'000-languages.md'),'utf8'),fm=raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if(!fm)throw new Error('语言配置frontmatter缺失');
  const config=YAML.parse(fm[1]);
  if(current&&config.version!==2)throw new Error('功能来源必须使用语言配置v2');
  if(!Array.isArray(config.languages))throw new Error('语言配置格式不符');
  config.languages=config.languages.map(item=>{
    if(['code','label','htmlLang','searchLanguage','browserTags'].some(key=>key in item))throw new Error('global语言元数据重复');
    if(config.version===1 && (typeof item.root!=='string' || !/^[a-zA-Z0-9_-]+$/.test(item.root)))throw new Error('语言root越界');
    const relative=config.version===1?item.root+'/'+item.commonSource:item.commonSource;
    let file;try{file=regularPath(sourceRoot,relative);}catch{throw new Error('公共来源路径越界或缺失');}
    const source=fs.readFileSync(file,'utf8').match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if(!source)throw new Error('公共来源frontmatter缺失');
    const meta=YAML.parse(source[1]).language;
    if(!meta || Object.keys(meta).some(key=>!['code','label','htmlLang','searchLanguage','browserTags'].includes(key)))throw new Error('公共语言元数据无效');
    if(config.version===2&&item.commonSource!==`shared/i18n/${meta.code}/000-texts.md`)throw new Error('公共来源语言身份不符');
    return {...item,...meta};
  });
  return validateLanguages(config,ids);
}
export const languageSource=(language,relative)=>{safeRelative(relative);return language.root?language.root+'/'+relative:relative;};
export function publicLanguages(config) {
  return {version:1,primary:config.primary,fallback:config.fallback,languages:config.languages.map(({code,label,htmlLang,searchLanguage,browserTags})=>({code,label,htmlLang,searchLanguage,browserTags}))};
}
