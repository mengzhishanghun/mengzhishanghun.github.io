# 网站内容同步入口

本站的双语静态构建已由 `../site-build/` 接管。`import.mjs` 保留旧命令入口，直接委托双语构建器，不再执行旧局部同步逻辑。

在本目录执行：

```powershell
npm ci
node import.mjs --vault "MyObsidian 的本机路径"
node import.mjs --vault "MyObsidian 的本机路径" --check
```

构建、临时输出、翻译门禁、媒体许可与验证方法见 [双语构建运行指南](../site-build/README.md)。依赖仍由本目录的锁文件管理。旧 `test:rejection`、`test:cases` 是旧局部同步器的历史验收脚本；当前构建验收使用 `node --test ../site-build/*.test.mjs`。
