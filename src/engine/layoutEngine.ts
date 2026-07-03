import type { EditorImage, ImageTransform, Slot, SlotMapping } from '@/types';

const MAX_IMAGE_DIMENSION = 4096;

export function mapImagesToSlots(
  images: EditorImage[],
  slots: Slot[],
): SlotMapping[] {
  return slots.map((slot, slotIndex) => ({
    slotIndex,
    slot,
    image: images[slotIndex] ?? null,
  }));
}

export function computeCoverTransform(
  imageWidth: number,
  imageHeight: number,
  slotWidth: number,
  slotHeight: number,
  custom?: ImageTransform,
): ImageTransform {
  if (custom) return custom;

  const scale = Math.max(slotWidth / imageWidth, slotHeight / imageHeight);
  const scaledW = imageWidth * scale;
  const scaledH = imageHeight * scale;

  return {
    scale,
    offsetX: (slotWidth - scaledW) / 2,
    offsetY: (slotHeight - scaledH) / 2,
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

export const MAX_IMAGES = 20;
