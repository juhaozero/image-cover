import { OUTPUT_SIZE_PRESETS, PHOTO_FILTERS, TITLE_FONTS } from '@/engine/insTemplateEngine';
import { useEditorStore } from '@/store/editorStore';
import type { OutputSizeId, PhotoFilterId, TitleFontId } from '@/types';

export default function ControlPanel() {
  const image = useEditorStore((s) => s.image);
  const templateId = useEditorStore((s) => s.templateId);
  const filterId = useEditorStore((s) => s.filterId);
  const filterIntensity = useEditorStore((s) => s.filterIntensity);
  const title = useEditorStore((s) => s.title);
  const fontId = useEditorStore((s) => s.fontId);
  const outputSizeId = useEditorStore((s) => s.outputSizeId);
  const palette = useEditorStore((s) => s.palette);
  const titleColor = useEditorStore((s) => s.titleColor);
  const suggestedTitleColor = useEditorStore((s) => s.suggestedTitleColor);
  const titleColorManual = useEditorStore((s) => s.titleColorManual);
  const photoDate = useEditorStore((s) => s.photoDate);
  const photoLocation = useEditorStore((s) => s.photoLocation);
  const analyzing = useEditorStore((s) => s.analyzing);
  const photoCrop = useEditorStore((s) => s.photoCrop);
  const templateOptions = useEditorStore((s) => s.templateOptions);

  const setFilterId = useEditorStore((s) => s.setFilterId);
  const setFilterIntensity = useEditorStore((s) => s.setFilterIntensity);
  const setTitle = useEditorStore((s) => s.setTitle);
  const setFontId = useEditorStore((s) => s.setFontId);
  const setOutputSizeId = useEditorStore((s) => s.setOutputSizeId);
  const setTitleColor = useEditorStore((s) => s.setTitleColor);
  const applySuggestedTitleColor = useEditorStore((s) => s.applySuggestedTitleColor);
  const resetPhotoCrop = useEditorStore((s) => s.resetPhotoCrop);
  const updatePhotoCrop = useEditorStore((s) => s.updatePhotoCrop);
  const setTemplateOptions = useEditorStore((s) => s.setTemplateOptions);

  if (!image) return null;

  const cropDirty =
    photoCrop.zoom !== 1 || photoCrop.panX !== 0 || photoCrop.panY !== 0;

  return (
    <div className="flex flex-col gap-4">
      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">照片滤镜</h2>
        </div>
        <div className="space-y-3 p-3">
          <div className="flex flex-wrap gap-1.5">
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
          {filterId !== 'none' && (
            <label className="block">
              <div className="mb-1 flex items-center justify-between text-[11px] text-ink-muted">
                <span>滤镜强度</span>
                <span className="font-mono text-ink-secondary">{filterIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={filterIntensity}
                onChange={(e) => setFilterIntensity(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </label>
          )}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">构图</h2>
          {cropDirty && (
            <button type="button" onClick={resetPhotoCrop} className="btn-ghost">
              重置
            </button>
          )}
        </div>
        <div className="space-y-3 p-3">
          <label className="block">
            <div className="mb-1 flex items-center justify-between text-[11px] text-ink-muted">
              <span>缩放</span>
              <span className="font-mono text-ink-secondary">{photoCrop.zoom.toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={photoCrop.zoom}
              onChange={(e) => updatePhotoCrop({ zoom: Number(e.target.value) })}
              className="w-full accent-[var(--color-accent)]"
            />
          </label>
          <p className="text-[10px] leading-relaxed text-ink-muted">
            预览区拖拽平移照片，滚轮缩放；导出与预览构图一致。
          </p>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">智能色板</h2>
          {analyzing && <span className="text-[11px] text-ink-muted">分析中…</span>}
        </div>
        <div className="space-y-3 p-3">
          {palette.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {palette.map((swatch) => {
                const active = titleColor.toLowerCase() === swatch.hex.toLowerCase();
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    title={`${swatch.nameZh} · ${swatch.hex}`}
                    onClick={() => setTitleColor(swatch.hex)}
                    className={[
                      'group flex w-[4.5rem] flex-col items-center gap-1 rounded-lg p-1 transition-all',
                      active ? 'ring-2 ring-accent ring-offset-1 ring-offset-studio-surface' : '',
                    ].join(' ')}
                  >
                    <span
                      className="h-8 w-full rounded-md border border-black/10 shadow-sm"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span className="text-[10px] font-medium text-ink-secondary">{swatch.nameZh}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-ink-muted">
              {analyzing ? '正在提取主色…' : '暂未提取到主色'}
            </p>
          )}

          <div className="flex items-center gap-2">
            <label className="flex flex-1 items-center gap-2">
              <span className="shrink-0 text-[11px] text-ink-muted">标题色</span>
              <input
                type="color"
                value={titleColor}
                onChange={(e) => setTitleColor(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-studio-border bg-transparent p-0.5"
              />
              <span className="font-mono text-[11px] text-ink-secondary">{titleColor}</span>
            </label>
            {titleColorManual && suggestedTitleColor !== titleColor && (
              <button type="button" onClick={applySuggestedTitleColor} className="btn-ghost shrink-0">
                用建议色
              </button>
            )}
          </div>
          {!titleColorManual && palette.length > 0 && (
            <p className="text-[10px] text-ink-muted">已按对比度自动建议文字色，点击色块可覆盖</p>
          )}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">主标题</h2>
        </div>
        <div className="space-y-3 p-3">
          {(photoDate || photoLocation) && (
            <p className="rounded-lg bg-studio-muted/60 px-2.5 py-2 text-[10px] leading-relaxed text-ink-muted">
              {photoDate && <span>拍摄 {photoDate}</span>}
              {photoDate && photoLocation && <span> · </span>}
              {photoLocation && <span>{photoLocation}</span>}
            </p>
          )}
          <label className="block">
            <span className="mb-1 block text-[11px] text-ink-muted">文字内容</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={photoLocation || '输入主标题 / 地点'}
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

      {(templateId === 'polaroid' || templateId === 'magazine') && (
        <section className="panel overflow-hidden">
          <div className="panel-header">
            <h2 className="panel-title">模板参数</h2>
          </div>
          <div className="space-y-3 p-3">
            {templateId === 'polaroid' && (
              <>
                <label className="block">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-ink-muted">
                    <span>相纸边距</span>
                    <span className="font-mono text-ink-secondary">{templateOptions.polaroidPadding}%</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={12}
                    value={templateOptions.polaroidPadding}
                    onChange={(e) =>
                      setTemplateOptions({ polaroidPadding: Number(e.target.value) })
                    }
                    className="w-full accent-[var(--color-accent)]"
                  />
                </label>
                <label className="flex items-center justify-between gap-2 text-[11px] text-ink-secondary">
                  <span>显示日期</span>
                  <input
                    type="checkbox"
                    checked={templateOptions.showPolaroidDate}
                    onChange={(e) => setTemplateOptions({ showPolaroidDate: e.target.checked })}
                    className="h-4 w-4 accent-[var(--color-accent)]"
                  />
                </label>
              </>
            )}
            {templateId === 'magazine' && (
              <>
                <label className="block">
                  <span className="mb-1 block text-[11px] text-ink-muted">刊头</span>
                  <input
                    type="text"
                    value={templateOptions.magazineIssue}
                    onChange={(e) => setTemplateOptions({ magazineIssue: e.target.value })}
                    className="w-full rounded-lg border border-studio-border bg-studio-muted/50 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] text-ink-muted">页码</span>
                  <input
                    type="text"
                    value={templateOptions.magazinePage}
                    onChange={(e) => setTemplateOptions({ magazinePage: e.target.value })}
                    className="w-full rounded-lg border border-studio-border bg-studio-muted/50 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] text-ink-muted">副标题</span>
                  <input
                    type="text"
                    value={templateOptions.magazineSubtitle}
                    onChange={(e) => setTemplateOptions({ magazineSubtitle: e.target.value })}
                    placeholder="可选副标题"
                    className="w-full rounded-lg border border-studio-border bg-studio-muted/50 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  />
                </label>
              </>
            )}
          </div>
        </section>
      )}

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
