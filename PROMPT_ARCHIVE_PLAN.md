# Prompt Archive Plan

目标：把“博客文章”与“Prompt 素材资产”拆开，让样图、原帖、提示词和标签形成可独立部署的 Prompt 集合站。

## 为什么要拆

当前 blog 适合发文章，不适合承担素材永久归档。

问题在于：

1. `x.com` / `pbs.twimg.com` 链接会失效或限流。
2. 文章 frontmatter 对素材字段不友好，不利于检索和聚合。
3. 你未来想独立部署到 Cloudflare，说明它本质上已经不是 blog 的“附属页面”，而是一个单独产品。

## 推荐架构

分三层：

1. 素材层：`src/data/prompts/*.md`
   - 一条 prompt 一份结构化记录。
   - 保存原始来源、prompt 正文、标签、原始样图、归档样图地址。
2. 存储层：Cloudflare R2 或本地 `public/prompt-assets/`
   - 初期可直接放仓库内。
   - 后期迁到 R2，域名走 Cloudflare CDN。
3. 展示层：独立 Astro 站或当前仓库新增 `/prompts` 路由
   - 可按模型、风格、语言、场景、发布时间筛选。

## 最小可行版本

第一阶段，不拆仓库，只拆内容模型：

1. 保留现有 blog 不动。
2. 新增 `prompts` collection，先把素材卡建起来。
3. 样图先落本地：`public/prompt-assets/YYYY/MM/slug/*.jpg`
4. 文章中样图引用自己的归档地址，而不是只引用外链。

这样做的好处是：

1. 今天就能补齐“防链接失效”能力。
2. 明天要单独部署时，直接把 `src/data/prompts` 和 `public/prompt-assets` 带走。
3. Cloudflare Pages 部署时基本不需要重写数据结构。

## Cloudflare 路线

推荐顺序：

1. Pages 部署静态站。
2. R2 存图片归档。
3. 自定义域名例如 `prompt.xxx.com`。
4. 后续如需在线搜索和收藏，再补 Workers / D1。

## 入库规则

1. 外部样图只要可下载，就尽量存一份自己的副本。
2. 每条素材同时保留：原链接、归档链接、抓取日期。
3. 没有成功归档的素材，也要保留原链接并标记 `external-only`。
4. blog 是解读层，prompt archive 是资产层，不能混用。

## 下一步建议

1. 先做一个抓图脚本：读取 `src/data/prompts`，下载 `sampleImages` 到本地目录。
2. 再做一个 `/prompts` 列表页，验证素材站信息架构是否顺手。
3. 最后再决定是否单独拆仓库并上 Cloudflare Pages + R2。