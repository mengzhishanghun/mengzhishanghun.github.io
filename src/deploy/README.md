# VPS 静态站点更新入口

`mzsh-static-update.py` 是现有 VPS 自动更新脚本的受管源码，只使用 Python 3 标准库。VPS 既有 systemd 服务和每日定时器继续负责调用入口与 `flock` 互斥；本工具不创建服务、不修改 Caddy 或定时频率。

## 部署前只读检查

在已安装此脚本的 VPS 上运行：

```sh
sudo -n python3 /usr/local/libexec/mzsh-static-update.py --check
```

`--preflight` 与 `--check` 等价。新版捕获 `main` 源码提交 S 和 `production-static` 产物提交 P。P 的 `release-provenance.json` 必须以 `sourceCommit` 绑定 S，并绑定 S 中 `src/deploy/release-manifest.json` 的原字节 SHA-256。源码清单按路径排序，每项包含 `path`、`size`、`gitBlob`、`sha256`、`target`；P 的普通文件集合必须恰等于清单加来源元数据。未知字段、重复路径、非普通 blob、大小或摘要错配均拒绝。

元数据解码上限为 4 KiB，源码清单为 8 MiB；通过固定 commit 的 Git tree/blob 获取，校验 API SHA、整数大小、严格 ASCII base64（仅去除 CR/LF）、编码及解码容量和 Git blob 摘要，再解析 UTF-8 JSON，不跟随返回 URL，也不回退 raw 域名。公开 `site-languages.json` 仍受原 64,000 字节上限、85,336 字符 base64 上限及两倍原串长度上限约束。

仅当 S=P=`c0b7e4fbf4a30c0c8eb968256225ad4f99b25de8` 且 P 没有来源元数据时接受旧协议；其他同 SHA 或坏新协议不得降级。`.nojekyll` 通过 Git blob 核验，不从 Pages 下载或复制。其余清单文件核验 Pages 实际字节；两个精确历史路径 `design-preview/index.html`、`design-preview/docs/index.html` 为 `pages-only`，来源元数据和预览均不复制到 VPS 服务目录。检查完成及正式切指针前重读两个 refs，变化即停止。只读模式不写状态、不补充历史资产、不创建发布目录、不切换指针、不重载 Caddy。

正常更新仍由现有服务调用不带参数的入口。`--repair-current` 和 `--refresh-current` 保留既有历史资产修复行为，属于写入模式，不用于普通预检。三次失败的同一提交继续保持熔断，检查不会清零失败记录。

## 下载中断后继续

正式更新将已完整验证的 Pages 文件保存在状态文件旁的 `download-cache-v1/`，默认位置为 `/var/lib/mzsh-static-update/download-cache-v1/`。缓存目录权限为 `0700`，文件为 `0600`。键包含路径、大小、Git blob 和源码 SHA-256；每次重新核对源码与产物绑定后，只复用当前清单中身份完全相同、重新通过大小、摘要和内容检查的文件。跨发布提交也可复用未变化文件。活跃发布目录不作为缓存来源，旧 S0 协议没有源码 SHA-256 凭据，继续从 Pages 下载。

每轮最多六个下载在途，只补缺项，最多五轮；连续三轮没有新增成功文件就停止。仅超时、连接重置/中止、HTTP 408/429/500/502/503/504 可在下一轮补下。证书、重定向、永久 HTTP 错误、来源、容量或摘要校验失败立即停止。单次 Pages 请求不叠加内部重试，socket 超时上限保留 60 秒。程序启动时开始计算 15 分钟下载预算，调度、请求、退避和发布前检查预算；既有外层锁与服务超时不变。一次运行最终失败只计一次提交失败。

只有完整验证成功的文件才原子写入缓存。半文件不续传，损坏普通缓存重新下载；链接、异常类型、权限或未知缓存条目会阻止更新。清理仅限当前缓存内过期的合法键及可识别临时文件。缓存总量仍受清单 150 MB 与来源元数据 4 KiB 上限约束，预览和来源元数据可缓存，但不进入公开发布目录。

收到 TERM 后停止新增下载，清理本次 staging 与临时文件，保留已验证缓存；下次服务运行重新验证 refs 和缓存后补缺。切换指针一旦开始，仍完成原有健康检查及必要回滚。日志沿用 journal，记录轮数、缓存命中、成功和剩余数量，以及少量失败路径。`--check` / `--preflight` 始终从 Pages 验证全部候选文件，不创建、读取或清理下载缓存，也不写状态。

## 公开范围与容量

公开目录与 `src/analytics/inject.mjs` 保持一致：`_astro`、`assets`、`blog-search`、`blog`、`cases`、`contact`、`docs`、`en`、`licenses`、`media`、`support`、`works`、`zh`，再加同提交语言清单中的启用 code。根文件仅允许 `.nojekyll`、`favicon.svg`、`index.html`、`site-router.js`、`sitemap.xml`、`robots.txt`、`site-languages.json`；另精确允许 `about/index.html` 通用入口，未开放整个 `about/`，其源码与其他子文件仍拒绝。`content/`、`tools/`、`src/`、Obsidian 来源与版本控制/本机元数据不进入发布树。

启用语言数 `n` 必须在 1–32 之间。公开 HTML 上限为 `200 + 110*n`，公开文件上限为 `1000 + 500*n`，全部公开文件合计不超过 150 MB，单个文件不超过 50 MB。公开符号链接、可执行模式、越界路径、重复路径与未允许类型会被拒绝。语言清单中不得包含来源目录等私有字段。

固定七项历史提交仅在历史资产初始化/补齐函数显式启用历史模式时，允许缺少语言清单；其旧上限仍为 300 个 HTML、800 个文件。已有清单解析、下载或 Git blob 校验失败时不会降级到历史例外。

## 隔离测试

```sh
python3 -m unittest discover -s src/deploy/tests -v
```

Windows 开发时可使用项目隔离环境：

```powershell
conda run -n MZSHWebsiteDeploy python -m unittest discover -s src/deploy/tests -v
```

测试仅使用临时目录和受控 API/Pages 响应，不访问 GitHub 或 VPS。Windows 上仅目录符号链接的覆盖系统调用使用 POSIX 边界替身；真实 Linux 原子切换仍由部署前检查和既有服务执行环境保障。

## 本地发布树

先运行 `npm run build`，然后 `node src/deploy/release.mjs --create`，将源码及生成的清单一起提交。对固定源码提交重新构建并核验后，运行 `node src/deploy/release.mjs --source-commit <40位源码SHA>` 写入产物来源元数据。工具只操作本地文件，不提交、不推送、不更改 Pages。

维护者先在远端仍为 S0/S0 时将 Pages 来源切到 `production-static:/` 并验证原字节，再在既有维护锁内备份、安装新版更新器并通过 S0 只读检查。之后以普通快进提交一次 atomic push 两个分支。原子推送不可用或 refs 改变就停止，不拆成两次推送。

新产物的 Pages 字节通过后才调用既有发布服务。推送后保持新校验器和旧活跃目录；健康失败沿原原子指针回滚。恢复发布使用新的正常源码/产物提交，不把 Pages 改回源码 main，不恢复仅认同 SHA 的旧脚本，也不 reset 或 force push。
