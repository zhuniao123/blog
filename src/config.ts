export const SITE = {
  website: "https://blog.zhuniao123.com/", // 建议之后根据你的 CF 域名修改
  author: "zhuniao123",
  profile: "https://github.com/zhuniao123",
  desc: "正在通过 127.0.0.1 观察宇宙。本博客由 10% 的代码和 90% 的 Stack Overflow 组成。",
  title: "Zhuniao's Geek Space",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-CN", // 设置为中文
  timezone: "Asia/Shanghai", // 设置为上海时间
} as const;
