# 中文手动同步

Obsidian 保存中文作品、案例、博客、文档和转载原稿。普通内容的四个分类直接位于 `网站/` 下，转载原稿位于 `网站/003-博客/006-转载/`。仓库各功能的 `src/*/content/` 保存公开中文快照和已审核译文，页面及公共文案直接在仓库维护。此入口只在用户授权手动同步时读取 `--vault`，不执行 Git 或部署。

作品和案例使用 `status: 开发中` 标记开发状态；已有的 `workInfo.stage: developing` 也会生效。同步后，构建会排除这些内容，Obsidian 原稿仍保留。关联教程可以独立发布。项目可以公开时，更新中文原稿中的开发状态，并同步、审核译文后重新构建；如果两个标记同时存在，需要一并更新。

```powershell
npm ci
node src/import/import.mjs --vault "中文笔记库路径" --check
node src/import/import.mjs --vault "中文笔记库路径"
node src/build/build.mjs --output "临时输出目录"
```

默认私有同步配置为项目本机文件 `src/import/000-sync.local`，也可通过 `--sync "配置文件路径"` 显式指定；配置缺失时拒绝，不回退读取 Obsidian。该文件受现有 `*.local` 忽略规则保护，禁止提交。配置保存 中文原稿映射及对应完整外语审核指纹、逐次媒体授权与公开快照指纹，只在本机使用，不随仓库分发。

页面位于各功能的 `src/<功能>/content/{zh,en}/`，各语言公共文案为 `src/shared/i18n/{语言}/000-texts.md`。页面与公共文案不属于笔记库导入范围，旧 `page`、`common` 记录会在写入前拒绝。导入只投影前台必需字段，隐藏图片改为稳定标识，不复制隐藏附件或私人图片描述；共享公开媒体继续使用仓库已有文件。

导入先验证所有外语文件的完整规范化文本指纹，再验证中文目标文件指纹和全部来源权限，任何人工漂移都在写入前停止。中文编辑后需要手动导入、翻译更新、审核并更新私有配置中的外语指纹，随后构建和提交；不通过重算指纹掩盖未审核的修改。外语正文和公共文案直接在仓库维护，新增语言也仅配置仓库。

笔记中的普通 Markdown 内联链接和引用定义可使用库根或笔记相对路径。导入时，仅将私有同步配置已登记的正文目标映射到对应中文公开路由，保留链接文本、标题和查询参数；映射只存在本次导入的内存中。目标歧义、越界、未登记本地文件或私人附件会在任何写入前拒绝。补充稿没有独立路由，新本地目标的章节锚点尚未审核，也会拒绝；已有公开路由及页内锚点保留当前行为。

需要公开引用本地许可证时，在该来源记录的 `attachments` 中精确登记库根相对 `source`、原字节 `sha256` 与 `websiteUrl`。目标必须是对应公开实体已有 `relativeLinkTargets` 中固定版本的 HTTPS 地址，附件只在笔记库保留，导入验证原字节后投影链接，不复制为网站文件。构建器继续只读取仓库，不读取笔记库或本机同步配置。

公开译文 `sourceHash` 对应公开中文快照，不使用 Obsidian 原始文件摘要。普通公开中文快照的文本摘要统一 LF，保留代码内容与 Unicode；转载原稿、转载公开快照和图片使用原字节摘要。`--check` 不修改文件，存在待同步差异时退出码为 1。

仅更新二级分类名称、顺序和归属时，使用以下命令：

```powershell
node src/import/import.mjs --vault "中文笔记库路径" --taxonomy-only
node src/import/import.mjs --vault "中文笔记库路径" --taxonomy-only --check
```

此模式生成公开的 `src/build/taxonomy.json`，核对来源身份、目录归属、公开中文与外语快照指纹；不导入正文或媒体，也不更新私有同步配置中的指纹。分类名称和顺序来自四个分区下的数字目录，英文名称由公共文案 `scriptSlots` 中的 `category:<中文名称>` 提供。构建时保留旧分类查询的原实体集合，包括旧空类；历史独立博客通过 `legacyOnly` 显式登记。文档补充稿关联原主文档，不新增文档页面，也不改变章节顺序。

当前拒绝门禁运行 `node src/import/test-rejection.mjs`；案例验收运行 `node src/import/test-cases.mjs`。构建和语言配置见 [构建指南](../build/README.md)。

## 作品与案例媒体

作品、案例的 `cover`、`video`、`videoPoster` 使用附件路径字符串，`gallery` 使用按展示顺序排列的路径列表。视频及视频封面可为空字符串，图库可为空列表。路径支持库根（可加前导 `/`）和笔记相对路径，包括仍在库内的上级目录；路径歧义、符号链接、越界和未审批字节都会拒绝。只读取这些字段明确选中的文件，不扫描附件目录。

```yaml
cover: /附件/项目/封面.png
video: /附件/项目/演示.mp4
videoPoster: /附件/项目/视频封面.png
gallery:
  - /附件/项目/截图一.png
  - /附件/项目/截图二.jpg
```

