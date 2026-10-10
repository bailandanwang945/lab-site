# 课题组主页

中英双语学术组主页，基于 [Astro](https://astro.build) 静态构建，部署在 GitHub Pages。

**在线地址**：https://mjcui.github.io/lab-site/

## 站点结构

| 栏目 | 中文路径 | 英文路径 | 内容来源 |
| --- | --- | --- | --- |
| 首页 | `/` | `/en/` | `src/data/site.zh.json` / `site.en.json` |
| 成员名录 | `/members/` | `/en/members/` | `src/content/members/*.md` |
| 在研项目 | `/projects/` | `/en/projects/` | `src/content/projects/<项目名>/` |
| 论文成果 | `/papers/` | `/en/papers/` | `src/content/papers/*.md` |
| 新闻动态 | `/news/` | `/en/news/` | `src/content/news/*.zh.md` + `*.en.md` |
| 实验室与设备 | `/life/` | `/en/life/` | `src/content/life/lab-life_cn.md` / `_en.md` |
| 招生合作 | `/join/` | `/en/join/` | `src/content/join/recruitment/` |

内容后台：`/admin/`（Decap CMS，需先配置 OAuth，详见 `.env.example`）

## 本地开发

```bash
npm install --registry=https://registry.npmmirror.com
npm run dev        # 预览 http://localhost:4321
```

提交前自检：

```bash
npm run validate:content   # 校验内容格式（中英配对、id 与文件名一致等）
npm run build              # 完整构建
```

## 目录约定

- **成员**：一人一文件，文件名必须与 frontmatter 的 `id` 完全一致。
- **项目**：一个目录，含 `overview_cn/en.md` 与 `background_cn/en.md` 四个文件，缺一不可。里程碑进度表写在 `overview` 里。
- **新闻**：中英两份成对，文件名后缀须与 frontmatter 的 `slug` 一致。
- **中英内容**：所有可翻译字段都用 `zh` / `en` 双语结构，两侧内容需同时维护。

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并发布到 GitHub Pages。

若需自定义域名，在仓库 **Settings → Pages** 中填写，并添加 `CNAME` 文件。
站点正式域名通过仓库变量 `PUBLIC_SITE_URL` 配置（**Settings → Secrets and variables → Actions → Variables**）。

## 维护指引

内容替换清单、命名规范与常见问题见 [`维护手册.md`](./维护手册.md)。

## 许可与致谢

站点模板基于 [DoubleDuckLab](https://github.com/nightt5879/DoubleDuckLab)（MIT 许可）搭建，内容与设计调整归本课题组所有。