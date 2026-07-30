import { useEffect, useState } from 'react';
import { buildShareUrl } from '@/engine/presetEngine';
import { getFontById, getTemplateById, PHOTO_FILTERS } from '@/engine/insTemplateEngine';
import { useEditorStore } from '@/store/editorStore';

export default function PresetPanel() {
  const savedPresets = useEditorStore((s) => s.savedPresets);
  const saveCurrentPreset = useEditorStore((s) => s.saveCurrentPreset);
  const deletePreset = useEditorStore((s) => s.deletePreset);
  const applyPreset = useEditorStore((s) => s.applyPreset);
  const getPresetSnapshot = useEditorStore((s) => s.getPresetSnapshot);
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  const handleSave = () => {
    saveCurrentPreset(name);
    setName('');
    setMessage('已收藏当前组合');
  };

  const handleCopyShare = async () => {
    try {
      const url = buildShareUrl(getPresetSnapshot());
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setMessage(null);
    } catch {
      setMessage('复制失败，请手动复制地址栏');
    }
  };

  return (
    <section className="panel overflow-hidden">
      <div className="panel-header">
        <h2 className="panel-title">风格收藏</h2>
        <span className="text-[10px] text-ink-muted">{savedPresets.length} 个</span>
      </div>
      <div className="space-y-3 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="组合名称"
            className="min-w-0 flex-1 rounded-lg border border-studio-border bg-studio-muted/50 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <button type="button" onClick={handleSave} className="btn-ghost shrink-0">
            收藏
          </button>
        </div>
        <button type="button" onClick={handleCopyShare} className="btn-ghost w-full justify-center">
          {copied ? '链接已复制' : '复制分享链接'}
        </button>
        {message && <p className="text-[10px] text-ink-muted">{message}</p>}

        {savedPresets.length > 0 ? (
          <ul className="max-h-48 space-y-1.5 overflow-y-auto">
            {savedPresets.map((preset) => {
              const tpl = getTemplateById(preset.templateId);
              const filter = PHOTO_FILTERS.find((f) => f.id === preset.filterId)?.label ?? '原图';
              const font = getFontById(preset.fontId).label;
              return (
                <li
                  key={preset.id}
                  className="flex items-start gap-2 rounded-lg border border-studio-border bg-studio-muted/30 px-2.5 py-2"
                >
                  <button
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-xs font-semibold text-ink">{preset.name}</p>
                    <p className="truncate text-[10px] text-ink-muted">
                      {tpl.name} · {filter} · {font}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePreset(preset.id)}
                    className="shrink-0 text-[10px] text-red-500 hover:underline"
                  >
                    删除
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[11px] text-ink-muted">收藏模板 + 滤镜 + 字体组合，下次一键套用。</p>
        )}
      </div>
    </section>
  );
}
