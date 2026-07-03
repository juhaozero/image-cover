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
npm run dev
```

访问 http://localhost:4321

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
