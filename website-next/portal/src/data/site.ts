export type Lang = 'zh' | 'en';
// 新站只生成中文根路由；旧动态语言页不再生成内容页。
export const languages: Lang[] = [];
export const links = { github: 'https://github.com/mengzhishanghun', fab: 'https://www.fab.com/search?q=mengzhishanghun', blog: 'https://www.cnblogs.com/mengzhishanghun', email: 'mzsh.me@icloud.com' };
export function href(_lang: Lang, area = '', slug = '') { const base = area === 'projects' ? 'works' : area; return '/' + (base ? base + '/' : '') + (slug ? slug + '/' : ''); }
export const ui = { zh: { brand: '梦之殇魂', home: '首页', projects: '作品', works: '案例', docs: '文档', blog: '博客', me: '关于我', contact: '联系我', explore: '浏览作品', detail: '查看详情', all: '全部作品', download: '获取工具', readDocs: '阅读文档', source: '源码与说明', selected: '精选作品', intro: '独立开发者 · Unreal Engine 与自动化', description: '把复杂需求做成可复用的工具，把重复工作交给自动化。', footer: '插件、工具，以及持续打磨的想法。' }, en: { brand: 'MZSH', home: 'Home', projects: 'Works', works: 'Cases', docs: 'Docs', blog: 'Blog', me: 'About', contact: 'Contact', explore: 'Explore', detail: 'Detail', all: 'All works', download: 'Download', readDocs: 'Docs', source: 'Source', selected: 'Selected works', intro: 'Independent developer', description: '', footer: '' } };
export { products, works, cases } from '../../../shared/catalog';
