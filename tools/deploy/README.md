# VPS 静态站点更新入口

`mzsh-static-update.py` 是现有 VPS 自动更新脚本的受管源码，只使用 Python 3 标准库。VPS 既有 systemd 服务和每日定时器继续负责调用入口与 `flock` 互斥；本工具不创建服务、不修改 Caddy 或定时频率。

## 部署前只读检查

在已安装此脚本的 VPS 上运行：

```sh
sudo -n python3 /usr/local/libexec/mzsh-static-update.py --check
```

`--preflight` 与 `--check` 等价。检查要求 `main` 与 `production-static` 指向同一提交，读取该提交的 Git tree，并仅通过该 tree 指定 SHA 的 Git Blob API 取得 `site-languages.json`；校验 API SHA、整数大小、严格 ASCII base64（仅去除 CR/LF）、解码容量与 Git blob 摘要，再解析 UTF-8 JSON 和公开 schema，不跟随返回 URL，也不回退到 raw 域名。解码上限为 64,000 字节，对应 base64 长度上限 85,336 字符，含换行的原字符串另受两倍该长度限制。随后检查公开白名单及 GitHub Pages 上每个发布文件的字节；`.nojekyll` 仅参与清单校验，不下载或复制到发布目录。只读模式不写状态、不补充历史资产、不创建发布目录、不切换指针、不重载 Caddy。

正常更新仍由现有服务调用不带参数的入口。`--repair-current` 和 `--refresh-current` 保留既有历史资产修复行为，属于写入模式，不用于普通预检。三次失败的同一提交继续保持熔断，检查不会清零失败记录。

## 公开范围与容量

公开目录与 `tools/analytics/inject.mjs` 保持一致：`_astro`、`assets`、`blog-search`、`blog`、`cases`、`contact`、`docs`、`en`、`licenses`、`media`、`support`、`works`、`zh`，再加同提交语言清单中的启用 code。根文件仅允许 `.nojekyll`、`favicon.svg`、`index.html`、`site-router.js`、`sitemap.xml`、`robots.txt`、`site-languages.json`。`content/`、`tools/`、`src/`、Obsidian 来源与版本控制/本机元数据不进入发布树。

启用语言数 `n` 必须在 1–32 之间。公开 HTML 上限为 `200 + 110*n`，公开文件上限为 `1000 + 500*n`，全部公开文件合计不超过 150 MB，单个文件不超过 50 MB。公开符号链接、可执行模式、越界路径、重复路径与未允许类型会被拒绝。语言清单中不得包含来源目录等私有字段。

固定七项历史提交仅在历史资产初始化/补齐函数显式启用历史模式时，允许缺少语言清单；其旧上限仍为 300 个 HTML、800 个文件。已有清单解析、下载或 Git blob 校验失败时不会降级到历史例外。

## 隔离测试

```sh
python3 -m unittest discover -s tools/deploy/tests -v
```

Windows 开发时可使用项目隔离环境：

```powershell
conda run -n MZSHWebsiteDeploy python -m unittest discover -s tools/deploy/tests -v
```

测试仅使用临时目录和受控 API/Pages 响应，不访问 GitHub 或 VPS。Windows 上仅目录符号链接的覆盖系统调用使用 POSIX 边界替身；真实 Linux 原子切换仍由部署前检查和既有服务执行环境保障。
