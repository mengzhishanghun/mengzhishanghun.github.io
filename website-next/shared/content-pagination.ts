export function paginateContent<T>(items: T[], requestedPage = 1, pageSize = 9) {
  const pageCount = Math.ceil(items.length / pageSize);
  const page = Math.min(Math.max(Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1, 1), Math.max(pageCount, 1));
  return { items: items.slice((page - 1) * pageSize, page * pageSize), page, pageCount, total: items.length };
}

export function paginationNumbers(page: number, pageCount: number): (number | 'ellipsis')[] {
  const numbers = new Set([1, pageCount, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach(number => numbers.add(number));
  if (page >= pageCount - 2) [pageCount - 3, pageCount - 2, pageCount - 1].forEach(number => numbers.add(number));
  const visible = [...numbers].filter(number => number >= 1 && number <= pageCount).sort((left, right) => left - right);
  return visible.flatMap((number, index) => index > 0 && number - visible[index - 1] > 1 ? ['ellipsis', number] : [number]) as (number | 'ellipsis')[];
}
