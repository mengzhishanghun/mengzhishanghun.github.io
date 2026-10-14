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
const snapshots = new Map();
const staticIndexes = new WeakSet();
let binding, frame = 0, navigation = 0;
const connected = owner => owner?.element.isConnected && container() === owner.element && location.pathname === owner.pathname;
function persist(owner, saved, generation) {
  if (generation !== navigation || owner !== binding || !connected(owner) || !sameEntry(saved, currentEntry())) return;
  if (document.querySelector('meta[name="astro-view-transitions-enabled"]') && !Number.isFinite(saved.index)) return;
  history.replaceState({...history.state, mzshViewport: {key: saved.key, top: saved.top}}, '');
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
  const element = container(), entry = currentEntry();
  if (!element?.isConnected) return;
  // The list may still be showing its static fallback after an Astro swap.
  // Restore only after its cumulative batches have established the height.
  const index = element.querySelector?.('[data-content-index]');
  if (index && !['true','failed'].includes(index.dataset.ready) && !staticIndexes.has(index)) return;
  if (binding?.element === element && binding.documentURL === documentURL() && sameEntry(binding.entry, entry)) return;
  binding?.controller.abort();
  cancelAnimationFrame(frame);
  frame = 0;
  const controller = new AbortController();
  binding = {element, entry, pathname: location.pathname, documentURL: documentURL(), controller};
  const top = snapshots.get(entryKey(entry))?.top ?? rememberedTop(history.state, entry.key);
  if (top !== undefined) {
    element.scrollTop = top;
    const saved = {...entry, top};
    snapshots.set(entryKey(entry), saved);
    persist(binding, saved, navigation);
  }
  element.addEventListener('scroll', () => capture(), {passive: true, signal: controller.signal});
}
function traverse() {
  navigation++;
  cancelAnimationFrame(frame);
  frame = 0;
  // Cross-document traversals restore after the real DOM swap. Same-document
  // hash traversals have no Astro page-load event, so restore and bind here.
  if (connected(binding) && binding.documentURL === documentURL()) bind();
}
// Astro also pushes same-document entries without emitting lifecycle events.
// Observe only successful native pushes; replacements keep their native method.
const nativePushState = history.pushState;
history.pushState = function pushState() {
  const owner = binding, before = currentEntry(), beforeDocument = documentURL();
  const leaving = connected(owner) && owner.entry.index === before.index
    ? {...before, top: owner.element.scrollTop} : undefined;
  const result = Reflect.apply(nativePushState, this, arguments);
  if (this !== history) return result;
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
  return result;
};
document.addEventListener('astro:before-preparation', () => {navigation++; flush();});
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
window.addEventListener('pagehide', flush);
bind();

window[installedKey] = true;
}
