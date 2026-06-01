---
title: "AI 图片生成提示词合集：从街拍到古典女神"
author: "ming"
pubDatetime: 2026-06-01T00:00:00Z
slug: ai-image-prompt-collection
featured: false
draft: false
tags:
  - AI
  - Prompt Engineering
  - Image Generation
  - GPT Image 2
  - Flux
description: "精选 4 篇 X 平台高质量 AI 图像生成案例拆解，涵盖街拍生活感、电影纯欲风、古典女神雕塑、氛围快闪技巧。附完整提示词、参数与图片参考。"
---

## 这篇是什么

这是一篇把本地 Astro 草稿整理成可发布博客的示例文章。核心目标不是堆图，而是把 4 个案例拆成可复用的提示词资产，方便后续直接去 prompts 页面下载模板、回看原图和做二次改写。

## 为什么值得看

这 4 个案例覆盖的不是同一种风格，而是 4 种完全不同的提示词方法：街拍生活纪实、电影纯欲风、古典女神双模式、日落氛围快闪。它们共同的价值在于都很“能抄作业”，不是只看图爽一下就结束。

## 四个案例总览

- [案例 1：街拍生活纪实](#case-1)
- [案例 2：电影纯欲风写真](#case-2)
- [案例 3：古典女神双模](#case-3)
- [案例 4：日落氛围快闪技巧](#case-4)

---

## Case 1

### 街拍生活纪实

关键词是“不摆拍”和“真实背景”。这类提示词最怕把人拍成棚拍假人，所以它强调的是地铁、便利店、书店、公交站这类有生活噪音的地点。

**提炼后的 prompt 骨架：**

```text
生成一组城市街拍生活纪实图，强调不摆拍、杂乱真实背景、人物在做自己的事。
场景包含：地铁低头刷手机、便利店自助机前、书店伸手够书、雨夜公交站玻璃旁。
镜头要像真实抓拍，不要棚拍感，不要过度修饰，不要把生活拍成广告。
```

**原图参考：**

- https://pbs.twimg.com/media/HJoztQPbUAA66Hk.jpg
- https://pbs.twimg.com/media/HJozviHakAA0LEx.jpg
- https://pbs.twimg.com/media/HJozxjzbAAA4uAO.jpg
- https://pbs.twimg.com/media/HJozzd5acAA-rac.jpg

**对应 Prompt 资产卡：**

- [/prompts/street-life-documentary-zh/](../prompts/street-life-documentary-zh)

## Case 2

### 电影纯欲风写真

这一类的关键不是“性感”，而是“情绪稳定”。最有效的做法是把时间、空间和光线写得很具体，让模型知道你要的是一帧都市电影，而不是随便一张夜景自拍。

**可复制 prompt：**

```text
写真风格：电影生活剧照感
场景方向：夜晚车内副驾驶
服装方向：白色长袖开衫 + 黑色低腰短裤
气质标签：安静、纯欲
五官方向：初恋感淡颜
身形方向：胸腰腿线条感（中强度）
线条重点：胸线、锁骨、腰线
镜头方向：副驾驶轻侧坐姿，大腿以上构图
光线氛围：车内柔和冷白顶灯 + 窗外夜景虚化光斑
滤镜效果：冷白纯欲生活照滤镜
画幅比例：9:16
```

**原图参考：**

- https://pbs.twimg.com/media/HJpJU14bwAA5Cyc.jpg
- https://pbs.twimg.com/media/HJpJXfdbAAET5MZ.jpg
- https://pbs.twimg.com/media/HJpKOZgakAAS14t.jpg
- https://pbs.twimg.com/media/HJi6ARtaUAAyyk-.jpg
- https://pbs.twimg.com/media/HJi6CoXaIAAlpiO.jpg
- https://pbs.twimg.com/media/HJi6D6MakAAm5Lo.jpg

**对应 Prompt 资产卡：**

- [/prompts/cinematic-pure-style-car-night-zh/](../prompts/cinematic-pure-style-car-night-zh)

## Case 3

### 古典女神双模

这是最像“工作流模板”的案例。它不是单一 prompt，而是把风格拆成两个模式：一个做雕塑黑白，一个做写实彩绘。好处是同一个主题能快速测两种审美路线。

**提炼后的 prompt 骨架：**

```text
你是一个古典女神图像生成器，支持两种模式：
A. 冷白雕塑黑白模式：大理石材质、高反差、博物馆摄影感、神性庄严。
B. 写实彩绘模式：真人皮肤质感、古典油画光影、高级克制美。
主体保持古典、克制、庄严，不要现代服装，不要低俗表情，不要廉价修图感。
```

**原图参考：**

- https://pbs.twimg.com/media/HJqYk8Ja4AAPr2R.jpg
- https://pbs.twimg.com/media/HJqYk8KbgAAz3O-.jpg
- https://pbs.twimg.com/media/HJqYk70acAAz4sx.jpg
- https://pbs.twimg.com/media/HJqYk7zaUAAnlA4.jpg

**对应 Prompt 资产卡：**

- [/prompts/classical-goddess-dual-mode-zh/](../prompts/classical-goddess-dual-mode-zh)

## Case 4

### 日落氛围快闪技巧

这个案例最实用的地方很简单：你只要在提示词前面放一个明确时刻词，氛围就会立刻稳定很多。日落时分、golden hour、蓝调时刻，这类词的作用比空泛的“高级感”强得多。

**可复制 prompt：**

```text
日落时分，高级时尚摄影，丰腴身材，S曲线，20岁左右日本美女模特，泳装，青春自信氛围。
不同姿势，保持人脸一致，四宫格展示。
```

**原图参考：**

- https://pbs.twimg.com/media/HJpXbUragAAM9gB.jpg

**对应 Prompt 资产卡：**

- [/prompts/sunset-flash-four-grid-zh/](../prompts/sunset-flash-four-grid-zh)

## 这 4 个案例的共性

1. 约束写得具体，模型更容易稳定输出。
2. 场景词比空泛审美词更有用。
3. 一张图里只改一个维度，效果比较干净。
4. 图和 prompt 应该拆开管理，方便后续下载和复用。

## 下一步怎么玩

如果你要继续扩展这套内容，最稳的做法是先把 prompt 卡沉淀到 [Prompts Archive](/prompts/) 里，再从博客页导向这些素材卡。这样后续不管是下载模板、换图，还是做专题页，路径都不会散。
