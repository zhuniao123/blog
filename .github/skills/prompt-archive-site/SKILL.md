# Prompt Archive Site

## 目标

把“基于素材写的 blog 文章”与“可长期保存的 prompt 素材资产”拆开管理。

## 适用场景

当用户提出下面这类要求时启用：

1. 想保存样图，防止原帖失效。
2. 想把 prompt 做成独立集合站，而不只是 blog 文章。
3. 想独立部署到 Cloudflare Pages / R2。

## 执行规则

1. 一条 prompt 一份素材卡，优先写入 `src/data/prompts/`。
2. 同时保存 `sourceUrl`、`sampleImages`、`archivedImages`。
3. 如果样图能下载，优先归档到自有存储；不能下载时保留原帖链接并标记外链来源。
4. blog 文章负责“解释和拆解”，prompt archive 负责“检索和留存”。
5. 标题、标签、语言、使用场景要结构化，不能只放在正文里。

## 推荐目录

```text
src/data/prompts/
public/prompt-assets/
src/pages/prompts/
```

## 推荐部署

1. 开发期：直接用 Astro 静态输出。
2. 线上期：Cloudflare Pages 部署页面，Cloudflare R2 存图。
3. 若要全文搜索，可后续接 Pagefind 或 Cloudflare Workers。