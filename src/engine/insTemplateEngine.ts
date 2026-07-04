import type {
  CanvasSize,
  InsTemplate,
  InsTemplateId,
  OutputSizeId,
  OutputSizePreset,
  PhotoFilter,
  TitleFont,
  TitleFontId,
} from '@/types';

export const INS_TEMPLATES: InsTemplate[] = [
  { id: 'polaroid', name: '复古拍立得', description: '相纸留白 · 褪色暗角' },
  { id: 'magazine', name: '极简杂志风', description: 'Kinfolk 呼吸感排版' },
  { id: 'ccd', name: '复古 CCD', description: '闪光灯 · 噪点 · 时间戳' },
  { id: 'y2k', name: 'Y2K 千禧风', description: '全息拼贴 · 像素窗口' },
  { id: 'cream', name: '韩系奶油风', description: '暖白柔光 · 大圆角' },
];

export const OUTPUT_SIZE_PRESETS: OutputSizePreset[] = [
  { id: 'free', label: '自由', width: 0, height: 0 },
  { id: 'xiaohongshu', label: '小红书 3:4', width: 1080, height: 1440 },
  { id: 'instagram', label: 'Instagram 4:5', width: 1080, height: 1350 },
  { id: 'square', label: 'IG 方形 1:1', width: 1080, height: 1080 },
  { id: 'wallpaper', label: '手机壁纸 9:16', width: 1080, height: 1920 },
  { id: 'postcard', label: '明信片', width: 1800, height: 1200 },
];

export const PHOTO_FILTERS: PhotoFilter[] = [
  { id: 'none', label: '原图' },
  { id: 'film', label: '胶片暖' },
  { id: 'faded', label: '莫兰迪' },
  { id: 'golden', label: '暖阳' },
  { id: 'cool', label: '冷雾' },
  { id: 'mono', label: '黑白' },
  { id: 'cinematic', label: '索尼 FL' },
  { id: 'classic_chrome', label: '富士 CC' },
  { id: 'positive', label: '理光正片' },
];

export function resolveCanvasSize(
  outputSizeId: OutputSizeId,
  imageWidth: number,
  imageHeight: number,
): CanvasSize {
  const preset = OUTPUT_SIZE_PRESETS.find((p) => p.id === outputSizeId);
  if (!preset || preset.id === 'free' || preset.width === 0) {
    const maxDim = 1350;
    const ratio = imageWidth / imageHeight;
    if (ratio >= 1) {
      return { width: maxDim, height: Math.round(maxDim / ratio) };
    }
    return { width: Math.round(maxDim * ratio), height: maxDim };
  }
  return { width: preset.width, height: preset.height };
}

export const TITLE_FONTS: TitleFont[] = [
  { id: 'typewriter', label: '打字机', family: '"Space Mono", "Courier New", monospace' },
  { id: 'serif', label: '衬线', family: '"Playfair Display", Georgia, "Times New Roman", serif' },
  { id: 'sans', label: '无衬线', family: '"DM Sans", system-ui, sans-serif' },
  { id: 'pixel', label: '像素', family: '"Press Start 2P", "VT323", monospace' },
  { id: 'handwriting', label: '手写', family: '"Caveat", "Kalam", cursive' },
  { id: 'bold', label: '粗体', family: '"Arial Black", Impact, sans-serif' },
];

export function getFontById(id: TitleFontId): TitleFont {
  return TITLE_FONTS.find((f) => f.id === id) ?? TITLE_FONTS[0];
}

export function getTemplateById(id: InsTemplateId): InsTemplate {
  return INS_TEMPLATES.find((t) => t.id === id) ?? INS_TEMPLATES[0];
}

export function formatPolaroidDate(dateStr: string): string {
  if (!dateStr) {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  const normalized = dateStr.replace(/\./g, '-');
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatCcdTimestamp(dateStr: string): string {
  const now = new Date();
  let date = now;
  if (dateStr) {
    const parsed = new Date(dateStr.replace(/\./g, '-'));
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  return `${hh}:${mm}  ${dd}/${mo}`;
}
