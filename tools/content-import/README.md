# 中文手动同步

Obsidian 仅作为中文编辑入口，仓库 `content/` 保存公开中文快照和已审核译文。此入口只在用户授权手动同步时读取 `--vault`，不执行 Git 或部署，不再使用旧私有清单或委托构建器。

```powershell
npm ci --prefix tools/content-import
node tools/content-import/import.mjs --vault "中文笔记库路径" --check
node tools/content-import/import.mjs --vault "中文笔记库路径"
node tools/site-build/build.mjs --output "临时输出目录"
```

笔记库中的 `网站/000-sync.md` 是私有同步配置，保存中文原稿映射、逐次媒体授权、公开快照指纹及完整外语审核指纹。这些信息不复制到仓库。导入只投影前台必需字段，隐藏图片改为稳定标识，不复制隐藏附件或私人图片描述；共享公开媒体继续使用仓库已有文件。

导入先验证所有外语文件的完整规范化文本指纹，再验证中文目标文件指纹和全部来源权限，任何人工漂移都在写入前停止。中文编辑后需要手动导入、翻译更新、审核并更新私有配置中的外语指纹，随后构建和提交；不通过重算指纹掩盖未审核的修改。外语正文和公共文案直接在仓库维护，新增语言也仅配置仓库。

公开译文 `sourceHash` 对应公开中文快照，不使用 Obsidian 原始文件摘要。文本摘要统一 LF，保留代码内容与 Unicode；图片摘要使用二进制字节。`--check` 不修改文件，存在待同步差异时退出码为 1。

当前拒绝门禁运行 `node tools/content-import/test-rejection.mjs`；案例验收运行 `node tools/content-import/test-cases.mjs`。构建和语言配置见 [构建指南](../site-build/README.md)。
