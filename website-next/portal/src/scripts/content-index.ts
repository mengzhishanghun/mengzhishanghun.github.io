import { rankSearchDocument, splitSearchTerms, type SearchDocument } from '../../../shared/content-search';

type ContentDocument = SearchDocument & {
  slug: string;
  categoryId: string;
  tags: string[];
  order: number;
  date: string;
};

function initializeContentIndex(root: HTMLElement) {
  if (root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const dataElement = root.querySelector<HTMLScriptElement>('[data-content-index-data]');
  const input = root.querySelector<HTMLInputElement>('[data-content-query]');
  const tagList = root.querySelector<HTMLElement>('[data-content-tags]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-content-clear]');
  const status = root.querySelector<HTMLElement>('[data-content-status]');
  const empty = root.querySelector<HTMLElement>('[data-content-empty]');
  const cards = [...root.querySelectorAll<HTMLElement>('[data-content-card]')];
  const groups = [...root.querySelectorAll<HTMLDetailsElement>('[data-content-group]')];
  if (!dataElement || !input || !tagList || !clearButton || !status || !empty || groups.length === 0) return;

  const documents = JSON.parse(dataElement.textContent || '[]') as ContentDocument[];
  const parameters = new URLSearchParams(location.search);
  const availableCategories = new Set(groups.map(group => group.dataset.category || ''));
  let categoryId = parameters.get('category') || groups[0].dataset.category || '';
  if (!availableCategories.has(categoryId)) categoryId = groups[0].dataset.category || '';
  let selectedTags = new Set(parameters.getAll('tag'));
  input.value = parameters.get('q') || '';

  const categoryDocuments = () => documents.filter(document => document.categoryId === categoryId);

  function rankedDocuments() {
    const terms = splitSearchTerms(input.value);
    return categoryDocuments()
      .map((document, originalIndex) => ({ document, originalIndex, rank: rankSearchDocument(document, terms) }))
      .filter(item => terms.length === 0 || item.rank.matchedTerms > 0)
      .sort((left, right) => {
        if (terms.length > 0) {
          return right.rank.matchedTerms - left.rank.matchedTerms || right.rank.score - left.rank.score || left.originalIndex - right.originalIndex;
        }
        return left.originalIndex - right.originalIndex;
      });
  }

  function matchesSelectedTags(document: ContentDocument, extraTag?: string) {
    const requiredTags = new Set(selectedTags);
    if (extraTag) requiredTags.add(extraTag);
    return [...requiredTags].every(tag => document.tags.includes(tag));
  }

  function updateUrl() {
    const next = new URLSearchParams();
    if (categoryId !== groups[0].dataset.category) next.set('category', categoryId);
    if (input.value.trim()) next.set('q', input.value.trim());
    [...selectedTags].forEach(tag => next.append('tag', tag));
    history.replaceState({}, '', location.pathname + (next.size ? `?${next}` : '') + location.hash);
  }

  function renderTags(searchedDocuments: ContentDocument[]) {
    const baseCounts = new Map<string, number>();
    categoryDocuments().forEach(document => document.tags.forEach(tag => baseCounts.set(tag, (baseCounts.get(tag) || 0) + 1)));
    const tags = [...baseCounts.keys()].sort((left, right) => (baseCounts.get(right) || 0) - (baseCounts.get(left) || 0) || left.localeCompare(right, 'zh-CN'));
    selectedTags = new Set([...selectedTags].filter(tag => baseCounts.has(tag)));
    tagList.replaceChildren(...tags.map(tag => {
      const selected = selectedTags.has(tag);
      const count = searchedDocuments.filter(document => selected ? matchesSelectedTags(document) : matchesSelectedTags(document, tag)).length;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'content-tag';
      button.dataset.tag = tag;
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = !selected && count === 0;
      button.textContent = `${tag}（${count}）${selected ? ' ×' : ''}`;
      button.setAttribute('aria-label', selected ? `取消标签 ${tag}` : `选择标签 ${tag}，${count} 篇文章`);
      button.addEventListener('click', () => {
        if (selectedTags.has(tag)) selectedTags.delete(tag); else selectedTags.add(tag);
        render();
      });
      return button;
    }));
  }

  function render() {
    const ranked = rankedDocuments();
    const searchedDocuments = ranked.map(item => item.document);
    renderTags(searchedDocuments);
    const visible = ranked.filter(item => matchesSelectedTags(item.document));
    const positions = new Map(visible.map((item, index) => [item.document.slug, index]));
    cards.forEach(card => {
      const position = positions.get(card.dataset.slug || '');
      card.hidden = position === undefined;
      if (position !== undefined) card.style.order = String(position);
    });
    empty.hidden = visible.length > 0;
    const hasQuery = splitSearchTerms(input.value).length > 0;
    status.textContent = `显示 ${visible.length} 篇文章${hasQuery ? ' · 按相关性排序' : ''}`;
    clearButton.hidden = selectedTags.size === 0 && !input.value.trim();
    groups.forEach(group => group.open = group.dataset.category === categoryId);
    updateUrl();
  }

  groups.forEach(group => {
    const summary = group.querySelector('summary');
    summary?.addEventListener('click', event => {
      event.preventDefault();
      const nextCategory = group.dataset.category || '';
      if (nextCategory !== categoryId) selectedTags.clear();
      categoryId = nextCategory;
      render();
    });
  });
  input.addEventListener('input', render);
  clearButton.addEventListener('click', () => {
    input.value = '';
    selectedTags.clear();
    render();
    input.focus();
  });
  render();
}

function initializePageContentIndexes() {
  document.querySelectorAll<HTMLElement>('[data-content-index]').forEach(initializeContentIndex);
}

document.addEventListener('astro:page-load', initializePageContentIndexes);
initializePageContentIndexes();
