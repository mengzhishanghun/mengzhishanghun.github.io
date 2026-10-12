import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {DatabaseSync,backup} from 'node:sqlite';
import {fileURLToPath} from 'node:url';

function regular(file,directory=false){
  if(!fs.existsSync(file))return;
  const stat=fs.lstatSync(file);
  if(stat.isSymbolicLink() || (directory?!stat.isDirectory():!stat.isFile()))throw new Error('Unsafe engagement path');
}
function database(file){
  if(!path.isAbsolute(file))throw new Error('Database path must be absolute');
  const directory=path.dirname(file);regular(directory,true);fs.mkdirSync(directory,{recursive:true,mode:0o700});
  for(let parent=directory;;parent=path.dirname(parent)){regular(parent,true);if(parent===path.dirname(parent))break;}
  fs.chmodSync(directory,0o700);regular(file);const db=new DatabaseSync(file);fs.chmodSync(file,0o600);
  db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS article_counts (article_id TEXT PRIMARY KEY, count INTEGER NOT NULL CHECK(count >= 0));');
  for(const suffix of ['-wal','-shm'])if(fs.existsSync(file+suffix)){regular(file+suffix);fs.chmodSync(file+suffix,0o600);}
  return db;
}
export async function backupDatabase(db,target){
  if(!path.isAbsolute(target))throw new Error('Backup path must be absolute');
  regular(path.dirname(target),true);fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});fs.chmodSync(path.dirname(target),0o700);
  if(fs.existsSync(target))throw new Error('Backup destination already exists');
  const temporary=target+'.partial';if(fs.existsSync(temporary))throw new Error('Partial backup exists');
  fs.writeFileSync(temporary,'',{flag:'wx',mode:0o600});
  try{await backup(db,temporary);fs.chmodSync(temporary,0o600);const verify=new DatabaseSync(temporary,{readOnly:true});try{if(verify.prepare('PRAGMA quick_check').get().quick_check!=='ok')throw new Error('Backup integrity failed');}finally{verify.close();}fs.renameSync(temporary,target);}catch(error){fs.rmSync(temporary,{force:true});throw error;}
}
export function readConfig(file){
  regular(file);const stat=fs.statSync(file);if(process.platform!=='win32' && (stat.mode & 0o077))throw new Error('Config must be mode 600');
  const config=JSON.parse(fs.readFileSync(file,'utf8'));regular(config.registry);
  const registry=JSON.parse(fs.readFileSync(config.registry,'utf8'));
  if(registry.version!==1)throw new Error('Invalid active registry');return {...config,articleIds:registry.articleIds};
}
export function createEngagementService(config){
  const {host,port,origin}=config,rateLimit=config.rateLimit ?? 120,requestLimit=config.requestLimit ?? 600,concurrency=config.concurrency ?? 16;
  if(typeof host!=='string' || !host || !Number.isInteger(port) || port<0 || port>65535 || new URL(origin).origin!==origin || !origin.startsWith('https://') || ![rateLimit,requestLimit,concurrency].every(v=>Number.isInteger(v)&&v>0))throw new Error('Invalid service configuration');
  if(!Array.isArray(config.articleIds) || config.articleIds.some(id=>typeof id!=='string'||!/^[a-z][a-z0-9_-]*:[a-zA-Z0-9_-]+$/.test(id)) || new Set(config.articleIds).size!==config.articleIds.length)throw new Error('Invalid active article registry');
  const ids=new Set(config.articleIds),db=database(config.db),get=db.prepare('SELECT count FROM article_counts WHERE article_id=?'),like=db.prepare('INSERT INTO article_counts(article_id,count) VALUES(?,1) ON CONFLICT(article_id) DO UPDATE SET count=count+1 RETURNING count');
  let active=0,windowStart=Date.now(),writes=0,requests=0;
  const reply=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));};
  const reject=(res,status,error)=>reply(res,status,{error,write:'rejected'});
  const server=http.createServer(async(req,res)=>{
    if(Date.now()-windowStart>=60000){windowStart=Date.now();writes=0;requests=0;}
    if(++requests>requestLimit){req.resume();return reject(res,429,'rate_limit');}
    let id;const match=req.url?.match(/^\/api\/engagement\/articles\/([^/?#]+)(\/like)?$/);
    try{id=match && decodeURIComponent(match[1]);}catch{}
    if(!id || !ids.has(id)){req.resume();return reject(res,404,'not_found');}
    if(req.method==='GET' && !match[2])return reply(res,200,{count:get.get(id)?.count ?? 0});
    if(req.method!=='POST' || !match[2]){req.resume();return reject(res,405,'method');}
    if(req.headers.origin!==origin){req.resume();return reject(res,403,'origin');}
    if(!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(req.headers['content-type'] || '')){req.resume();return reject(res,415,'content_type');}
    if(Number(req.headers['content-length'])>256){req.resume();return reject(res,413,'body');}
    if(active>=concurrency){req.resume();return reject(res,429,'concurrency');}
    active++;
    try{
      const body=await new Promise((resolve,rejectBody)=>{
        let size=0,raw='';req.on('data',chunk=>{size+=chunk.length;if(size<=256)raw+=chunk.toString('utf8');});req.on('end',()=>resolve(size>256?null:raw));req.on('error',rejectBody);req.on('aborted',()=>rejectBody(new Error('aborted')));
      });
      let payload;try{payload=JSON.parse(body);}catch{}
      if(!payload || Array.isArray(payload) || typeof payload!=='object' || Object.keys(payload).length)return reject(res,400,'body');
      if(writes>=rateLimit)return reject(res,429,'rate_limit');
      writes++;
      reply(res,200,{count:like.get(id).count});
    }catch{if(!res.destroyed)reply(res,500,{error:'unavailable'});}finally{active--;}
  });
  server.maxConnections=64;server.requestTimeout=10000;server.headersTimeout=5000;server.keepAliveTimeout=1000;
  return {server,db,listen:()=>new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,resolve);}),close:async()=>{if(server.listening)await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()));db.close();}};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const configFile=process.argv[2];if(!configFile)throw new Error('Usage: node service.mjs /absolute/config.json');
  const app=createEngagementService(readConfig(configFile));await app.listen();console.log('Engagement ready');
  let closing=false;for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{if(closing)return;closing=true;await app.close();console.log('Engagement stopped');});
}
