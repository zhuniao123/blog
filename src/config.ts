export const SITE = {
  website: "https://blog.lazyoldlearner.win/",
  author: "EdgeObserver",
  profile: "https://github.com/zhuniao123",
  desc: "不逐流，不盲从。在代码的边缘，观察世界的本质。",
  title: "边缘观测者的极客边境",
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
