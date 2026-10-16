import {rememberSessionPage,prepareSessionReturn,applySessionReturn,clearSessionReturn} from './return-state.js';
const installedKey = Symbol.for('mzsh.viewport');
if (!window[installedKey]) {
const viewportURL = () => location.pathname + location.search + location.hash;
const documentURL = () => location.pathname + location.search;
const currentEntry = () => ({index: history.state?.index, key: viewportURL()});
const entryKey = entry => JSON.stringify([entry.index ?? null, entry.key]);
const sameEntry = (left, right) => left?.index === right.index && left?.key === right.key;
const container = () => document.querySelector('.site-chrome-docs .main-frame') ?? document.querySelector('.site-chrome-main');
const rememberedTop = (state, key) => {
  const saved = state?.mzshViewport;
  return saved?.key === key && Number.isFinite(saved.top) && saved.top >= 0 ? saved.top : undefined;
};
const nativeReplaceState = history.replaceState;
const objectState = state => state && typeof state === 'object' && !Array.isArray(state) ? state : {};
const hasRouter = () => !!document.querySelector('meta[name="astro-view-transitions-enabled"]');
const entryURL = value => {
  try {const url = new URL(value, location.href);return url.origin === location.origin ? url.pathname + url.search + url.hash : null;} catch {return null;}
};
const newIdentity = () => window.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
const navigationKey = () => {try {return window.navigation?.currentEntry?.key;} catch {return undefined;}};
const navigationRecord = () => {
  const record = history.state?.mzshNavigation;
  return record && typeof record.id === 'string' && record.id && record.url === viewportURL() ? record : null;
};
const makeRecord = (url, index, parent = null) => ({id:newIdentity(), url, index:Number.isFinite(index) ? index : null, parent});
function stampEntry() {
  if (navigationRecord()) return;
  const record = makeRecord(viewportURL(), history.state?.index);
  const key = navigationKey();if (typeof key === 'string') record.navigationKey = key;
  Reflect.apply(nativeReplaceState, history, [{...objectState(history.state), mzshNavigation:record}, '']);
}
function provenPrevious() {
  const record = navigationRecord(), parent = record?.parent;
  if (hasRouter() && parent && typeof parent.id === 'string' && parent.id && parent.id !== record.id && entryURL(parent.url) === parent.url) return parent;
  // Full-document entries have no Astro push hook. Only the browser's current
  // entry/key plus the visible, exactly preceding same-origin entry proves back.
  try {
    const api = window.navigation, current = api?.currentEntry;
    if (!current || !Number.isInteger(current.index) || typeof current.key !== 'string' || !current.key || new URL(current.url).href !== location.href) return null;
    if (record?.navigationKey && record.navigationKey !== current.key) return null;
    const entries = api.entries();
    if (!Array.isArray(entries) || !entries.some(entry=>entry.key === current.key && entry.index === current.index && new URL(entry.url).href === location.href)) return null;
    const previous = entries.find(entry=>entry.index === current.index-1);
    if (!previous || typeof previous.key !== 'string' || !previous.key || previous.key === current.key) return null;
    const url = new URL(previous.url);
    if (url.origin !== location.origin) return null;
    return {id:previous.key, index:previous.index, url:entryURL(url.href), navigationKey:previous.key};
  } catch {return null;}
}
let pendingReturn = null, preparation = 0;
function updateReturnLabels() {
  const label = window.SiteCopy?.['viewport:return-previous'];
  if(!label)return;
  document.querySelectorAll('a.article-back, a.outline-mobile-back').forEach(anchor=>{
    const text = [...anchor.childNodes].find(node=>node.nodeType === 3 && node.nodeValue?.trim());
    if(text)text.nodeValue=label;
    anchor.setAttribute('aria-label',label);
  });
}
function clearPendingReturn(cancel=false) {
  const pending=pendingReturn;
  if(pending?.anchor?.isConnected && pending.href!==undefined)pending.anchor.setAttribute('href',pending.href);
  if(cancel)clearSessionReturn(pending?.intent);
  pendingReturn=null;
}
function finishReturn() {
  updateReturnLabels();
  if (pendingReturn && (navigationRecord()?.id !== pendingReturn.from || pendingReturn.anchor && !pendingReturn.anchor.isConnected)) clearPendingReturn(!!pendingReturn.target && pendingReturn.target!==viewportURL());
}
history.replaceState = function replaceState(state, title, url) {
  if (this !== history) return Reflect.apply(nativeReplaceState, this, arguments);
  const before = navigationRecord() || makeRecord(viewportURL(),history.state?.index);
  const nextURL = arguments.length > 2 && url !== undefined ? entryURL(url) : viewportURL();
  const merged = {...objectState(history.state), ...objectState(state)};
  const record = {...before, url:nextURL, index:Number.isFinite(merged.index) ? merged.index : null};
  const key = navigationKey();if (typeof key === 'string') record.navigationKey = key;
  const args = [...arguments];args[0] = {...merged,mzshNavigation:record};
  const result = Reflect.apply(nativeReplaceState,this,args);
  updateReturnLabels();return result;
};
document.addEventListener('click', event=>{
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target?.closest?.('a.article-back, a.outline-mobile-back');
  if (!anchor?.isConnected || anchor.hasAttribute('download') || anchor.getAttribute('target') && anchor.getAttribute('target') !== '_self') return;
  if (new URL(anchor.href,location.href).origin !== location.origin) return;
  if (binding && (!connected(binding) || binding.navigationId !== navigationRecord()?.id)) {event.preventDefault();return;}
  if (pendingReturn) {event.preventDefault();return;}
  const previous = provenPrevious();
  if (previous) {
    event.preventDefault();flush();clearSessionReturn();pendingReturn = {from:navigationRecord()?.id, previous};
    history.back();return;
  }
  flush();
  const prepared=prepareSessionReturn(anchor.href);
  pendingReturn={from:navigationRecord()?.id,target:prepared.url,intent:prepared.intent,anchor,href:anchor.getAttribute('href')};
  if (hasRouter()) {
    anchor.setAttribute('data-astro-history','replace');
    if(prepared.intent)anchor.setAttribute('href',prepared.url);
  } else {event.preventDefault();location.replace(prepared.url);}
}, {capture:true});
const snapshots = new Map();
const staticIndexes = new WeakSet();
let binding, frame = 0, navigation = 0;
const connected = owner => owner?.element.isConnected && container() === owner.element && location.pathname === owner.pathname;
function persist(owner, saved, generation) {
  if (generation !== navigation || owner !== binding || !connected(owner) || !sameEntry(saved, currentEntry())) return;
  if (document.querySelector('meta[name="astro-view-transitions-enabled"]') && !Number.isFinite(saved.index)) return;
  history.replaceState({...history.state, mzshViewport: {key: saved.key, top: saved.top}}, '');
  rememberSessionPage({top:saved.top});
}
function capture(schedule = true) {
  const owner = binding, entry = currentEntry();
  // URL replacements on the same entry include filters and outline clicks. A
  // traversal has a different index and must never inherit the outgoing DOM.
  if (!connected(owner) || owner.entry.index !== entry.index) return;
  owner.entry = entry;
  owner.documentURL = documentURL();
  const saved = {...entry, top: owner.element.scrollTop};
  snapshots.set(entryKey(entry), saved);
  cancelAnimationFrame(frame);
  frame = 0;
  if (schedule) {
    const generation = navigation;
    frame = requestAnimationFrame(() => {frame = 0; persist(owner, saved, generation);});
  }
  return saved;
}
function flush() {
  const saved = capture(false);
  if (saved) persist(binding, saved, navigation);
}
function bind() {
  applySessionReturn();
  const element = container(), entry = currentEntry();
  if (!element?.isConnected) return;
  // The list may still be showing its static fallback after an Astro swap.
  // Restore only after its cumulative batches have established the height.
  const index = element.querySelector?.('[data-content-index]');
  if (index && !['true','failed'].includes(index.dataset.ready) && !staticIndexes.has(index)) return;
  if (binding?.element === element && binding.documentURL === documentURL() && sameEntry(binding.entry, entry)) {finishReturn();return;}
  binding?.controller.abort();
  cancelAnimationFrame(frame);
  frame = 0;
  const controller = new AbortController();
  binding = {element, entry, navigationId:navigationRecord()?.id, pathname: location.pathname, documentURL: documentURL(), controller};
  const top = snapshots.get(entryKey(entry))?.top ?? rememberedTop(history.state, entry.key);
  if (top !== undefined) {
    element.scrollTop = top;
    const saved = {...entry, top};
    snapshots.set(entryKey(entry), saved);
    persist(binding, saved, navigation);
  }
  rememberSessionPage({top:element.scrollTop});
  element.addEventListener('scroll', () => capture(), {passive: true, signal: controller.signal});
  finishReturn();
}
function traverse() {
  navigation++;
  cancelAnimationFrame(frame);
  frame = 0;
  stampEntry();
  // Cross-document traversals restore after the real DOM swap. Same-document
  // hash traversals have no Astro page-load event, so restore and bind here.
  if (connected(binding) && binding.documentURL === documentURL()) bind();
  updateReturnLabels();
}
// Astro also pushes same-document entries without emitting lifecycle events.
// Establish parents through successful pushes; replacements retain identity.
const nativePushState = history.pushState;
history.pushState = function pushState() {
  if (this !== history) return Reflect.apply(nativePushState,this,arguments);
  const owner = binding, before = currentEntry(), beforeDocument = documentURL();
  const leaving = connected(owner) && owner.entry.index === before.index
    ? {...before, top: owner.element.scrollTop} : undefined;
  const parentRecord = navigationRecord() || makeRecord(before.key,history.state?.index);
  const parent = {id:parentRecord.id,index:Number.isFinite(history.state?.index) ? history.state.index : null,url:before.key};
  const record = makeRecord(arguments.length > 2 && arguments[2] !== undefined ? entryURL(arguments[2]) : before.key,arguments[0]?.index,parent);
  const args = [...arguments];args[0] = {...objectState(arguments[0]),mzshNavigation:record};
  const result = Reflect.apply(nativePushState, this, args);
  clearPendingReturn(pendingReturn?.target!==viewportURL());
  const entry = currentEntry();
  if (leaving) snapshots.set(entryKey(leaving), leaving);
  if (Number.isFinite(entry.index)) {
    for (const [key, saved] of snapshots) {
      if (Number.isFinite(saved.index) && saved.index >= entry.index) snapshots.delete(key);
    }
  } else snapshots.delete(entryKey(entry));
  navigation++;
  cancelAnimationFrame(frame);
  frame = 0;
  // Cross-document pushes happen after Astro swaps the DOM; after-swap binds
  // those containers. A same-document push can keep using the current one.
  if (owner === binding && connected(owner) && beforeDocument === documentURL()) bind();
  updateReturnLabels();
  return result;
};
document.addEventListener('astro:before-preparation', event => {
  navigation++;flush();
  const token = ++preparation, pending = pendingReturn;
  if (pending && event.signal) {
    pending.preparation = token;
    event.signal.addEventListener('abort',()=>{
      if (pendingReturn === pending && pending.preparation === token && preparation === token) clearPendingReturn(true);
    },{once:true});
  }
});
document.addEventListener('astro:after-swap', bind);
document.addEventListener('astro:page-load', () => {
  bind();
  const element = container(), index = element?.querySelector?.('[data-content-index]');
  if (!index) return;
  const entry = currentEntry(), generation = navigation;
  // Astro emits page-load after module load or error. Let every synchronous
  // initializer run before accepting an unenhanced, complete static list.
  queueMicrotask(() => {
    if (!element.isConnected || container() !== element || element.querySelector?.('[data-content-index]') !== index || generation !== navigation || !sameEntry(entry,currentEntry())) return;
    if (!['true','failed'].includes(index.dataset.ready)) staticIndexes.add(index);
    bind();
  });
});
document.addEventListener('mzsh:content-index-ready', event => {
  const element = container();
  if (element?.isConnected && element.querySelector?.('[data-content-index]') === event.detail?.element) bind();
});
window.addEventListener('popstate', traverse);
window.addEventListener('hashchange', traverse);
window.addEventListener('pagehide', () => {flush();clearPendingReturn();});
stampEntry();
updateReturnLabels();
bind();

window[installedKey] = true;
}
