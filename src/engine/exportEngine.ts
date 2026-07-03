import type Konva from 'konva';
import type { ExportFormat, ExportScale } from '@/types';

export function exportStageToDataURL(
  stage: Konva.Stage,
  format: ExportFormat,
  pixelRatio: ExportScale,
): string {
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'jpeg' ? 0.92 : undefined;

  return stage.toDataURL({
    mimeType,
    quality,
    pixelRatio,
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
  return `collage-${timestamp}${scale > 1 ? `@${scale}x` : ''}.${ext}`;
}
