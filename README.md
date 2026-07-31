# Ins拼图

上传照片，选择 INS 风模板，叠加滤镜，一键导出高清拼图。

## 功能

- 单张照片上传（拖拽 / 点击，支持 JPG / PNG / WebP）
- **8 套 INS 风模板**：拍立得、杂志、CCD、Y2K、奶油、电影宽幅、手账便签、胶片齿孔
- **9 款照片滤镜**：胶片暖、莫兰迪、暖阳、冷雾、黑白等，支持强度调节
- 预览内拖拽平移 / 滚轮缩放构图
- EXIF 自动读取拍摄日期；有 GPS 时解析地点（失败可降级）
- 智能色板 + 色板驱动模板配色 + 标题文字色建议
- 模板参数可调；风格组合本地收藏与分享链接
- 多种输出尺寸；导出 PNG / JPEG（1x / 2x / 3x）；支持小红书 + IG 批量导出

## 开发

```bash
npm install
npm run dev
```

默认访问：http://localhost:5173/images/

常用脚本：

```bash
npm run check   # astro check（类型检查）
npm test        # 引擎单测
npm run build   # 生产构建
npm run preview # 预览构建产物
```

## 子路径部署（`/images/`）

本项目默认挂在子路径 `/images/`（见 `.env.example` 的 `BASE_PATH`），静态资源与路由都会带此前缀。

1. 复制环境变量：

```bash
cp .env.example .env
```

2. 按部署位置调整 `BASE_PATH`（必须以 `/` 开头；非根路径时以 `/` 结尾）：

| 场景 | `BASE_PATH` | 访问地址示例 |
|------|-------------|--------------|
| 本仓库默认 / 反向代理子目录 | `/images/` | `https://example.com/images/` |
| 站点根路径 | `/` | `https://example.com/` |


## 技术栈
- Astro + React + Zustand + Tailwind CSS
- html-to-image（导出）
- exifr（EXIF 读取）
- Vitest（引擎单测）
