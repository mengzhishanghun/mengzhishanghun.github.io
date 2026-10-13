# 梦之殇魂个人网站

`main` 保存按功能归组的 `src/` 和集中附件 `attachments/`。图片、视频和其他附件分别归档，构建仍输出原公开网址。

## 安装与构建

```powershell
npm ci
npm run build
npm run check
node src/build/validate-runtime.mjs --output dist/site --report runtime.local
```

默认静态输出为忽略的 `dist/site/`；点赞服务注册表单独输出到 `dist/services/engagement/articles.json`，不得放入公开发布树。来源、冻结资源和页面模板在写入前核验。语言配置为 `src/shared/languages.md`，公开语言清单仍使用 v1。

## 中文手动同步

仅在获得同步授权后执行：

```powershell
node src/import/import.mjs --vault "中文笔记库路径" --check
node src/import/import.mjs --vault "中文笔记库路径"
```

私有映射为 `src/import/000-sync.local`，受 `*.local` 忽略规则保护。外语审核指纹或中文公开快照漂移时停止，不自动覆盖用户稿件。页面与公共文案直接在对应功能的 `content/` 内维护，详细格式见 [导入指南](src/import/README.md)。

## 发布

```powershell
node src/deploy/release.mjs --create --output dist/site
# 先提交源码与 src/deploy/release-manifest.json，再绑定该源码提交：
node src/deploy/release.mjs --output dist/site --source-commit <源码提交的40位SHA>
```

`production-static` 只承载完整静态树和 `release-provenance.json`。发布操作由维护者按 [发布指南](src/deploy/README.md) 完成；构建与清单工具不会推送或更改 Pages。两个历史设计预览保留原 Pages 地址，VPS 不公开它们。
