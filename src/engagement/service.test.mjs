import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {once} from 'node:events';

// Missing atomic increment, origin validation or persistence must break these requests.
test('atomic counts persist without visitor records and online backup restores in isolation',async t=>{
  const {createEngagementService,backupDatabase}=await import('./service.mjs');
  const root=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'engagement-test-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const config={host:'127.0.0.1',port:0,db:path.join(root,'data/counts.sqlite'),articleIds:['doc:guide','blog:note'],origin:'https://mzsh.me',rateLimit:100,concurrency:32};
  let app=createEngagementService(config);await app.listen();
  const request=(id,method='GET',origin=config.origin,body='{}')=>fetch(`http://127.0.0.1:${app.server.address().port}/api/engagement/articles/${encodeURIComponent(id)}${method==='POST'?'/like':''}`,{method,headers:method==='POST'?{'Origin':origin,'Content-Type':'application/json'}:{},...(method==='POST'?{body}:{})});
  assert.deepEqual(await (await request('doc:guide')).json(),{count:0});
  for(const [id,origin,body,status] of [['doc:guide','https://evil.test','{}',403],['missing',config.origin,'{}',404],['doc:guide',config.origin,'{"visitor":"x"}',400]]){
    const r=await request(id,'POST',origin,body);assert.equal(r.status,status);assert.deepEqual(await r.json(),{error:r.status===403?'origin':r.status===404?'not_found':'body',write:'rejected'});
  }
  const results=await Promise.all(Array.from({length:20},()=>request('doc:guide','POST')));
  assert.ok(results.every(r=>r.status===200));
  const counts=await Promise.all(results.map(r=>r.json()));assert.deepEqual(counts.map(r=>r.count).sort((a,b)=>a-b),Array.from({length:20},(_,i)=>i+1));
  assert.equal(results[0].headers.get('cache-control'),'no-store');assert.equal(results[0].headers.get('set-cookie'),null);
  const snapshot=path.join(root,'backup/counts.sqlite');await backupDatabase(app.db,snapshot);
  await app.close();app=createEngagementService(config);await app.listen();assert.deepEqual(await (await request('doc:guide')).json(),{count:20});await app.close();
  const restored=createEngagementService({...config,db:snapshot});
  assert.deepEqual(restored.db.prepare('SELECT article_id,count FROM article_counts').all().map(r=>({...r})),[{article_id:'doc:guide',count:20}]);
  assert.deepEqual(restored.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r=>r.name),['article_counts']);await restored.close();
});

test('global write budget rejects before writing and malformed bodies never increment',async t=>{
  const {createEngagementService}=await import('./service.mjs');const root=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'engagement-limit-'));
  const app=createEngagementService({host:'127.0.0.1',port:0,db:path.join(root,'db/counts.sqlite'),articleIds:['work:one'],origin:'https://mzsh.me',rateLimit:1,concurrency:1});await app.listen();t.after(async()=>{await app.close();fs.rmSync(root,{recursive:true,force:true});});
  const url=`http://127.0.0.1:${app.server.address().port}/api/engagement/articles/work%3Aone/like`,headers={Origin:'https://mzsh.me','Content-Type':'application/json'};
  assert.equal((await fetch(url,{method:'POST',headers,body:'{'})).status,400);
  assert.equal((await fetch(url,{method:'POST',headers,body:'{}'})).status,200);
  const limited=await fetch(url,{method:'POST',headers,body:'{}'});assert.equal(limited.status,429);assert.deepEqual(await limited.json(),{error:'rate_limit',write:'rejected'});
  assert.equal(app.db.prepare('SELECT count FROM article_counts').get().count,1);
});
test('a held write body consumes concurrency and the next write is rejected before increment',async t=>{
  const {createEngagementService}=await import('./service.mjs'),root=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'engagement-concurrency-'));
  const app=createEngagementService({host:'127.0.0.1',port:0,db:path.join(root,'data/counts.sqlite'),articleIds:['case:one'],origin:'https://mzsh.me',concurrency:1});await app.listen();
  t.after(async()=>{await app.close();fs.rmSync(root,{recursive:true,force:true});});
  const url=`http://127.0.0.1:${app.server.address().port}/api/engagement/articles/case%3Aone/like`,headers={Origin:'https://mzsh.me','Content-Type':'application/json','Content-Length':'2'};
  const started=once(app.server,'request'),slow=http.request(url,{method:'POST',headers});const result=once(slow,'response');slow.write('{');await started;
  const rejected=await fetch(url,{method:'POST',headers,body:'{}'});assert.equal(rejected.status,429);assert.deepEqual(await rejected.json(),{error:'concurrency',write:'rejected'});
  slow.end('}');const [response]=await result;response.resume();await once(response,'end');assert.equal(response.statusCode,200);assert.equal(app.db.prepare('SELECT count FROM article_counts').get().count,1);
});

