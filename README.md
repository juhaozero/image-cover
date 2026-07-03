# SnapLayout

INS 风图片拼图生成器 — 纯前端 Web MVP。

上传图片 → 选择模板 → Canvas 自动布局 → 导出高清图片。

## 技术栈

- Astro（页面壳）
- React（编辑器）
- Konva.js（Canvas 渲染）
- Zustand（状态管理）
- Tailwind CSS

## 开发

```bash
npm install
cp .env.example .env   # 可选，默认子路径为 /images/
npm run dev
```

本地访问（默认 `BASE_PATH=/images/`）：

http://localhost:4321/images/

根路径本地调试：

```bash
# Windows PowerShell
$env:BASE_PATH="/"; npm run dev

# Linux / macOS
BASE_PATH=/ npm run dev
```

## 子路径部署

项目支持部署在静态站点子目录下，通过环境变量 `BASE_PATH` 配置。

| 访问地址 | 配置 |
|---------|------|
| `https://app.juhaozero.com/images/` | `BASE_PATH=/images/` |
| `https://example.com/` | `BASE_PATH=/` |

```bash
# 构建（使用 .env 或 .env.example 中的 BASE_PATH）
npm run build

# 或临时指定
BASE_PATH=/images/ npm run build
```

将 `dist/` 目录内容上传到 Web 服务器对应目录。例如 `BASE_PATH=/images/` 时，把 `dist/` 内所有文件放到服务器的 `/images/` 目录下。

### Nginx 参考

```nginx
location /images/ {
    alias /var/www/snaplayout/;
    try_files $uri $uri/ /images/index.html;
}
```

## 功能

- 多图上传（拖拽 / 点击，最多 20 张）
- 4 种模板：INS 九宫格、胶片拼贴、极简卡片、Story 竖版
- Konva Canvas 实时预览
- 拖拽移动、滚轮缩放
- PNG / JPG 导出，支持 1x / 2x / 3x 高清

## 架构

```
components/  → UI 层
store/       → Zustand 状态
engine/      → 模板 / 布局 / 渲染 / 导出引擎
templates/   → 纯数据模板定义
```
