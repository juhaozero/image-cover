import { toPng } from 'html-to-image';
import type { ExportFormat, ExportScale } from '@/types';

export async function exportElementToDataURL(
  element: HTMLElement,
  format: ExportFormat,
  pixelRatio: ExportScale,
  width: number,
  height: number,
): Promise<string> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio,
    canvasWidth: width * pixelRatio,
    canvasHeight: height * pixelRatio,
  });

  if (format === 'png') return dataUrl;

  return jpegFromDataURL(dataUrl, 0.92);
}

function jpegFromDataURL(pngDataUrl: string, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas unavailable'));
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = pngDataUrl;
  });
}

export function downloadDataURL(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function buildExportFilename(format: ExportFormat, scale: ExportScale): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const ext = format === 'png' ? 'png' : 'jpg';
  return `ins-puzzle-${timestamp}${scale > 1 ? `@${scale}x` : ''}.${ext}`;
}
