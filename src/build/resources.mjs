import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
export function safeRelative(relative){
  if(typeof relative!=='string'||!relative||path.isAbsolute(relative)||/[\\:\0]/.test(relative)||relative.split('/').some(p=>!p||p==='.'||p==='..'))throw new Error('资源路径越界');
  return relative;
}
export function regularPath(root,relative){
  safeRelative(relative);const base=path.resolve(root),file=path.resolve(base,relative);
  if(!file.startsWith(base+path.sep))throw new Error('资源路径越界');
  let current=base;for(const part of relative.split('/')){current=path.join(current,part);if(fs.lstatSync(current).isSymbolicLink())throw new Error('资源符号链接越界');}
  if(!fs.statSync(file).isFile()||!fs.realpathSync(file).startsWith(fs.realpathSync(base)+path.sep))throw new Error('资源必须是边界内普通文件');
  return file;
}
export function loadResources({site,config}){
  config ||= JSON.parse(fs.readFileSync(path.join(site,'src/build/resources.json'),'utf8'));
  if(config?.version!==1||Object.keys(config).some(k=>!['version','files'].includes(k))||!Array.isArray(config.files))throw new Error('资源清单格式无效');
  const files=new Map(),sources=new Set();
  for(const record of config.files){
    if(Object.keys(record).some(k=>!['source','outputs','sha256','mode'].includes(k))||!['frozen','authored'].includes(record.mode)||!/^[a-f0-9]{64}$/.test(record.sha256)||!Array.isArray(record.outputs)||!record.outputs.length)throw new Error('资源记录无效');
    if(sources.has(record.source))throw new Error('资源来源重复');sources.add(record.source);
    const bytes=fs.readFileSync(regularPath(site,record.source));
    if(record.mode==='frozen'&&createHash('sha256').update(bytes).digest('hex')!==record.sha256)throw new Error('冻结资源漂移: '+record.source);
    for(const output of record.outputs){safeRelative(output);if(files.has(output))throw new Error('资源输出重复: '+output);files.set(output,bytes);}
  }
  return files;
}
const maps=new Map();
export function resourcePath(site,relative){
  const manifest=path.join(site,'src/build/resources.json');
  if(!fs.existsSync(manifest))return regularPath(site,relative);
  const stamp=fs.statSync(manifest).mtimeMs;let cached=maps.get(manifest);
  if(!cached||cached.stamp!==stamp){cached={stamp,paths:new Map()};const config=JSON.parse(fs.readFileSync(manifest,'utf8'));for(const r of config.files)for(const output of r.outputs){safeRelative(output);if(cached.paths.has(output))throw new Error('资源输出重复');cached.paths.set(output,r.source);}maps.set(manifest,cached);}
  const source=cached.paths.get(safeRelative(relative));if(!source)throw new Error('资源未登记: '+relative);
  return regularPath(site,source);
}
