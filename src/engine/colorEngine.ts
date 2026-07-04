import type { ColorSwatch } from '@/types';

const COLOR_NAMES: { zh: string; en: string; hue: [number, number] }[] = [
  { zh: '暮霞', en: 'Sunset', hue: [0, 20] },
  { zh: '珊瑚', en: 'Coral', hue: [20, 35] },
  { zh: '琥珀', en: 'Amber', hue: [35, 50] },
  { zh: '麦穗', en: 'Wheat', hue: [50, 65] },
  { zh: '苔绿', en: 'Moss', hue: [65, 95] },
  { zh: '松针', en: 'Pine', hue: [95, 150] },
  { zh: '海蓝', en: 'Ocean', hue: [150, 210] },
  { zh: '靛青', en: 'Indigo', hue: [210, 250] },
  { zh: '暮紫', en: 'Dusk', hue: [250, 290] },
  { zh: '玫瑰', en: 'Rose', hue: [290, 330] },
  { zh: '烟灰', en: 'Slate', hue: [330, 360] },
];

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getColorName(r: number, g: number, b: number): { zh: string; en: string } {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (s < 8) {
    if (l < 25) return { zh: '墨黑', en: 'Ink' };
    if (l > 75) return { zh: '云白', en: 'Cloud' };
    return { zh: '烟灰', en: 'Slate' };
  }
  const entry = COLOR_NAMES.find((c) => h >= c.hue[0] && h < c.hue[1]) ?? COLOR_NAMES[COLOR_NAMES.length - 1];
  return { zh: entry.zh, en: entry.en };
}

export function pickTextColor(bgHex: string, palette: ColorSwatch[]): string {
  const bg = hexToRgb(bgHex);
  const bgLum = luminance(bg[0], bg[1], bg[2]);
  let best = '#ffffff';
  let bestContrast = 0;

  for (const swatch of palette) {
    const lum = luminance(...swatch.rgb);
    const c = contrastRatio(bgLum, lum);
    if (c > bestContrast) {
      bestContrast = c;
      best = swatch.hex;
    }
  }

  if (bestContrast < 4.5) {
    return bgLum > 0.5 ? '#1c1917' : '#faf7f4';
  }
  return best;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export async function extractColorsFromImage(
  src: string,
  count: number,
): Promise<ColorSwatch[]> {
  const img = await loadImage(src);
  const size = 120;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  const step = 4;

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 128) continue;

    const [, s, l] = rgbToHsl(r, g, b);
    if (s < 5 && (l < 8 || l > 92)) continue;

    const qr = Math.round(r / 24) * 24;
    const qg = Math.round(g / 24) * 24;
    const qb = Math.round(b / 24) * 24;
    const key = `${qr},${qg},${qb}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.count += 1;
      existing.r = (existing.r * (existing.count - 1) + r) / existing.count;
      existing.g = (existing.g * (existing.count - 1) + g) / existing.count;
      existing.b = (existing.b * (existing.count - 1) + b) / existing.count;
    } else {
      buckets.set(key, { r, g, b, count: 1 });
    }
  }

  const total = Array.from(buckets.values()).reduce((s, b) => s + b.count, 0);
  const sorted = Array.from(buckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, count);

  return sorted.map((b) => {
    const r = Math.round(b.r);
    const g = Math.round(b.g);
    const bl = Math.round(b.b);
    const names = getColorName(r, g, bl);
    return {
      hex: rgbToHex(r, g, bl),
      rgb: [r, g, bl] as [number, number, number],
      nameZh: names.zh,
      nameEn: names.en,
      ratio: b.count / total,
    };
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export type FilterMatrix = number[];

export function getFilterMatrix(filterId: string): FilterMatrix | null {
  const matrices: Record<string, FilterMatrix> = {
    film: [1.05, 0.08, 0, 0, 8, 0, 1.0, 0, 0, 4, 0, 0.05, 0.85, 0, 0, 0, 0, 0, 1, 0],
    faded: [0.9, 0.05, 0.05, 0, 15, 0.05, 0.9, 0.05, 0, 15, 0.05, 0.05, 0.9, 0, 15, 0, 0, 0, 1, 0],
    golden: [1.1, 0.1, 0, 0, 10, 0.05, 1.05, 0, 0, 8, 0, 0, 0.9, 0, 5, 0, 0, 0, 1, 0],
    cool: [0.9, 0, 0.1, 0, 5, 0, 0.95, 0.05, 0, 5, 0.05, 0.05, 1.1, 0, 10, 0, 0, 0, 1, 0],
    mono: [0.33, 0.59, 0.11, 0, 0, 0.33, 0.59, 0.11, 0, 0, 0.33, 0.59, 0.11, 0, 0, 0, 0, 0, 1, 0],
    cinematic: [1.2, 0.05, 0, 0, -10, 0, 1.0, 0, 0, 0, 0, 0.05, 0.9, 0, 5, 0, 0, 0, 1, 0],
    classic_chrome: [0.95, 0.1, 0.05, 0, 8, 0.05, 0.9, 0.05, 0, 6, 0.05, 0.1, 0.85, 0, 4, 0, 0, 0, 1, 0],
    positive: [1.05, 0, 0, 0, 5, 0, 1.05, 0, 0, 5, 0, 0, 1.05, 0, 5, 0, 0, 0, 1, 0],
  };
  return matrices[filterId] ?? null;
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function applyMatrixToImageData(data: Uint8ClampedArray, matrix: FilterMatrix): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    data[i] = clampChannel(matrix[0] * r + matrix[1] * g + matrix[2] * b + matrix[3] * a + matrix[4]);
    data[i + 1] = clampChannel(matrix[5] * r + matrix[6] * g + matrix[7] * b + matrix[8] * a + matrix[9]);
    data[i + 2] = clampChannel(matrix[10] * r + matrix[11] * g + matrix[12] * b + matrix[13] * a + matrix[14]);
    data[i + 3] = clampChannel(matrix[15] * r + matrix[16] * g + matrix[17] * b + matrix[18] * a + matrix[19]);
  }
}

export async function applyFilterToImage(
  src: string,
  filterId: string,
  maxDimension = 2048,
): Promise<CanvasImageSource> {
  const img = await loadImage(src);
  const matrix = getFilterMatrix(filterId);
  if (!matrix) return img;

  const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img;

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  applyMatrixToImageData(imageData.data, matrix);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function loadImageSource(src: string): Promise<HTMLImageElement> {
  return loadImage(src);
}
