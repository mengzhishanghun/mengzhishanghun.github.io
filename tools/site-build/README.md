# 仓库多语言静态构建

构建器只读取本仓库 `content/` 和已获准公开的共享资源，工作站与 VPS 使用同一份来源。Obsidian 是中文编辑入口，只有显式手动导入才读取笔记库；英文与后续语言在仓库中维护、翻译并审核，构建不会翻译或覆盖稿件。

## 运行

在网站仓库根目录执行：

```powershell
npm ci --prefix tools/content-import
node tools/site-build/build.mjs --output "临时输出目录"
node tools/site-build/validate-runtime.mjs --output "临时输出目录" --report "运行契约报告.json"
node tools/site-build/build.mjs
node tools/site-build/build.mjs --check
node --test tools/site-build/*.test.mjs tools/content-import/projection.test.mjs
node tools/content-import/test-cases.mjs
```

不指定 `--output` 时生成本仓库静态发布树；`--check` 只检查，差异非零时退出码为 1。构建不接受 `--vault`，该选项仅属于手动导入。构建本身不提交、推送或部署；VPS 部署入口见 `tools/deploy/`。

## 语言和翻译

`content/000-languages.md` 设置 `version: 1`、`primary`、`fallback` 与按显示顺序排列的 `languages`。每项包含 `root`、`enabled`、`commonSource`、`sources`；来源映射使用固定内容 ID 和语言目录内相对路径。当前 100 个实体各有两种语言，另有 10 个补充稿及各语言公共文案。

每个语言目录的 `000-texts.md` 是该语言元数据与公共文案的唯一来源。`language` 包含 `code`、`label`、`htmlLang`、`searchLanguage`、`browserTags`；`languageLabels` 包含 `group` 和带 `{language}` 的 `switchAria`。浏览器规则使用完整标签或末尾 `-*`，例如 `[en, en-*]`；不同语言不能重叠。新增语言需要全部真实译文、来源映射及公共槽，无需改网站代码，隔离测试的第三语言不进入正式内容。

页面源码直接在 `content/zh/000-页面/` 与 `content/en/000-pages/` 编辑；语言配置按固定内容 ID 映射到这些路径，目录整理不改变 slug 或发布网址。Obsidian 只保留中文作品、案例、博客和文档，手动导入使用本机忽略的 `tools/content-import/000-sync.local`，页面和公共文案不经过导入。

正文与补充稿的 `translationKey` 必须与清单身份一致。译文的 `sourceHash` 绑定对应公开中文快照，`generatedBodyHash` 与 `translationStatus: translated` 记录已审核正文；文本摘要统一 LF，媒体摘要始终按原始二进制字节计算。缺稿、过期、人工正文漂移、身份错误、草稿或越界会在任何发布树写入前拒绝。

各语言 `tags` 与可选 `searchTags` 是 JSON、现有标签容器、筛选与搜索的权威来源。标签去重；空数组清除旧标签；搜索合并两者，不自动翻译标签。

## 媒体与入口

公开正文图片使用稳定 occurrence 标识。每次出现的 `ordinal` 与 `state` 独立验证，只有公开记录携带获准 URL 和二进制摘要；隐藏记录只生成占位，不保留原路径、图片 alt、标题或附件。相同图片另一处已公开也不会改变隐藏 occurrence 的权限。原 CSS、原 `_astro` 和已登记媒体字节不被改写；历史文案脚本与 Pagefind 哈希产物保留以兼容缓存页面。

明确语言正文网址保持其语言。已登记的无语言入口按有效手选、浏览器规则、`fallback` 选择语言；历史明确语言文档入口保留该语言。入口只携带真实目标路由，保留查询参数，并按已验证章节映射转换锚点；未知锚点保留。没有 JavaScript 时保留可点击的默认语言链接，不猜测未登记路径。

对外分享使用已登记的无语言入口，例如 `/works/md-blog-packer/`，由访问者的语言规则选择版本。合并文章后可在 `manifest.redirects` 登记旧 `route` 和目标内容 `id`；可选 `anchorOverrides` 按目标语言保存旧章节 ID 到新章节 ID 的映射，目标必须唯一存在。显式语言旧地址仍保持其语言，通用旧地址继续自动选择语言。

`validate-runtime.mjs` 检查实际语言映射、锚点、公开引用、脚本语法、作品顺序和代码框。`validate.mjs` 是旧模板迁移诊断工具，正式旧路由已成为入口页，不再作为当前构建验收。
