# 多语言静态网站构建

构建器只读取 MyObsidian 的 `网站/000-languages.md` 指定语言目录与已登记媒体，不修改笔记库。当前目录是 `网站/001-zh/`、`网站/002-en/`。公开内容、外壳文案和脚本文案以这些来源为准；模板保留现有页面结构，媒体清单保留逐次出现的公开或隐藏状态。

## 语言与来源配置

`网站/000-languages.md` 的 frontmatter 设置 `version: 1`、`primary`、`fallback`，以及按显示顺序排列的 `languages`。每项只包含 `root`、`enabled`、`commonSource` 和 `sources`；`sources` 将网站清单中稳定的内容 ID 映射到语言目录内的相对文件路径。

每种语言的 `000-texts.md` 是语言元数据和公共文案的唯一来源。其 `language` 包含 `code`、`label`、`htmlLang`、`searchLanguage`、`browserTags`；`languageLabels` 包含 `group` 和带 `{language}` 的 `switchAria`。浏览器匹配规则接受规范语言标签和末尾 `-*`，例如 `[en, en-*]`，不同语言之间不能重叠。无匹配时使用 `fallback`；明确语言网址保持其语言。公共槽 `shellSlots`、`scriptSlots`、`bodyUtilitySlots` 以及代码标签等已有文案必须完整翻译。

新增语言只需配置语言目录、真实译文、全部来源映射和公共槽，无需修改网站代码。只创建目录不足以发布：当前 101 个内容 ID 必须全部映射，译文的 `lang`、稳定 `translationKey`、`sourceHash`、`generatedBodyHash` 和 `translationStatus: translated` 必须通过门禁，正文的补充来源列表也须与冻结身份配对。主语言历史正文可以省略 `lang`，显式值必须正确；正文或补充稿标记 `draft: true` 时拒绝发布。测试中的第三语言仅存在于隔离夹具。

正文 frontmatter 的 `tags` 与可选 `searchTags` 是各语言标签的权威来源。公开 JSON、现有卡片和详情标签容器使用去重后的 `tags`，筛选使用该 JSON；搜索标签合并 `tags` 与 `searchTags` 并去重。空数组会清空旧标签，构建器不会修改或自动翻译标签。

## 运行

在网站仓库根目录执行：

```powershell
npm ci --prefix tools/content-import
node tools/site-build/build.mjs --vault "MyObsidian 的本机路径" --output "临时输出目录"
node tools/site-build/build.mjs --vault "MyObsidian 的本机路径" --output "临时输出目录" --check
node tools/site-build/validate-runtime.mjs --output "临时输出目录" --report "运行契约报告.json"
node --test tools/site-build/*.test.mjs
```

不指定 `--output` 时写入本仓库静态发布树。`--check` 不写入文件，产物存在差异时退出码为 1。来源、翻译身份、翻译状态、来源摘要、译文正文摘要、媒体摘要或路由门禁失败时，在写入前停止。生成后 `--check` 应报告差异 0。

`validate.mjs --output <目录> --report <文件>` 对照尚未改写的原发布树诊断中文正文和结构差异；四篇已批准的完整来源恢复单独标记，其余语义差异或不可达链接使检查失败。正式写回后原路由已成为跳转页，此对照应使用写回前保存的报告。运行契约检查可用于正式树，检查英文可见文案、语言映射、同页锚点、本地引用、脚本语法、作品分类顺序和代码框类名。

## 输出与边界

清单当前为 101 条内容，页面数为内容数乘以启用语言数，并生成分语言 Pagefind、RSS、sitemap、robots 和仅含公开元数据的 `site-languages.json`；旧路由与已登记别名转向相应页面并保留查询与锚点。根入口由语言控制脚本选择语言。共享原资源、原 CSS 与原 `_astro` 脚本不被改写，需与生成文件一起发布；历史 Pagefind 和文案脚本哈希文件保留以兼容缓存页面。

翻译缺失、过期或存在未经审核的人工修改时，先处理来源翻译，再运行构建；构建器不会自动覆盖或重译。增加内容或改变媒体公开状态需要更新经过审核的清单。`tools/content-import/import.mjs` 已委托此构建器，旧局部同步逻辑不再写入双语发布树。测试、提交和部署由调用者独立执行，构建本身不发布。
