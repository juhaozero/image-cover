# Ins拼图

上传照片，选择 INS 风模板，叠加滤镜，一键导出高清拼图。

## 功能

- 单张照片上传（拖拽 / 点击）
- **5 套 INS 风模板**：复古拍立得、极简杂志风、复古 CCD、Y2K 千禧风、韩系奶油风
- **9 款照片滤镜**：胶片暖、莫兰迪、暖阳、冷雾、黑白等
- EXIF 自动读取地点 / 日期
- 多种输出尺寸：小红书 3:4、Instagram 4:5、方形、壁纸等
- 本地浏览器处理，PNG 高清导出

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
