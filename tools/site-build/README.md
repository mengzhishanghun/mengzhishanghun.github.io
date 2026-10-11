# 双语静态网站构建

构建器只读取 MyObsidian 中清单指定的 `网站/zh/`、`网站/en/` 与已登记媒体，不修改笔记库。公开内容、外壳文案和脚本文案以这些来源为准；模板保留现有页面结构，媒体清单保留逐次出现的公开或隐藏状态。

## 运行

在网站仓库根目录执行：

```powershell
npm ci --prefix tools/content-import
node tools/site-build/build.mjs --vault "MyObsidian 的本机路径" --output "临时输出目录"
node tools/site-build/build.mjs --vault "MyObsidian 的本机路径" --output "临时输出目录" --check
node tools/site-build/validate-runtime.mjs --output "临时输出目录" --report "运行契约报告.json"
node --test tools/site-build/*.test.mjs
```

不指定 `--output` 时写入本仓库静态发布树。`--check` 不写入文件，产物存在差异时退出码为 1。来源、翻译身份、翻译状态、来源摘要、英文正文摘要、媒体摘要或路由门禁失败时，在写入前停止。运行两次后 `--check` 应报告差异 0。

`validate.mjs --output <目录> --report <文件>` 对照尚未改写的原发布树诊断中文正文和结构差异；四篇已批准的完整来源恢复单独标记，其余语义差异或不可达链接使检查失败。正式写回后原路由已成为跳转页，此对照应使用写回前保存的报告。运行契约检查可用于正式树，检查英文可见文案、语言映射、同页锚点、本地引用、脚本语法、作品分类顺序和代码框类名。

## 输出与边界

清单固定为 101 条内容，生成 202 个语言页面，分语言 Pagefind、RSS、sitemap 和 robots；旧路由与已登记别名转向相应页面并保留查询与锚点。根入口由语言控制脚本选择语言。共享原资源、原 CSS 与原 `_astro` 脚本不被改写，需与生成文件一起发布。

翻译缺失、过期或存在未经审核的人工修改时，先处理来源翻译，再运行构建；构建器不会自动覆盖或重译。增加内容或改变媒体公开状态需要更新经过审核的清单。`tools/content-import/import.mjs` 已委托此构建器，旧局部同步逻辑不再写入双语发布树。测试、提交和部署由调用者独立执行，构建本身不发布。
