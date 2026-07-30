# Ins拼图

上传照片，选择 INS 风模板，叠加滤镜，一键导出高清拼图。

## 功能

- 单张照片上传（拖拽 / 点击，支持 JPG / PNG / WebP）
- **5 套 INS 风模板**：复古拍立得、极简杂志风、复古 CCD、Y2K 千禧风、韩系奶油风
- **9 款照片滤镜**：胶片暖、莫兰迪、暖阳、冷雾、黑白等，支持强度调节
- 预览内拖拽平移 / 滚轮缩放构图
- EXIF 自动读取拍摄日期；有 GPS 时解析地点（失败可降级）
- 智能色板提取 + 标题文字色建议
- 模板参数可调（拍立得边距/日期、杂志刊头/页码/副标题、CCD 标题）
- 多种输出尺寸：小红书 3:4、Instagram 4:5、方形、壁纸等
- 本地浏览器处理；导出 PNG / JPEG，支持 1x / 2x / 3x

> 后续计划见 [`docs/迭代任务清单.md`](docs/迭代任务清单.md)。

## 开发

```bash
npm install
npm run dev
```

默认访问：http://localhost:4321/images/

## 技术栈

- Astro + React + Zustand + Tailwind CSS
- html-to-image（导出）
- exifr（EXIF 读取）
