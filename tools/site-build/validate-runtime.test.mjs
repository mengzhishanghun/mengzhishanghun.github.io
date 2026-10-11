import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validateRuntime} from './validate-runtime.mjs';
test('runtime gate rejects broken anchors and source order overridden by old list data',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'site-runtime-test-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const manifest={entries:[{id:'page:works-index',legacyRoutes:['/works/']}]};
  const languageConfig={version:1,primary:'zh',fallback:'en',languages:[{code:'zh',label:'中文'},{code:'en',label:'English'}]};
  fs.writeFileSync(path.join(root,'site-languages.json'),JSON.stringify(languageConfig));
  const render=(locale,orders,href)=>`<html lang="${locale}"><body><h2 id="valid">Title</h2><a href="${href}">Link</a><script type="application/json" data-site-language>${JSON.stringify({...languageConfig,locale,urls:{zh:'/zh/works/',en:'/en/works/'}})}</script><script type="application/json" data-content-index-data>${JSON.stringify(orders.map(order=>({categoryId:'plugins',order})))}</script></body></html>`;
  for(const locale of ['zh','en']) {fs.mkdirSync(path.join(root,locale,'works'),{recursive:true});fs.writeFileSync(path.join(root,locale,'works/index.html'),render(locale,[2,0],'#missing'));}
  const errors=validateRuntime({manifest,output:root,site:root,validateAliases:false}).errors;
  assert.equal(errors.filter(e=>e.kind==='missingAnchor').length,2);
  assert.equal(errors.filter(e=>e.kind==='workOrder').length,2);
  for(const locale of ['zh','en'])fs.writeFileSync(path.join(root,locale,'works/index.html'),render(locale,[0,2],'#valid'));
  assert.deepEqual(validateRuntime({manifest,output:root,site:root,validateAliases:false}).errors,[]);
});
