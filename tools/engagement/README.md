# 文章点赞服务

独立的 Node 标准库服务，运行环境需要支持 `node:sqlite` 和 `backup()`（已验证 Node 26）。与 Umami、PostgreSQL、Uptime Kuma 分开，使用专属 SQLite 目录。业务表仅 `article_counts(article_id,count)`，不保存访客、IP、Cookie 或匿名标识。全局请求、写入和并发限制降低误操作与资源占用，不能保证防刷。

## API

- `GET /api/engagement/articles/{encodeURIComponent(articleId)}`：`200 {"count":0}`。
- `POST /api/engagement/articles/{encodeURIComponent(articleId)}/like`：精确允许配置的 Origin，`Content-Type: application/json`，正文仅 `{}`（最多 256 字节）；原子递增返回 `200 {"count":1}`。
- 非活动 ID 返回 404；写入前明确拒绝返回相应 4xx 和 `{"error":"...","write":"rejected"}`。5xx、网络错误、超时或无法解析响应可能已写入，禁止自动重试。
- 所有响应 `Cache-Control: no-store`，不设置 Cookie，不启用跨站 CORS。

## 身份及构建

`tools/site-build/manifest.json` 的 `entries[].id` 是永久身份；`article-identities.json` 登记每个 ID 与既有 `translationKey` 的关联。标题、slug、URL、语言及展示分类变动时保留原 ID，不能以新 ID 代替原文章。作品介绍与文档可以共用既有 translationKey，仍是独立 ID 和计数。新增文章显式追加登记；删文时永久登记不删除、不复用，活动 registry 会停止允许该 ID。

执行 `node tools/site-build/build.mjs` 生成仅含公开 ID 的 `tools/engagement/articles.json`，部署服务时同步它。正文四类输出互动区，中英共享 ID；分享地址由语言路由去语言段形成，文档的无语言入口必须登记在 manifest redirects，旧文档地址保留。通用分享地址无查询参数或锚点，分享标题取英文。备用 GitHub 域名只分享，不访问 API。

## 启动与备份

本机配置放在源码之外，目录 700、JSON 文件 600，配置包含绝对 `appDir`、`db`、`registry`、`backupDir`，以及 `host`、`port`、精确 HTTPS `origin`。可选 `rateLimit`（每分钟写入默认 120）、`requestLimit`（每分钟请求默认 600）、`concurrency`（默认 16）。不得将生产数据库或本机配置纳入 Git。

`node tools/engagement/service.mjs /absolute/config.json` 启动。公网由 VPS 同源 HTTPS 代理回源到专属内网端口，代理不得重放 POST，应剥离 Cookie、Authorization 与访客地址头，不记录该 API 的访客访问日志。

正式部署在 VPS：`linux/install.sh` 安装独立账户 `mzsh-engagement` 的 systemd 服务，原生 Node `26.11.0`，监听 `127.0.0.1:3010`。运行目录 `/srv/mzsh-engagement` 不进 Git；应用/registry 在 `app/`，mode 600 配置在 `config/service.json`，SQLite 在 `data/`，备份在 `backups/`。Node 官方 Linux x64 包 SHA-256 为 `db6342d36ebdb3cbd72103d0ce5ccc528620f6c9df72a11f4ccb384bf1bef678`。安装入口需要 root、已创建专属账户，以及已校验并安装到 `/opt/mzsh-node/node-v26.11.0-linux-x64/` 的 Node。日志仅服务状态，使用 systemd journal。

`linux/backup.mjs` 使用 SQLite online backup，不复制运行中的 WAL/SHM。新时间戳备份经过 `quick_check`，再以独立只读数据库打开做 `integrity_check` 和计数摘要，不覆盖、不自动删除。`mzsh-engagement-backup.timer` 每日新加坡时间 03:40 执行；手动入口 `sudo systemctl start mzsh-engagement-backup`，用 `sudo journalctl -u mzsh-engagement-backup --no-pager -n 10` 检查结果。恢复先停服务，将备份复制到隔离目录，启动隔离端口验证 ID、计数及完整性后决定切换；不能覆盖运行中的数据库。更新 registry 时同步构建产物并重启，保留历史计数。

定向检查：`node --test tools/engagement/service.test.mjs tools/site-build/engagement.test.mjs tools/site-build/build.test.mjs`；`node tools/site-build/build.mjs --check`。浏览器存储失败不发赞，发送前持久化 pending，结果未知保留 pending，刷新也不重发；这里只提示本机已点赞，不承诺跨设备去重。
