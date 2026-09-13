---
title: "你好，Hugo"
date: 2026-09-13
draft: false
tags: ["Hugo", "博客"]
categories: ["技术"]
summary: "使用 Hugo + PaperMod + GitHub Pages 搭建个人博客。"
---

这是我的第一篇博客文章！

这个博客使用以下技术搭建：

- **[Hugo](https://gohugo.io/)**：静态网站生成器，速度快
- **[PaperMod](https://github.com/adityatelange/hugo-PaperMod)**：简洁现代的主题
- **[GitHub Pages](https://pages.github.com/)**：免费托管
- **GitHub Actions**：推送后自动构建部署

## 写作工作流

```bash
# 新建文章
hugo new content posts/my-post.md

# 本地预览（含草稿）
hugo server -D

# 推送后自动部署
git add . && git commit -m "new post" && git push
```

Happy blogging!
