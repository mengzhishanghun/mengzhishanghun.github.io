# Umami 运维指引

正式服务已迁到 VPS 独立普通账户 `mzsh-umami`，由 systemd 管理 rootless Podman。Caddy 将 `stats.mzsh.me` 回源到 `127.0.0.1:3000`；PostgreSQL 仅监听 `127.0.0.1:5432`。主站和 GitHub Pages 使用原 website ID，历史用户、事件、会话、设置及迁移记录保留。

## 版本与安装

- Umami `3.4.0` 官方 Linux amd64 OCI：`ghcr.io/umami-software/umami@sha256:6cd9d24a836fac5c226c3c90cb25141d4560b7270b7827f393ccf09bf3f83b18`；内置 Node `22.23.2`。
- PG `17.11-bookworm` amd64：`docker.io/library/postgres@sha256:66aafa11cf15800a3c94763f7e11d1e7b2e37e5e84bc4ce027cb6e1e4bfaf4df`。
- Ubuntu 24.04 仓库 Podman `4.9.3`；不现场构建。

`linux/install.sh` 是首次安装入口，需要 root、已创建专属账户、不重叠的 subuid/subgid、linger、上述镜像及私有配置。它先启动 PG；恢复、全表比较和认证读取通过后再启动 Umami。维护已有服务时不能重跑首次安装入口覆盖版本指针。

运行目录 `/srv/mzsh-umami` 不进 Git。`config/umami.env` 保留原 `DATABASE_URL`、`APP_SECRET`、`TWO_FACTOR_ENCRYPTION_KEY` 并设置 loopback host/port；`config/postgres.env` 为对应数据库凭据。Podman env-file 使用无引号 `KEY=value`，不能直接复制带 Shell 引号的配置。管理员凭据保留为 mode 600 文件，维护脚本内部读取，不输出凭据或 token。配置父目录由 root 控制，文件仅服务账户可读；root 执行的维护脚本及其父目录由 root 所有。日志使用 systemd journal。

## 检查与备份

```sh
sudo systemctl status mzsh-postgres mzsh-umami --no-pager
sudo systemctl start mzsh-umami-backup
sudo journalctl -u mzsh-umami-backup --no-pager -n 10
```

`mzsh-umami-backup.timer` 每日新加坡时间 03:30 在线 `pg_dump -Fc`，在独立数据库完整 restore，保留全表计数/哈希、schema、dump list。输出在 `backups/`，不覆盖、不自动删除。迁移比较统一 UTC/ISO，将每表 JSON 行按 C 排序后 SHA-256；不同机器默认时区不能直接作为 timestamp 文本比较依据。

恢复先备份现库，在隔离库核对全部表及原管理员认证/统计读取。正式切换暂停入口和管理写入、排空应用，再做最终 dump/restore 并比较静默快照。切换后若有新增数据，回退必须迁回，不能直接切旧 Mac 或恢复旧快照。Caddy 先备份并 validate，保留 SVN 独立日志及请求/头过滤。

## 兼容更新

每日新加坡时间 04:30 检查 GitHub 正式 `3.4.x`；仅周日同一窗口允许补丁安装。`linux/update.sh` 固定候选 Linux amd64 digest；schema、migration、Node、依赖或数据库检查脚本元数据变化即暂停，交专家审核。`linux/maintenance.sh` 必须完整备份、隔离恢复、全表比较、HTTP 和原管理员认证/统计读取成功才切镜像，生产数据库不会被候选快照覆盖。启动失败和信号均走旧镜像恢复；持久状态在 root 控制的 `/var/lib/mzsh-umami-maintenance/state`，候选测试失败、回滚、未完成切换、恢复失败或兼容性待审均阻止后续自动安装，仅继续只读发布检查，管理员核验后才解除状态。维护锁在 root 控制的 `/run/lock/mzsh-umami/`，服务账户只读文件描述符加锁。

出网配置 `config/network.env` 必须 mode 600。`UPDATE_NETWORK_MODE=proxy` 需显式 `http_proxy`/`https_proxy`；`direct` 只在用户明确授权 VPS 访问官方来源后设置。本次已获 direct 授权，临时 Windows SSH 代理不作为长期依赖；EasyTier RPC/WS 不是 HTTP 代理。检查失败、兼容性变化或候选验收失败均保留旧版，不能报告为更新成功。备份与候选目录保留供排障。

## Mac 退役

原 PG、配置、备份仍保留。迁移持有 `~/Library/Caches/UmamiMaintenance.lock`，原 `update-request` 已有 `update-ack`，应用暂停，持久标记在重启后仍阻止旧应用启动。管理员脚本先 disable/bootout `com.user.umami`、`com.user.umami-postgres`、`com.user.umami-update`，核对全部停止后，仅把已知树内 `current` 符号链接原子改名 `retired-current`，保留全部目标目录；这样旧安装不再阻断 Brew 活动服务检查。最后只清理 token、reason 和 owner 核验一致的本次迁移锁/请求；不能提前解除暂停而恢复双写。旧库是冷备，恢复使用已验证的 VPS dump，不宣称旧 Mac 可随时在线回退。Mac 服务管理源仍在受管 `UserSkills/mac/Scripts/`，本次不修改技能正文。
