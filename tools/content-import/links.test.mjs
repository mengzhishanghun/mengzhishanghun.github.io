import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {importContent,sourceText,parseSource} from './import.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function fixture(t,body){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'link-projection-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const site=path.join(root,'site'),vault=path.join(root,'vault');
 for(const directory of ['tools/content-import','tools/site-build','content/zh/blog','content/zh/doc','zh/docs/tools/guide'])fs.mkdirSync(path.join(site,directory),{recursive:true});
 fs.mkdirSync(path.join(vault,'网站/文档'),{recursive:true});
 const primary=sourceText({title:'Entry'},body),target=sourceText({title:'Guide'},'## Guide\n\nBody\n');
 fs.writeFileSync(path.join(vault,'网站/Entry.md'),primary);fs.writeFileSync(path.join(vault,'网站/文档/Guide.md'),target);
 fs.writeFileSync(path.join(site,'zh/docs/tools/guide/index.html'),'<h2 id="guide">Guide</h2>');
 const records=[{id:'blog:entry',kind:'blog',lang:'zh',source:'网站/Entry.md',output:'zh/blog/entry.md',images:[]},{id:'doc:guide',kind:'doc',lang:'zh',source:'网站/文档/Guide.md',output:'zh/doc/guide.md',images:[]}];
 const config={version:1,primary:'zh',records,foreignFingerprints:{}};
 const manifest={entries:[{id:'blog:entry',legacyRoutes:['/blog/entry/']},{id:'doc:guide',legacyRoutes:['/docs/zh/tools/guide/']}]};
 fs.writeFileSync(path.join(site,'tools/site-build/manifest.json'),JSON.stringify(manifest));
 const configFile=path.join(site,'tools/content-import/000-sync.local');fs.writeFileSync(configFile,sourceText(config,''));
 return {site,vault,config,manifest,configFile};
}
test('vault-root inline and relative reference links project to the registered Chinese route while preserving text title query and existing public anchors',async t=>{
 const x=fixture(t,'[Read](</网站/文档/Guide.md?view=full> "Title")\n\n[Published](/zh/docs/tools/guide/#guide)\n\n[Again][guide]\n\n[guide]: 文档/Guide.md "Reference title"\n');
 await importContent(x);
 const body=parseSource(fs.readFileSync(path.join(x.site,'content/zh/blog/entry.md'),'utf8')).body;
 assert.equal(body,'[Read](</zh/docs/tools/guide/?view=full> "Title")\n\n[Published](/zh/docs/tools/guide/#guide)\n\n[Again][guide]\n\n[guide]: /zh/docs/tools/guide/ "Reference title"\n');
});
test('a precisely authorized local license projects to the manifest pinned HTTPS destination without copying attachment bytes',async t=>{
 const x=fixture(t,'[MIT License](</附件/网站/许可证/Tool-LICENSE.md>)\n');
 const source='附件/网站/许可证/Tool-LICENSE.md',bytes=Buffer.from('MIT License\nverified text\n'),url='https://github.com/owner/tool/blob/1234567/LICENSE';
 fs.mkdirSync(path.dirname(path.join(x.vault,source)),{recursive:true});fs.writeFileSync(path.join(x.vault,source),bytes);
 x.manifest.entries[0].relativeLinkTargets={'LICENSE':url};fs.writeFileSync(path.join(x.site,'tools/site-build/manifest.json'),JSON.stringify(x.manifest));
 x.config.records[0].attachments=[{source,sha256:hash(bytes),websiteUrl:url}];fs.writeFileSync(x.configFile,sourceText(x.config,''));
 await importContent(x);
 assert.equal(parseSource(fs.readFileSync(path.join(x.site,'content/zh/blog/entry.md'),'utf8')).body,'[MIT License](<'+url+'>)\n');
 assert.equal(fs.existsSync(path.join(x.site,'附件')),false);
});
test('unregistered local Markdown targets reject the whole import before any source or config writes',async t=>{
 const x=fixture(t,'[Private](/网站/Private.md)\n');fs.writeFileSync(path.join(x.vault,'网站/Private.md'),'private\n');
 const config=fs.readFileSync(x.configFile);
 await assert.rejects(()=>importContent(x),/本地链接.*未登记/);
 assert.deepEqual(fs.readdirSync(path.join(x.site,'content/zh/blog')),[]);
 assert.deepEqual(fs.readdirSync(path.join(x.site,'content/zh/doc')),[]);
 assert.deepEqual(fs.readFileSync(x.configFile),config);
});
test('a parent-relative note link inside the vault resolves without treating the unused vault-root candidate as an escape',async t=>{
 const x=fixture(t,'[Read](../网站/文档/Guide.md)\n');await importContent(x);
 assert.equal(parseSource(fs.readFileSync(path.join(x.site,'content/zh/blog/entry.md'),'utf8')).body,'[Read](/zh/docs/tools/guide/)\n');
});
for(const [name,url,mutate,expected]of [
 ['unverified note anchor','/网站/文档/Guide.md#guide',()=>{},/锚点不可核验/],
 ['private attachment','/附件/Private.md',x=>{fs.mkdirSync(path.join(x.vault,'附件'));fs.writeFileSync(path.join(x.vault,'附件/Private.md'),'private')},/本地链接.*未登记/],
 ['escaped target','../../outside.md',()=>{},/本地链接越界/],
 ['supplement target','/网站/文档/Guide.md',x=>{x.config.records[1].kind='supplement'},/补充稿.*没有独立/],
 ['ambiguous root and relative target','文档/Guide.md',x=>{fs.mkdirSync(path.join(x.vault,'文档'));fs.writeFileSync(path.join(x.vault,'文档/Guide.md'),sourceText({title:'Other'},'Other\n'));x.config.records.push({id:'blog:other',kind:'blog',lang:'zh',source:'文档/Guide.md',output:'zh/blog/other.md',images:[]});x.manifest.entries.push({id:'blog:other',legacyRoutes:['/blog/other/']})},/目标歧义/],
 ['ambiguous actual targets with only one authorized','文档/Guide.md',x=>{fs.mkdirSync(path.join(x.vault,'文档'));fs.writeFileSync(path.join(x.vault,'文档/Guide.md'),sourceText({title:'Private'},'Private\n'))},/目标歧义/],
 ['license binary drift','/附件/Tool-LICENSE.md',x=>{const source='附件/Tool-LICENSE.md',url='https://github.com/owner/tool/blob/1234567/LICENSE';fs.mkdirSync(path.join(x.vault,'附件'));fs.writeFileSync(path.join(x.vault,source),'Changed license\n');x.config.records[0].attachments=[{source,sha256:hash('Original license\n'),websiteUrl:url}];x.manifest.entries[0].relativeLinkTargets={LICENSE:url}},/附件hash漂移/],
])test(`import rejects ${name} before any source or config writes`,async t=>{
 const x=fixture(t,'[Read]('+url+')\n');mutate(x);
 fs.writeFileSync(x.configFile,sourceText(x.config,''));fs.writeFileSync(path.join(x.site,'tools/site-build/manifest.json'),JSON.stringify(x.manifest));const config=fs.readFileSync(x.configFile);
 await assert.rejects(()=>importContent(x),expected);
 assert.deepEqual(fs.readdirSync(path.join(x.site,'content/zh/blog')),[]);assert.deepEqual(fs.readdirSync(path.join(x.site,'content/zh/doc')),[]);assert.deepEqual(fs.readFileSync(x.configFile),config);
});
test('projecting an outer note link keeps the nested image occurrence edit intact',async t=>{
 const x=fixture(t,'[![diagram](/assets/diagram.png)](/网站/文档/Guide.md)\n'),bytes=Buffer.from('approved image');fs.mkdirSync(path.join(x.site,'assets'));fs.writeFileSync(path.join(x.site,'assets/diagram.png'),bytes);
 x.config.records[0].images=[{id:'blog:entry:media:1',ordinal:1,source:'/assets/diagram.png',state:'public',websiteUrl:'/assets/diagram.png',publicSha256:hash(bytes)}];fs.writeFileSync(x.configFile,sourceText(x.config,''));
 await importContent(x);assert.equal(parseSource(fs.readFileSync(path.join(x.site,'content/zh/blog/entry.md'),'utf8')).body,'[![diagram](/media-occurrence/blog%3Aentry%3Amedia%3A1)](/zh/docs/tools/guide/)\n');
});
