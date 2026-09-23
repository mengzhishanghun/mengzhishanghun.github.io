import { getCollection, type CollectionEntry } from 'astro:content';

export type Section = 'works' | 'cases' | 'blog';
export async function published<T extends Section>(section: T): Promise<CollectionEntry<T>[]> {
  const entries = (await getCollection(section)).filter((entry) => !entry.data.draft && (section !== 'blog' || entry.data.date.getTime() <= Date.now()));
  const slugs = new Set<string>();
  for (const entry of entries) { if (slugs.has(entry.data.slug)) throw new Error(`Duplicate ${section} slug: ${entry.data.slug}`); slugs.add(entry.data.slug); }
  return entries.sort((a,b) => a.data.categoryOrder-b.data.categoryOrder || a.data.order-b.data.order || a.data.title.localeCompare(b.data.title));
}
export async function findPublished<T extends Section>(section: T, slug: string) { return (await published(section)).find((entry) => entry.data.slug === slug); }
