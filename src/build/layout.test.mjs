import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validateRuntime} from './validate-runtime.mjs';
import {loadResources} from './resources.mjs';
import {buildSite} from './build.mjs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const hash=b=>createHash('sha256').update(b).digest('hex');
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'layout-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;}
test('runtime reports a missing dist resource even if source tree has it',t=>{
  const root=fixture(t),output=path.join(root,'out');fs.mkdirSync(output);fs.mkdirSync(path.join(output,'zh'));fs.writeFileSync(path.join(root,'known.js'),'ok');fs.writeFileSync(path.join(output,'zh/index.html'),'<html><body><script src="/known.js"></script></body></html>');
  const result=validateRuntime({site:root,output,validateAliases:false,languageConfig:{primary:'zh',fallback:'zh',languages:[{code:'zh'}]},manifest:{entries:[{id:'page:home',legacyRoutes:['/']}]}});
  assert.ok(result.errors.some(e=>e.kind==='missingLocalFile'&&e.target==='/known.js'));
});
test('resources close output mappings and reject frozen drift, duplicate outputs and escapes',t=>{
  const root=fixture(t);fs.mkdirSync(path.join(root,'src'));fs.writeFileSync(path.join(root,'src/a.js'),'a');
  const a={source:'src/a.js',outputs:['assets/a.js'],sha256:hash('a'),mode:'frozen'},config={version:1,files:[a]};
  assert.equal(loadResources({site:root,config}).get('assets/a.js').toString(),'a');
  assert.throws(()=>loadResources({site:root,config:{version:1,files:[a,a]}}),/重复/);
  assert.throws(()=>loadResources({site:root,config:{version:1,files:[{...a,source:'../a.js'}]}}),/越界/);
  assert.throws(()=>loadResources({site:root,config:{version:1,files:[{...a,outputs:['../a.js']}]}}),/越界/);
  fs.writeFileSync(path.join(root,'src/a.js'),'changed');assert.throws(()=>loadResources({site:root,config}),/漂移/);
});
test('resource directory links cannot escape the source root',t=>{
  const root=fixture(t),outside=fixture(t);fs.writeFileSync(path.join(outside,'a.js'),'a');fs.symlinkSync(outside,path.join(root,'linked'),'junction');
  assert.throws(()=>loadResources({site:root,config:{version:1,files:[{source:'linked/a.js',outputs:['assets/a.js'],sha256:hash('a'),mode:'frozen'}]}}),/符号链接越界/);
});
test('complete build rejects stale or unknown output before any writes',async t=>{
  const output=fixture(t),site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
  fs.mkdirSync(path.join(output,'zh/withdrawn'),{recursive:true});fs.writeFileSync(path.join(output,'zh/withdrawn/index.html'),'retain');
  const manifest=JSON.parse(fs.readFileSync(path.join(site,'src/build/manifest.json'),'utf8'));
  await assert.rejects(()=>buildSite({site,sourceRoot:path.join(site,'src'),manifest,output,indexSearch:false}),/未登记输出/);
  assert.deepEqual(fs.readdirSync(output),['zh']);assert.equal(fs.readFileSync(path.join(output,'zh/withdrawn/index.html'),'utf8'),'retain');
  const checked=await buildSite({site,sourceRoot:path.join(site,'src'),manifest,output,indexSearch:false,check:true});assert.ok(checked.differences.includes('extra:zh/withdrawn/index.html'));assert.deepEqual(fs.readdirSync(output),['zh']);
});
