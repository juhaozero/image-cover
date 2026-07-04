import { OUTPUT_SIZE_PRESETS, PHOTO_FILTERS, TITLE_FONTS } from '@/engine/insTemplateEngine';
import { useEditorStore } from '@/store/editorStore';
import type { OutputSizeId, PhotoFilterId, TitleFontId } from '@/types';

export default function ControlPanel() {
  const image = useEditorStore((s) => s.image);
  const filterId = useEditorStore((s) => s.filterId);
  const title = useEditorStore((s) => s.title);
  const fontId = useEditorStore((s) => s.fontId);
  const outputSizeId = useEditorStore((s) => s.outputSizeId);

  const setFilterId = useEditorStore((s) => s.setFilterId);
  const setTitle = useEditorStore((s) => s.setTitle);
  const setFontId = useEditorStore((s) => s.setFontId);
  const setOutputSizeId = useEditorStore((s) => s.setOutputSizeId);

  if (!image) return null;

  return (
    <div className="flex flex-col gap-4">
      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">照片滤镜</h2>
        </div>
        <div className="flex flex-wrap gap-1.5 p-3">
          {PHOTO_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterId(f.id as PhotoFilterId)}
              className={[
                'rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors',
                filterId === f.id
                  ? 'bg-accent text-white'
                  : 'bg-studio-muted text-ink-muted hover:text-ink',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">主标题</h2>
        </div>
        <div className="space-y-3 p-3">
          <label className="block">
            <span className="mb-1 block text-[11px] text-ink-muted">文字内容</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入主标题"
              className="w-full rounded-lg border border-studio-border bg-studio-muted/50 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] text-ink-muted">标题字体</span>
            <select
              value={fontId}
              onChange={(e) => setFontId(e.target.value as TitleFontId)}
              className="w-full rounded-lg border border-studio-border bg-studio-muted/50 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            >
              {TITLE_FONTS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">输出尺寸</h2>
        </div>
        <div className="p-3">
          <select
            value={outputSizeId}
            onChange={(e) => setOutputSizeId(e.target.value as OutputSizeId)}
            className="w-full rounded-lg border border-studio-border bg-studio-muted/50 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          >
            {OUTPUT_SIZE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
                {p.width ? ` · ${p.width}×${p.height}` : ''}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
}
