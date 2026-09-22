export type SearchDocument = {
  title: string;
  description: string;
  categoryName: string;
  tags: string[];
  body: string;
};

export type SearchRank = {
  matchedTerms: number;
  score: number;
};

const fieldWeights = {
  title: 120,
  tags: 90,
  categoryName: 70,
  description: 55,
  body: 20,
};

export function normalizeSearchText(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('zh-CN').replace(/\s+/g, ' ').trim();
}

export function splitSearchTerms(value: string) {
  return [...new Set(normalizeSearchText(value).split(' ').filter(Boolean))];
}

function fuzzyWords(value: string) {
  const original = normalizeSearchText(value);
  const camelCaseSeparated = value.replace(/([a-z\d])([A-Z])/g, '$1 $2');
  const normalized = normalizeSearchText(camelCaseSeparated);
  return [...new Set([
    original,
    normalized,
    ...original.split(/[^\p{L}\p{N}]+/u).filter(Boolean),
    ...normalized.split(/[^\p{L}\p{N}]+/u).filter(Boolean),
  ])];
}

function editDistance(left: string, right: string, limit: number) {
  if (Math.abs(left.length - right.length) > limit) return limit + 1;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    let rowMinimum = current[0];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution = previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
      const value = Math.min(previous[rightIndex] + 1, current[rightIndex - 1] + 1, substitution);
      current.push(value);
      rowMinimum = Math.min(rowMinimum, value);
    }
    if (rowMinimum > limit) return limit + 1;
    previous = current;
  }
  return previous[right.length];
}

function fieldScore(value: string, term: string, weight: number) {
  const normalized = normalizeSearchText(value);
  if (!normalized) return 0;
  if (normalized === term) return weight * 4;
  if (fuzzyWords(value).includes(term)) return weight * 3;
  if (normalized.includes(term)) return weight * 2 + Math.min(term.length, 20);
  if (term.length < 4) return 0;

  const distanceLimit = term.length >= 9 ? 2 : 1;
  const fuzzyMatch = fuzzyWords(value).some(word => {
    if (word.length < 3 || Math.abs(word.length - term.length) > distanceLimit) return false;
    return editDistance(word, term, distanceLimit) <= distanceLimit;
  });
  return fuzzyMatch ? weight : 0;
}

export function rankSearchDocument(document: SearchDocument, terms: string[]): SearchRank {
  let matchedTerms = 0;
  let score = 0;
  for (const term of terms) {
    const termScore = Math.max(
      fieldScore(document.title, term, fieldWeights.title),
      ...document.tags.map(tag => fieldScore(tag, term, fieldWeights.tags)),
      fieldScore(document.categoryName, term, fieldWeights.categoryName),
      fieldScore(document.description, term, fieldWeights.description),
      fieldScore(document.body, term, fieldWeights.body),
    );
    if (termScore > 0) {
      matchedTerms += 1;
      score += termScore;
    }
  }
  return { matchedTerms, score };
}
