import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const slug=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const common=z.object({title:z.string().min(1),description:z.string().min(1),slug,categoryId:slug,categoryName:z.string().min(1),categoryOrder:z.number().int().nonnegative(),order:z.number().int().nonnegative(),status:z.string().min(1),featured:z.boolean().default(false),draft:z.boolean().default(false),tags:z.array(z.string().min(1)).default([]),productIds:z.array(slug).default([]),workIds:z.array(slug).default([]),links:z.array(z.object({label:z.string().min(1),href:z.string().url()})).default([])});
const blog=defineCollection({loader:glob({pattern:'**/*.md',base:new URL('../../shared/posts/',import.meta.url),generateId:({entry})=>entry.replace(/\.md$/,'')}),schema:common.extend({lang:z.enum(['zh','en']),translationKey:slug,date:z.coerce.date(),docIds:z.array(slug).default([])})});
const works=defineCollection({loader:glob({pattern:'**/*.md',base:new URL('./content/works/',import.meta.url),generateId:({entry})=>entry.replace(/\.md$/,'')}),schema:common});
const cases=defineCollection({loader:glob({pattern:'**/*.md',base:new URL('./content/cases/',import.meta.url),generateId:({entry})=>entry.replace(/\.md$/,'')}),schema:common});
export const collections={blog,works,cases};
