# MZSH 网站本地预览

新版源代码位于本目录，旧站根目录的 index.html、css/ 和 js/ 保持原样。开发分支不用于 GitHub Pages 发布。

## 运行

需要 Node.js 22.12 或以上。在本目录运行：

```powershell
npm ci
npm run dev
```

主站预览为 http://127.0.0.1:4321/ ，文档通过主站的 /docs/ 路径访问。预览只绑定回环地址。

```powershell
npm run status
npm run stop
npm run build
npm run preview
```

build 将两个站点的静态产物合并到 preview.local/；preview 默认在 127.0.0.1:4173 提供完整静态预览，包含文档全文搜索。静态预览进程用 Ctrl+C 关闭。开发模式中的文档搜索可用性以 Starlight 的开发提示为准。

## 内容与结构

- portal/：Astro 主站、个人介绍、工具列表与详情、博客入口；中文和英文位于 /zh/ 和 /en/。
- portal/src/data/site.ts：产品资料、联系方式与导航链接的统一来源。
- docs/：独立 Starlight 文档站，内容为 Markdown；中文、英文分别组织。
- portal/public/assets/github-avatar.png：复用公开 GitHub 头像；来源 https://avatars.githubusercontent.com/u/37863526?v=4 。
- 工具资料依据 MZSH-Tools/UEPluginAutoPacker、UEPluginManager、MDBlogPacker 的公开 README；获取链接指向对应 Release。未使用虚构客户、价格、评价或产品截图。
- 博客入口连接现有博客园，不从私人 Obsidian 笔记库自动发布内容。

## 上线边界

本次仅本地开发：没有添加部署工作流，没有修改 main 分支、DNS、VPS 或现有线上文件。页面带 noindex，文档未配置生产 sitemap。

正式替换前应确认文案、案例、备案展示、产品版本和公开素材，再确定子域名发布根目录与站间链接。当前 /me/、/projects/、/blog/ 作为同源预览路径；不能把此预览产物直接当作已完成的多子域名部署。

node_modules/、dist/、.astro/、preview.local/ 等为本机依赖或生成物，不提交版本控制。
