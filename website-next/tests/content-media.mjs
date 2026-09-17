import assert from 'node:assert/strict';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { remarkMedia } from '../shared/markdown/media.ts';
const fixture=join(process.cwd(),'portal/public/media/tests/fixture');
mkdirSync(join(fixture,'images'),{recursive:true});mkdirSync(join(fixture,'video'),{recursive:true});writeFileSync(join(fixture,'images','ok.png'),'x');writeFileSync(join(fixture,'video','ok.mp4'),'x');
const run=node=>{const tree={type:'root',children:[node]};remarkMedia()(tree);return tree.children[0].value;};
try{
 assert.match(run({type:'image',url:'/media/tests/fixture/images/ok.png',alt:'示例'}),/loading="lazy"/);
 assert.match(run({type:'leafDirective',name:'video',attributes:{src:'/media/tests/fixture/video/ok.mp4'},children:[{value:'视频'}]}),/preload="none"/);
 assert.match(run({type:'leafDirective',name:'audio',attributes:{src:'https://example.com/a.mp3'},children:[{value:'音频'}]}),/preload="none"/);
 const bilibili=run({type:'leafDirective',name:'bilibili',attributes:{bvid:'BV1xx411c7mD',page:'1'},children:[{value:'视频'}]});assert.match(bilibili,/data-bilibili/);assert.doesNotMatch(bilibili,/<iframe/);assert.doesNotMatch(bilibili,/autoplay/);
 assert.throws(()=>run({type:'leafDirective',name:'bilibili',attributes:{bvid:'bad'},children:[{value:'视频'}]}),/strict BVID/);
 assert.throws(()=>run({type:'html',value:'<iframe src="https://example.com"></iframe>'}),/Raw HTML is not allowed/);
 assert.throws(()=>run({type:'image',url:'/media/tests/fixture/images/ok.png',alt:''}),/non-empty alt/);
 assert.throws(()=>run({type:'image',url:'/media/tests/fixture/images/missing.png',alt:'缺失'}),/Missing/);
 console.log('content media AST tests passed');
}finally{rmSync(join(process.cwd(),'portal/public/media/tests'),{recursive:true,force:true});}