先显式审批选中的当前字节，再运行导入：

```powershell
node src/import/import.mjs --vault "中文笔记库路径" --approve-media --only work:example,case:example
node src/import/import.mjs --vault "中文笔记库路径" --only work:example,case:example --check
node src/import/import.mjs --vault "中文笔记库路径" --only work:example,case:example
```

`--only` 使用完整记录 ID，未知 ID 会拒绝；所有外语指纹仍须通过审核。媒体审批必须同时指定 `--only`，只更新本机配置，不写入公开文件。日常导入不会刷新媒体授权。`--check` 同时检查公开文件、媒体资源和本机配置差异，始终不写入。

本机 `record.projectMedia` 保存用途、序号、原字段值、库内精确路径、SHA-256、公开 URL、审批时公开字节摘要和图片尺寸；复用旧图库时还保存精确 `reuseItem`。公开资源、授权和图库 JSON 不包含库内路径。支持 PNG、JPEG、WebP 图片及 MP4、WebM 视频，核对文件签名；视频最多一个，必须单独选择图片封面。单文件不超过 50 MB，发布总量不超过 150 MB。

显式声明 `video` 或 `gallery` 后，图库按视频、图库图片的顺序生成；空声明恢复首屏封面。未声明这两个字段时保留原图库。初始化已有 Fab 图片或公开正文图片时，先把对应原字节放入笔记库并按顺序列入 `gallery`；审批复用原公开 URL 与原有 `sourcePage`、occurrence 或 grant 依据，不复制第二套站点资源。未再选择的旧图库项会退出展示。

封面保持已登记的公开 URL；首次登记从现有模板首屏图片和资源清单核对，不按 slug 猜测。更换封面时须重新审批，导入同步资源摘要与 manifest 的封面摘要。公开类型与所选附件不一致时拒绝，交由人工处理。所有验证在公开写入前完成；写入失败会尝试恢复本次已改文件，私有配置最后写入。这不是跨文件原子事务。

本轮仅修改导入及发布门禁源码，不部署。服务器上的更新器仍需在另一次获准部署中更新后，才可接收新增的视频类型。

## 转载原稿

转载使用私有配置中的独立 `reprints` 数组，不加入普通 `records`、翻译映射或分类实体。未配置时视为空数组。默认导入两组记录；`--only` 可选择普通内容、转载或混合记录，仍使用同一次写入及失败回滚流程。`--taxonomy-only` 不导入转载正文或更新转载指纹；为排除隐藏分类，会核验博客目录内已登记转载的身份元数据，不读取博客根目录外的转载来源。

```powershell
node src/import/import.mjs --vault "中文笔记库路径" --only reprint:eian-claude-codex-seedance,reprint:claude-max-account-guide --check
node src/import/import.mjs --vault "中文笔记库路径" --only reprint:eian-claude-codex-seedance,reprint:claude-max-account-guide
```

每条私有转载记录保存 `id`（`reprint:<slug>`）、原稿的库根相对 `source`、`sourceFingerprint`、`publishedFingerprint`，以及 `images`。每张图片的授权包含库根相对 `source`、公开转载清单已有的 `originalPath` 和原图 `sha256`。这些路径和授权只保留在本机配置中。

原稿必须声明与已有公开转载一致的 `slug`、`websiteRoute`、`sitePublish: true` 和 `visibility: unlisted`。`draft: true` 的转载原稿会在任何文件写入前拒绝，即使已设置 `sitePublish: true`。公开快照的 frontmatter 只投影 `title`、`author`、`source`，内部属性及注释不会发布。frontmatter 按字段语义投影，不保证保留所有 YAML 排版。正文不重新序列化，仅按 Markdown 图片节点的精确位置替换图片 URL，保留 alt、title、链接包装、空白和代码。

转载同步先校验现有公开原文和图片的 SHA-256，再校验私有快照指纹、原稿身份和每张图片的授权。笔记库图片、私有授权、公开清单和现有公开图片必须逐张对应、字节一致；新增、替换、缺失、重复、越界或符号链接图片都会拒绝。本入口不审批或复制转载图片，`--approve-media` 选中转载时会拒绝。

转载保留无属性的 `<strong>` 标签，其他原始 HTML 拒绝；普通内容仍拒绝原始 HTML。HTTP/HTTPS 链接、邮件、电话链接及页内锚点可保留，其他本地链接和引用式图片不支持。代码块里的图片示例不作为媒体引用。分类扫描只排除已登记且核验为 `unlisted` 的博客内转载原稿及其直接分类目录，不跳过目录扫描或编号校验。该目录存在未登记稿件、与普通 `records` 混用、来源重复，或对应分类曾在上一份快照中公开时，分类导入会拒绝。转载仍使用既有的中文独立 URL，不进入公开列表、搜索、RSS 或 sitemap，也不生成转载目录页。
