---
name: inbox-prompt-image-blog
description: 将 inbox 中的提示词与图片素材整理为博客文章 + Prompt 资产卡（src/data/prompts/*.md）的一套固定格式工作流 Skill。
metadata:
  owner: EdgeObserver
  scope: blog-content
---

# Inbox Prompt to Blog Skill

## 适用场景

当用户希望把 `src/data/inbox/*.md` 的素材（提示词 + 图片链接 + 来源）转成可发布博文，并同步生成 `src/data/prompts/*.md` 素材卡时，启用本 Skill。

典型触发语：
- 清空收件箱
- 把收件箱素材写成博客
- 按中文/英文素材分别出文
- 做提示词展示文并附效果图

## 强制规则

1. 一条素材一篇文。
2. 优先帮助读者理解和记忆，不追求攻击性表达。
3. 每篇必须包含：
   - 素材来源链接
   - 可复制提示词（原文或结构化提炼）
   - 图片样例链接
   - 场景建议与踩坑提醒
4. 若素材不足以独立成文，先标注“信息不足”并请求补充，不得编造。
5. 标题与正文必须数量一致：
  - 标题写“X 条/套”，正文必须完整展开 X 条/套；
  - 若仅展开 K 条，标题必须写“第 N 批：K 条/套”，并在文内声明全量样本数。
6. 优先分批发布：单篇建议深度展开 3-5 条/套，避免“标题全量、正文摘要”。
7. 每篇发布后必须产出 Prompt 资产卡到 `src/data/prompts/`，且必须符合 prompts collection schema。
8. Prompt 资产卡必须支持后续下载模板与原图：
  - `prompt` 字段可直接复制，不得只写摘要；
  - `sampleImages` 必须保留原始图片直链；
  - 若已归档图片，`archivedImages` 与 `storage` 必须填写；
  - 若暂未归档，`archivedImages` 可为空，但不得伪造链接。
9. 提取失败时必须记录失败原因（如“仅摘要无可复制正文”），不得静默跳过。

## 语气与风格

- 风格：边缘观测者（冷静、锐利、幽默）。
- 约束：不做人身攻击，不进行无意义贬损。
- 建议结构：
  1. 这是什么（30 秒看懂）
  2. 为什么值得记（比喻/记忆锚点）
  3. 怎么复用（可复制模板）
  4. 别怎么用（常见误区）

## 文件与命名规范

- 博文输出目录：`src/data/blog/`
- Prompt 资产输出目录：`src/data/prompts/`
- slug：英文小写连字符，避免重复。
- frontmatter 基本字段：
  - title
  - author
  - pubDatetime
  - slug
  - featured
  - draft
  - tags
  - description

### Prompt 资产固定输出格式（必须）

每个可提取 prompt 必须落为一个独立 markdown 文件，frontmatter 必须满足：

```yaml
title: "..."
slug: "..."
lang: zh
sourceDate: 2026-05-06T00:00:00Z
sourcePlatform: x
sourceUrl: https://x.com/xxx/status/123
prompt: |
  在这里放完整可复制提示词正文
summary: "一句话说明用途"
tags:
  - gpt-image-2
  - prompt
sampleImages:
  - https://pbs.twimg.com/media/example-1.jpg
archivedImages:
  - /prompt-assets/2026/05/example/example-1.jpg
storage:
  provider: local
  path: prompt-assets/2026/05/example
```

正文建议包含：
- 核心价值
- 适用场景
- 使用提醒

## 执行流程

1. 读取 `src/data/inbox/` 中所有非 README 素材文件。
2. 对每个素材文件进行拆分：
   - 若包含多条条目，则按条目拆分成多篇。
   - 若用户明确“一个文件一篇”，则遵从用户指令。
3. 生成文章并保存到 `src/data/blog/`。
4. 从文章或来源素材中提取 prompt 单元（代码块 + 明确提示词段落）。
5. 将每个 prompt 单元写入 `src/data/prompts/*.md`（固定格式）。
6. 清空已处理的 inbox 文件（保留 README）。
7. 可选：提交并推送。

## Prompt 提取与落盘规则

- 目标不是中间报告文件，而是最终可用素材卡：`src/data/prompts/*.md`。
- 推荐命名：`YYYY-MM-DD-<slug>.md`。
- 若一个来源有多条 prompt，必须拆成多份 prompt 文件，不要把 10 条塞进一份。
- 若无可提取 prompt：
  - 在对应博文里标注“信息不足”；
  - 不生成伪 prompt 文件。

## 质量检查

- 链接可访问（至少语法正确）。
- 提示词块可直接复制。
- 日期格式符合站点 schema（date 类型，不要加多余引号）。
- 保证文章可以通过 Astro content check。
- 图片链接完整性校验：
  - 若输入里有图片直链，输出必须保留直链，不得丢失。
  - 禁止输出“图片直链1/图片直链2/图片直链”等占位词。
  - 若输入无直链，必须写“原帖媒体：<tweet链接>”，不得留空。
- Prompt 提取完整性校验：
  - 生成的 prompt 文件数应与可识别 prompt 单元数一致；
  - 每个 prompt 文件中的 `prompt` 字段必须可直接复制；
  - 禁止把“热度分析/趋势点评”误提取为 prompt。

## 快速模板

见 [examples/inbox-entry-template.md](examples/inbox-entry-template.md)。

Prompt 资产卡模板见 [examples/prompt-asset-template.md](examples/prompt-asset-template.md)。
