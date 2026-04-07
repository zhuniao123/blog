# Astro + GitHub + Cloudflare Pages 博客模板

这个项目已经配置为静态站点，适合免费部署到 Cloudflare Pages，并通过 GitHub 自动触发构建发布。

## 1. 本地开发

```bash
npm install
npm run dev
```

默认访问 `http://localhost:4321`。

## 2. 构建验证

```bash
npm run build
```

构建产物目录是 `dist/`，Cloudflare Pages 会直接使用它。

## 3. 连接 GitHub

在项目目录执行（把仓库地址替换成你的）：

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## 4. Cloudflare Pages 配置

1. 登录 Cloudflare Dashboard。
2. 打开 `Workers & Pages` → `Create` → `Pages` → `Connect to Git`。
3. 选择本项目仓库并导入。
4. 构建设置填写：
   - `Framework preset`: `Astro`
   - `Build command`: `npm run build`
   - `Build output directory`: `dist`
5. 环境变量（推荐）：
   - `SITE_URL` = 你的正式站点 URL（例如 `https://blog.example.com` 或 `https://xxx.pages.dev`）
   - 如果构建日志提示 Node 版本不匹配，再补充 `NODE_VERSION=22`
6. 点击 `Save and Deploy`。

之后每次你向 `main` 分支 push，Cloudflare Pages 会自动部署。

## 5. 你需要改的内容

- 站点标题和描述：`src/consts.ts`
- 首页文案：`src/pages/index.astro`
- 关于页：`src/pages/about.astro`
- 博客文章：`src/content/blog/`
- 站点域名变量：Cloudflare Pages 环境变量 `SITE_URL`

## 6. 常见问题

- Q: 为什么 sitemap 或 RSS 里域名不对？
  - A: 没有设置 `SITE_URL`。在 Cloudflare Pages 项目里补上后重新部署。

- Q: 推送后没有自动部署？
  - A: 检查 Cloudflare Pages 项目是否绑定了正确仓库和分支（通常是 `main`）。
