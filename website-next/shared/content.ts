import { getCollection } from 'astro:content';

export type Section = 'works' | 'cases' | 'blog';
export async function published(section: Section) {
  const entries = (await getCollection(section as never)).filter((entry: any) => !entry.data.draft && (section !== 'blog' || entry.data.date.getTime() <= Date.now()));
  const slugs = new Set<string>();
  for (const entry of entries) { if (slugs.has((entry as any).data.slug)) throw new Error(`Duplicate ${section} slug: ${(entry as any).data.slug}`); slugs.add((entry as any).data.slug); }
  return entries.sort((a: any,b: any) => a.data.categoryOrder-b.data.categoryOrder || a.data.order-b.data.order || a.data.title.localeCompare(b.data.title));
}
export async function findPublished(section: Section, slug: string) { return (await published(section)).find((entry: any) => entry.data.slug === slug); }
