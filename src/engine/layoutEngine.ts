import type { CSSProperties } from 'react';
import type { EditorImage, PhotoCrop } from '@/types';

const MAX_IMAGE_DIMENSION = 4096;

export const DEFAULT_PHOTO_CROP: PhotoCrop = {
  zoom: 1,
  panX: 0,
  panY: 0,
};

export const PHOTO_ZOOM_MIN = 1;
export const PHOTO_ZOOM_MAX = 3;

export type ImageTransform = {
  offsetX: number;
  offsetY: number;
  scale: number;
};

export function clampPhotoCrop(crop: PhotoCrop): PhotoCrop {
  const zoom = Math.min(PHOTO_ZOOM_MAX, Math.max(PHOTO_ZOOM_MIN, crop.zoom));
  const maxPan = Math.max(0, (zoom - 1) / zoom);
  return {
    zoom,
    panX: Math.max(-maxPan, Math.min(maxPan, crop.panX)),
    panY: Math.max(-maxPan, Math.min(maxPan, crop.panY)),
  };
}

/** 将相对构图转为 slot 内的 cover 像素变换（供调试 / 将来 Canvas 导出） */
export function computeCoverTransform(
  imageWidth: number,
  imageHeight: number,
  slotWidth: number,
  slotHeight: number,
  crop: PhotoCrop = DEFAULT_PHOTO_CROP,
): ImageTransform {
  const baseScale = Math.max(slotWidth / imageWidth, slotHeight / imageHeight);
  const scale = baseScale * crop.zoom;
  const scaledW = imageWidth * scale;
  const scaledH = imageHeight * scale;
  const maxOffsetX = Math.max(0, (scaledW - slotWidth) / 2);
  const maxOffsetY = Math.max(0, (scaledH - slotHeight) / 2);

  return {
    scale,
    offsetX: (slotWidth - scaledW) / 2 + crop.panX * maxOffsetX * 2,
    offsetY: (slotHeight - scaledH) / 2 + crop.panY * maxOffsetY * 2,
  };
}

/** DOM 预览/导出用的图片样式（与 computeCoverTransform 语义一致） */
export function photoCropStyle(crop: PhotoCrop): CSSProperties {
  const c = clampPhotoCrop(crop);
  const maxShift = ((c.zoom - 1) / c.zoom) * 50;
  return {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: `translate(${c.panX * maxShift * 2}%, ${c.panY * maxShift * 2}%) scale(${c.zoom})`,
    transformOrigin: 'center center',
    maxWidth: 'none',
  };
}

export async function loadImageFromFile(file: File): Promise<EditorImage> {
  const src = await readFileAsDataURL(file);
  const { width, height } = await getImageDimensions(src);

  const maxDim = Math.max(width, height);
  if (maxDim > MAX_IMAGE_DIMENSION) {
    const ratio = MAX_IMAGE_DIMENSION / maxDim;
    const compressed = await compressImage(src, Math.round(width * ratio), Math.round(height * ratio));
    const dims = await getImageDimensions(compressed);
    return {
      id: crypto.randomUUID(),
      src: compressed,
      width: dims.width,
      height: dims.height,
    };
  }

  return {
    id: crypto.randomUUID(),
    src,
    width,
    height,
  };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}

function compressImage(src: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = reject;
    img.src = src;
  });
}