test('batch counts are complete read-only active-ID snapshots with bounded requests',async t=>{
 const {createEngagementService}=await import('./service.mjs'),root=fs.mkdtempSync(path.join(os.tmpdir(),'counts-batch-'));
 const articleIds=Array.from({length:129},(_,i)=>'blog:item-'+i),app=createEngagementService({host:'127.0.0.1',port:0,db:path.join(root,'data/counts.sqlite'),articleIds,origin:'https://mzsh.me'});await app.listen();t.after(async()=>{await app.close();fs.rmSync(root,{recursive:true,force:true});});
 app.db.prepare('INSERT INTO article_counts VALUES (?,?)').run('blog:item-0',7);
 const base='http://127.0.0.1:'+app.server.address().port+'/api/engagement/counts';
 const request=(ids,options)=>fetch(base+'?ids='+encodeURIComponent(ids),options);
 const response=await request('blog:item-0,blog:item-1,blog:item-0');assert.equal(response.status,200);assert.deepEqual(await response.json(),{counts:{'blog:item-0':7,'blog:item-1':0}});assert.equal(response.headers.get('cache-control'),'no-store');assert.equal(response.headers.get('access-control-allow-origin'),null);
 assert.equal((await request(articleIds.slice(0,128).join(','))).status,200);
 for(const [ids,status]of [['',400],['bad',400],['blog:missing',404],[articleIds.join(','),400],['a'.repeat(8200),414]])assert.equal((await request(ids)).status,status);
 assert.equal((await request('blog:item-0',{method:'POST'})).status,405);
 assert.equal((await fetch(base+'?ids=blog%3Aitem-0&ids=blog%3Aitem-1')).status,400);
 assert.deepEqual(app.db.prepare('SELECT * FROM article_counts').all().map(r=>({...r})),[{article_id:'blog:item-0',count:7}]);
 assert.deepEqual(await (await fetch(base.replace('/counts','/articles/blog%3Aitem-0'))).json(),{count:7});
});

test('batch requests obey global request budgets and invalid stored counts fail safely',async t=>{const {createEngagementService}=await import('./service.mjs'),root=fs.mkdtempSync(path.join(os.tmpdir(),'batch-safe-'));const app=createEngagementService({host:'127.0.0.1',port:0,db:path.join(root,'data/counts.sqlite'),articleIds:['blog:one'],origin:'https://mzsh.me',requestLimit:3});await app.listen();t.after(async()=>{await app.close();fs.rmSync(root,{recursive:true,force:true});});const url='http://127.0.0.1:'+app.server.address().port+'/api/engagement/counts?ids=blog%3Aone';app.db.prepare('INSERT INTO article_counts VALUES (?,?)').run('blog:one',9007199254740992n);assert.equal((await fetch(url)).status,503);app.db.prepare('DELETE FROM article_counts').run();assert.deepEqual(await (await fetch(url)).json(),{counts:{'blog:one':0}});assert.equal((await fetch(url)).status,200);assert.equal((await fetch(url)).status,429);});
