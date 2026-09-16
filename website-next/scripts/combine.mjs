import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const out = path.join(root, 'dist');
if (path.dirname(out) !== root || (fs.existsSync(out) && fs.lstatSync(out).isSymbolicLink())) throw new Error('Unsafe site output path');
for (const app of ['portal', 'docs']) if (!fs.existsSync(path.join(root, app, 'dist', 'index.html'))) throw new Error(`${app} build output is missing`);

const htmlFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? htmlFiles(target) : entry.isFile() && entry.name.endsWith('.html') ? [target] : [];
});
const scriptPattern = /<script\b[^>]*\bsrc\s*=\s*(["'])([^"']+)\1[^>]*><\/script>/gi;
const clientRouterSources = (files) => [...new Set(files.flatMap((file) => [...fs.readFileSync(file, 'utf8').matchAll(scriptPattern)].map((match) => match[2]).filter((src) => src.includes('ClientRouter'))))];
const replaceClientRouterScripts = (html, onReplace = () => {}) => html.replace(scriptPattern, (tag, quote, src) => {
  if (!src.includes('ClientRouter')) return tag;
  onReplace();
  return tag.replace(/(\bsrc\s*=\s*)(["'])[^"']*\2/i, `$1${quote}/site-router.js${quote}`);
});

const parserSample = '<script crossorigin type="module" src="/_astro/ClientRouter.test.js"></script><script data-router src = \'/_astro/ClientRouter.spaced.js\' crossorigin type="module"></script><script src="/keep.js" type="module"></script>';
let parserSampleReplacements = 0;
const parsedSample = replaceClientRouterScripts(parserSample, () => { parserSampleReplacements += 1; });
if (!parsedSample.includes('crossorigin') || !parsedSample.includes('src="/site-router.js"') || !parsedSample.includes('src = \'/site-router.js\'') || !parsedSample.includes('<script src="/keep.js" type="module"></script>') || parserSampleReplacements !== 2) {
  throw new Error('ClientRouter script parser self-check failed');
}

const portalFiles = htmlFiles(path.join(root, 'portal', 'dist'));
const docsFiles = htmlFiles(path.join(root, 'docs', 'dist'));
const portalRouters = clientRouterSources(portalFiles);
const docsRouters = clientRouterSources(docsFiles);
if (portalRouters.length !== 1) throw new Error(`Expected exactly one portal ClientRouter source, found ${portalRouters.length}`);
if (!docsRouters.length) throw new Error('Expected at least one docs ClientRouter source');
const portalRouter = portalRouters[0];
if (!fs.existsSync(path.join(root, 'portal', 'dist', portalRouter.replace(/^\//, '')))) throw new Error(`Portal ClientRouter asset is missing: ${portalRouter}`);

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(root, 'portal', 'dist'), out, { recursive: true });
fs.cpSync(path.join(root, 'docs', 'dist'), path.join(out, 'docs'), { recursive: true });
fs.writeFileSync(path.join(out, 'site-router.js'), `globalThis.__mzshSiteRouterPromise ??= import(${JSON.stringify(portalRouter)});\n`);

const combinedFiles = htmlFiles(out);
let replaced = 0;
for (const file of combinedFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const updated = source.replace(scriptPattern, (tag, quote, src) => {
    if (!src.includes('ClientRouter')) return tag;
    replaced += 1;
    return tag.replace(/(\bsrc=)(["'])[^"']*\2/i, `$1${quote}/site-router.js${quote}`);
  });
  fs.writeFileSync(file, updated);
}
if (!replaced) throw new Error('No ClientRouter script references were replaced');
const remainingRouters = clientRouterSources(combinedFiles);
if (remainingRouters.length) throw new Error(`Unreplaced ClientRouter references remain: ${remainingRouters.join(', ')}`);
const unifiedRefs = combinedFiles.reduce((count, file) => count + [...fs.readFileSync(file, 'utf8').matchAll(scriptPattern)].filter((match) => match[2] === '/site-router.js').length, 0);
if (unifiedRefs !== replaced) throw new Error(`Expected ${replaced} unified router references, found ${unifiedRefs}`);
console.log(`Combined site: ${out}; unified ${replaced} ClientRouter references via /site-router.js`);
