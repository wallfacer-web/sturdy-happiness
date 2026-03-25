# 提示词工程课程门户

这是一个基于 `Astro + Starlight` 的课程门户站点，对外发布《提示词工程》课程内容。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 从原课程仓库重新导入内容

```bash
node scripts/import-course-content.mjs "C:/path/to/Prompt_ENG"
```

也可以通过环境变量：

```bash
PROMPT_ENG_SOURCE="C:/path/to/Prompt_ENG" npm run import:content
```
