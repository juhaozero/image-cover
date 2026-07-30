import { IconDownload, IconSpinner } from '@/components/icons';
import { useState } from 'react';
import {
  buildExportFilename,
  downloadDataURL,
  exportElementToDataURL,
  waitForPaint,
} from '@/engine/exportEngine';
import { resolveCanvasSize } from '@/engine/insTemplateEngine';
import { BATCH_EXPORT_SIZES } from '@/engine/presetEngine';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { useEditorStore } from '@/store/editorStore';
import type { ExportFormat, ExportScale, OutputSizeId } from '@/types';

type Props = {
  exportRef: React.RefObject<HTMLDivElement | null>;
};

const FORMAT_OPTIONS: { id: ExportFormat; label: string }[] = [
  { id: 'png', label: 'PNG' },
  { id: 'jpeg', label: 'JPEG' },
];

const SCALE_OPTIONS: { id: ExportScale; label: string }[] = [
  { id: 1, label: '1x' },
  { id: 2, label: '2x' },
  { id: 3, label: '3x' },
];

const BATCH_LABEL: Record<string, string> = {
  xiaohongshu: 'xhs',
  instagram: 'ig',
};

export default function ExportDock({ exportRef }: Props) {
  const image = useEditorStore((s) => s.image);
  const format = useEditorStore((s) => s.exportFormat);
  const scale = useEditorStore((s) => s.exportScale);
  const outputSizeId = useEditorStore((s) => s.outputSizeId);
  const setExportFormat = useEditorStore((s) => s.setExportFormat);
  const setExportScale = useEditorStore((s) => s.setExportScale);
  const setOutputSizeId = useEditorStore((s) => s.setOutputSizeId);
  const canvasSize = useCanvasSize();
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canExport = !!image && !!canvasSize;

  const exportCurrent = async (sizeTag?: string) => {
    const el = exportRef.current;
    const { image: img, outputSizeId: sizeId } = useEditorStore.getState();
    if (!el || !img) throw new Error('missing export target');
    const size = resolveCanvasSize(sizeId, img.width, img.height);
    const dataUrl = await exportElementToDataURL(el, format, scale, size.width, size.height);
    downloadDataURL(dataUrl, buildExportFilename(format, scale, sizeTag));
  };

  const handleExport = async () => {
    if (!canExport) return;
    setExporting(true);
    setError(null);
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      await exportCurrent();
    } catch {
      setError('导出失败，请稍后重试');
    } finally {
      setExporting(false);
    }
  };

  const handleBatchExport = async () => {
    if (!canExport || !image) return;
    setExporting(true);
    setError(null);
    const original = outputSizeId;
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      for (const sizeId of BATCH_EXPORT_SIZES) {
        setOutputSizeId(sizeId as OutputSizeId);
        await waitForPaint(120);
        await exportCurrent(BATCH_LABEL[sizeId] ?? sizeId);
        await waitForPaint(60);
      }
    } catch {
      setError('批量导出失败，请稍后重试');
    } finally {
      setOutputSizeId(original);
      setExporting(false);
    }
  };

  const outputSize = canvasSize
    ? { w: canvasSize.width * scale, h: canvasSize.height * scale }
    : null;

  const formatLabel = format === 'png' ? 'PNG' : 'JPEG';

  return (
    <footer className="sticky bottom-0 z-40 border-t border-studio-border bg-studio-surface/95 shadow-dock backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-[11px] text-ink-muted">所有处理均在本地浏览器完成，无需上传服务器。</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-ink-muted">格式</span>
              <div className="flex rounded-lg bg-studio-muted p-0.5">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExportFormat(opt.id)}
                    className={[
                      'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                      format === opt.id
                        ? 'bg-studio-surface text-ink shadow-sm'
                        : 'text-ink-muted hover:text-ink',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-ink-muted">倍率</span>
              <div className="flex rounded-lg bg-studio-muted p-0.5">
                {SCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExportScale(opt.id)}
                    className={[
                      'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                      scale === opt.id
                        ? 'bg-studio-surface text-ink shadow-sm'
                        : 'text-ink-muted hover:text-ink',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
            {canExport && outputSize ? (
              <p className="text-[11px] text-ink-muted">
                输出{' '}
                <span className="font-semibold text-ink-secondary">
                  {outputSize.w} × {outputSize.h}
                </span>
              </p>
            ) : (
              <p className="text-[11px] text-ink-muted">上传照片后即可导出</p>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBatchExport}
                disabled={exporting || !canExport}
                className="btn-ghost border border-studio-border px-3 py-2"
                title="依次导出小红书 3:4 与 Instagram 4:5"
              >
                批量导出
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting || !canExport}
                className="btn-primary min-w-[148px]"
              >
                {exporting ? (
                  <>
                    <IconSpinner size={16} className="animate-spin" />
                    导出中…
                  </>
                ) : (
                  <>
                    <IconDownload size={16} />
                    下载拼图 {formatLabel}
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-right text-[11px] text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
