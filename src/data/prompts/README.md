---
title: "Prompt Archive README"
slug: prompt-archive-readme
lang: zh
sourceDate: 2026-04-24T00:00:00Z
sourcePlatform: x
sourceUrl: https://x.com
prompt: "README 占位，不参与真实归档。"
summary: "用于说明 prompt 素材归档格式。"
tags:
  - prompt
sampleImages: []
archivedImages: []
---

# Prompt 素材归档格式

这个目录不放文章，只放可复用的 prompt 素材卡。

建议一条素材一份文件，命名格式：

`YYYY-MM-DD-平台-主题.md`

推荐 frontmatter：

```yaml
title: "参考图扩世界观"
slug: "reference-worldbuilding"
lang: zh
sourceDate: 2026-04-24T00:00:00Z
sourcePlatform: x
sourceUrl: https://x.com/xxx/status/123
prompt: |
  以参考图 @image_1 的风格文明为起点...
summary: "从参考图扩展出统一世界观设定。"
tags:
  - gpt-image-2
  - worldbuilding
sampleImages:
  - https://pbs.twimg.com/media/example-1.jpg
archivedImages:
  - https://prompt-cdn.example.com/2026/04/example-1.jpg
storage:
  provider: r2
  path: prompts/2026/04/reference-worldbuilding/
```

字段约束：

1. `sampleImages` 保留原始来源，方便溯源。
2. `archivedImages` 存你自己的副本地址，优先放 Cloudflare R2 或本仓库 `public/prompt-assets/`。
3. `storage.path` 表示素材主目录，后续脚本抓图时直接落这里。
4. 文章可以引用这份素材卡，但不要反过来把大段文章正文塞进这里。

最小工作流：

1. 收件箱收到 prompt 素材。
2. 先生成一份素材卡到这个目录。
3. 把原图下载到 `public/prompt-assets/` 或 R2。
4. 再从素材卡派生 blog 文章、专题页或独立 prompt 站页面。