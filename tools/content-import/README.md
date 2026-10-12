# 中文手动同步

Obsidian 仅保存中文作品、案例、笔记和文档，四个分类直接位于 `网站/` 下。仓库 `content/` 保存公开中文快照和已审核译文，页面及公共文案直接在仓库维护。此入口只在用户授权手动同步时读取 `--vault`，不执行 Git 或部署。

```powershell
npm ci --prefix tools/content-import
node tools/content-import/import.mjs --vault "中文笔记库路径" --check
node tools/content-import/import.mjs --vault "中文笔记库路径"
node tools/site-build/build.mjs --output "临时输出目录"
```

默认私有同步配置为项目本机文件 `tools/content-import/000-sync.local`，也可通过 `--sync "配置文件路径"` 显式指定；配置缺失时拒绝，不回退读取 Obsidian。该文件受现有 `*.local` 忽略规则保护，禁止提交。配置保存 104 项中文原稿映射及对应完整外语审核指纹、逐次媒体授权与公开快照指纹，只在本机使用，不随仓库分发。

页面位于 `content/zh/000-页面/` 和 `content/en/000-pages/`，各语言公共文案为 `content/{语言}/000-texts.md`。页面与公共文案不属于笔记库导入范围，旧 `page`、`common` 记录会在写入前拒绝。导入只投影前台必需字段，隐藏图片改为稳定标识，不复制隐藏附件或私人图片描述；共享公开媒体继续使用仓库已有文件。

导入先验证所有外语文件的完整规范化文本指纹，再验证中文目标文件指纹和全部来源权限，任何人工漂移都在写入前停止。中文编辑后需要手动导入、翻译更新、审核并更新私有配置中的外语指纹，随后构建和提交；不通过重算指纹掩盖未审核的修改。外语正文和公共文案直接在仓库维护，新增语言也仅配置仓库。

笔记中的普通 Markdown 内联链接和引用定义可使用库根或笔记相对路径。导入时，仅将私有同步配置已登记的正文目标映射到对应中文公开路由，保留链接文本、标题和查询参数；映射只存在本次导入的内存中。目标歧义、越界、未登记本地文件或私人附件会在任何写入前拒绝。补充稿没有独立路由，新本地目标的章节锚点尚未审核，也会拒绝；已有公开路由及页内锚点保留当前行为。

需要公开引用本地许可证时，在该来源记录的 `attachments` 中精确登记库根相对 `source`、原字节 `sha256` 与 `websiteUrl`。目标必须是对应公开实体已有 `relativeLinkTargets` 中固定版本的 HTTPS 地址，附件只在笔记库保留，导入验证原字节后投影链接，不复制为网站文件。构建器继续只读取仓库，不读取笔记库或本机同步配置。

公开译文 `sourceHash` 对应公开中文快照，不使用 Obsidian 原始文件摘要。文本摘要统一 LF，保留代码内容与 Unicode；图片摘要使用二进制字节。`--check` 不修改文件，存在待同步差异时退出码为 1。

当前拒绝门禁运行 `node tools/content-import/test-rejection.mjs`；案例验收运行 `node tools/content-import/test-cases.mjs`。构建和语言配置见 [构建指南](../site-build/README.md)。
