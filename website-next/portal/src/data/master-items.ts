import { products, cases } from './site';
import type { MasterItem } from '../components/MasterDetail.astro';

export const workItems: MasterItem[] = products.map(product => ({
  id: product.id, navTitle: product.zh.label, title: product.name, status: product.status ?? '归档', description: product.zh.description,
  details: [{ heading: '功能特点', content: product.zh.features }, { heading: '解决的问题', content: product.zh.problem }, { heading: '结果', content: product.zh.result }],
  links: [product.repo && { label: 'GitHub', href: product.repo }, product.fab && { label: 'Fab', href: product.fab }, product.docPath && { label: '使用文档', href: '/docs/zh/' + product.docPath + '/' }].filter(Boolean) as { label: string; href: string }[],
}));

const relatedLinks = (ids: string[]) => ids.flatMap(id => { const product = products.find(item => item.id === id); if (!product) return []; return [product.repo && { label: product.name + ' GitHub', href: product.repo }, product.fab && { label: product.name + ' Fab', href: product.fab }, product.docPath && { label: product.name + ' 使用文档', href: '/docs/zh/' + product.docPath + '/' }].filter(Boolean) as { label: string; href: string }[]; });
export const caseItems: MasterItem[] = cases.map(item => { const copy = item.zh as Record<string, string>; const meta = item as { navTitle?: string; status?: string; productIds: string[] }; return { id: item.id, navTitle: meta.navTitle ?? copy.title, title: copy.title, status: meta.status ?? '已完成', description: copy.summary, details: [{ heading: '背景', content: copy.background ?? copy.challenge }, { heading: '主要方案', content: copy.approach }, { heading: '最终效果', content: copy.outcome }], links: relatedLinks(meta.productIds) }; });
