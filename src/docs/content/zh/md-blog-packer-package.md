---
title: 打包 Markdown 和图片
type: doc
slug: md-blog-packer-package
draft: false
sitePublish: true
tags:
  - Markdown
  - 图片
workIds:
  - md-blog-packer
docPage:
  work: md-blog-packer
  group: features
  slug: package
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/md-blog-packer/docs/package/
lang: zh
translationKey: doc:md-blog-packer:package
---

## 转换范围

MDBlogPacker 将 `![](</path>)` 或 Obsidian `![[image.png]]` 引用的本地图片转为 `data:image/...;base64,...`。网络图片和已内嵌的 Base64 图片默认保留原样。结果可以复制、写入文件，也可以通过管道交给其他命令。

## 图形界面

1. 检查输入文章。打开界面时，工具会自动选中 EXE 所在目录的第一个 `.md` 文件。
2. 如需附加版权声明或转载提示，填写前文与后文；工具会缓存这些内容。
3. 点击 **转换并复制到剪贴板**，将结果粘贴到支持 Base64 图片的发布平台。

![MDBlogPacker 文件选择与前后文设置](/media-occurrence/doc%3Amd-blog-packer%3Apackage%3Amedia%3A1)

选择要处理的 Markdown 文件，按需填写前文和后文。图中仍为“就绪”状态，尚未执行转换。

## 命令行

向程序传入参数即可使用命令行。把示例中的 `博客.md` 换成要转换的文章路径；用 `-c` 把结果复制到剪贴板，或用 `-o` 写入文件：

```bash
# 最常用：转换 + 复制到剪贴板
conda run -n MDBlogPacker python Main.py 博客.md -c

# 带版权前后缀
conda run -n MDBlogPacker python Main.py 博客.md -c -p 前缀.md -s 后缀.md

# 输出到文件（不走剪贴板）
conda run -n MDBlogPacker python Main.py 博客.md -o 博客-内嵌版.md

# 查看详细转换日志
conda run -n MDBlogPacker python Main.py 博客.md -c -v
```

## CLI 参数

| 参数 | 说明 |
|---|---|
| `input` | 输入 Markdown 文件路径（必填） |
| `-c / --clipboard` | 复制到剪贴板（主要用法） |
| `-o / --output` | 输出到文件 |
| `-p / --prefix` | 前缀模板文件，拼到正文开头 |
| `-s / --suffix` | 后缀模板文件，拼到正文结尾 |
| `--no-wiki-links` | 不转换 Obsidian `![[]]` Wiki 链接 |
| `--no-skip-base64` | 不跳过已是 Base64 的图片 |
| `-v / --verbose` | 详细日志（列出每张图的处理状态） |

不指定 `-c` 和 `-o` 时默认输出到标准输出，可用管道。

## 图片路径解析规则

按顺序尝试：

1. 绝对路径
2. 相对源 MD 文件所在目录
3. Obsidian vault 根相对路径（如 `/附件/xxx.png`，自动向上查找 `.obsidian/` 目录定位 vault 根）

支持 URL 编码字符（`%20` 等）自动解码。

## 支持的图片格式

PNG、JPG、JPEG、GIF、WebP、SVG、BMP

## 发布前检查

- Base64 会让文件体积增加约 33%，图太多或太大时慎用
- 网络图片（`http://` / `https://`）会保持原状不转换
- 建议只在“导出发布”时用，日常写作仍保留独立图片文件便于维护
