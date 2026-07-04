import { IconDownload, IconSpinner } from '@/components/icons';
import { useState } from 'react';
import {
  buildExportFilename,
  downloadDataURL,
  exportElementToDataURL,
} from '@/engine/exportEngine';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { useEditorStore } from '@/store/editorStore';
import type { ExportFormat, ExportScale } from '@/types';

type Props = {
  exportRef: React.RefObject<HTMLDivElement | null>;
};

export default function ExportDock({ exportRef }: Props) {
  const image = useEditorStore((s) => s.image);
  const canvasSize = useCanvasSize();
  const [exporting, setExporting] = useState(false);
  const [format] = useState<ExportFormat>('png');
  const [scale] = useState<ExportScale>(2);
  const canExport = !!image && !!canvasSize;

  const handleExport = async () => {
    const el = exportRef.current;
    if (!el || !canExport || !canvasSize) return;

    setExporting(true);
    try {
      const dataUrl = await exportElementToDataURL(
        el,
        format,
        scale,
        canvasSize.width,
        canvasSize.height,
      );
      downloadDataURL(dataUrl, buildExportFilename(format, scale));
    } finally {
      setExporting(false);
    }
  };

  const outputSize = canvasSize
    ? { w: canvasSize.width * scale, h: canvasSize.height * scale }
    : null;

  return (
    <footer className="sticky bottom-0 z-40 border-t border-studio-border bg-studio-surface/95 shadow-dock backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <p className="text-[11px] text-ink-muted">
          所有处理均在本地浏览器完成，无需上传服务器。
        </p>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          {canExport && outputSize ? (
            <p className="text-[11px] text-ink-muted">
              输出 <span className="font-semibold text-ink-secondary">{outputSize.w} × {outputSize.h}</span>
            </p>
          ) : (
            <p className="text-[11px] text-ink-muted">上传照片后即可导出</p>
          )}

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || !canExport}
            className="btn-primary min-w-[160px]"
          >
            {exporting ? (
              <>
                <IconSpinner size={16} className="animate-spin" />
                导出中…
              </>
            ) : (
              <>
                <IconDownload size={16} />
                下载拼图 PNG
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
