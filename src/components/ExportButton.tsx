import { IconDownload, IconSpinner } from '@/components/icons';
import { useState } from 'react';
import type Konva from 'konva';
import {
  buildExportFilename,
  downloadDataURL,
  exportStageToDataURL,
} from '@/engine/exportEngine';
import { useEditorStore } from '@/store/editorStore';
import type { ExportFormat, ExportScale } from '@/types';
import SegmentedControl from './ui/SegmentedControl';

type Props = {
  stageRef: React.RefObject<Konva.Stage | null>;
};

export default function ExportDock({ stageRef }: Props) {
  const images = useEditorStore((s) => s.images);
  const template = useEditorStore((s) => s.template);
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<ExportScale>(2);

  const canExport = images.length > 0;

  const handleExport = async () => {
    const stage = stageRef.current;
    if (!stage || !canExport) return;

    setExporting(true);
    try {
      const dataUrl = exportStageToDataURL(stage, format, scale);
      downloadDataURL(dataUrl, buildExportFilename(format, scale));
    } finally {
      setExporting(false);
    }
  };

  const outputSize = {
    w: template.canvas.width * scale,
    h: template.canvas.height * scale,
  };

  return (
    <footer className="sticky bottom-0 z-40 border-t border-studio-border bg-studio-surface/95 shadow-dock backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">格式</span>
            <SegmentedControl
              label="导出格式"
              options={[
                { value: 'png' as ExportFormat, label: 'PNG' },
                { value: 'jpeg' as ExportFormat, label: 'JPG' },
              ]}
              value={format}
              onChange={setFormat}
            />
          </div>

          <div className="hidden h-6 w-px bg-studio-border sm:block" aria-hidden />

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">清晰度</span>
            <SegmentedControl
              label="导出清晰度"
              options={[
                { value: 1 as ExportScale, label: '1×' },
                { value: 2 as ExportScale, label: '2×' },
                { value: 3 as ExportScale, label: '3×' },
              ]}
              value={scale}
              onChange={setScale}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          {canExport ? (
            <p className="text-[11px] text-ink-muted">
              输出尺寸 <span className="font-semibold text-ink-secondary">{outputSize.w} × {outputSize.h}</span>
            </p>
          ) : (
            <p className="text-[11px] text-ink-muted">上传照片后即可导出</p>
          )}

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || !canExport}
            className="btn-primary min-w-[140px]"
          >
            {exporting ? (
              <>
                <IconSpinner size={16} className="animate-spin" />
                导出中…
              </>
            ) : (
              <>
                <IconDownload size={16} />
                下载拼图
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
