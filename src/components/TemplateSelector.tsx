import { IconCheck } from '@/components/icons';
import { getAllTemplates } from '@/engine/templateEngine';
import { useEditorStore } from '@/store/editorStore';

const allTemplates = getAllTemplates();

export default function TemplateSelector() {
  const template = useEditorStore((s) => s.template);
  const setTemplate = useEditorStore((s) => s.setTemplate);

  return (
    <section className="panel animate-fade-in overflow-hidden">
      <div className="panel-header">
        <h2 className="panel-title">模板</h2>
        <span className="text-[10px] text-ink-muted">{allTemplates.length} 款风格</span>
      </div>

      <div className="space-y-2 p-3">
        {allTemplates.map((t) => {
          const active = template.id === t.id;
          const aspect = t.canvas.width / t.canvas.height;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t)}
              className={[
                'group flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-200',
                active
                  ? 'border-accent bg-accent-soft shadow-sm'
                  : 'border-transparent bg-studio-muted/60 hover:border-studio-border hover:bg-studio-muted',
              ].join(' ')}
              aria-pressed={active}
            >
              <div
                className={[
                  'relative shrink-0 overflow-hidden rounded-lg ring-1',
                  active ? 'ring-accent/30' : 'ring-studio-border',
                ].join(' ')}
                style={{ width: 52, aspectRatio: String(aspect) }}
              >
                <TemplateThumb templateId={t.id} />
                {active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-accent/10">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                      <IconCheck size={12} className="text-white" />
                    </div>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{t.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-ink-muted">{t.description}</p>
                <p className="mt-1 text-[10px] font-medium text-ink-faint">
                  {t.slots.length} 格 · {t.canvas.width}×{t.canvas.height}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TemplateThumb({ templateId }: { templateId: string }) {
  if (templateId === 'ins_grid') {
    return (
      <div className="grid h-full grid-cols-3 grid-rows-3 gap-px bg-white p-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-stone-300" />
        ))}
      </div>
    );
  }

  if (templateId === 'film_collage') {
    return (
      <div className="relative h-full bg-amber-50">
        <div className="absolute left-0.5 top-1 h-5 w-6 -rotate-6 bg-stone-300 shadow-sm" />
        <div className="absolute right-0.5 top-2 h-5 w-6 rotate-3 bg-stone-400 shadow-sm" />
        <div className="absolute bottom-1 left-1 h-4 w-5 -rotate-2 bg-stone-300" />
        <div className="absolute bottom-0.5 right-0.5 h-4 w-6 rotate-6 bg-stone-400" />
      </div>
    );
  }

  if (templateId === 'minimal_card') {
    return (
      <div className="flex h-full flex-col gap-px bg-stone-100 p-1">
        <div className="flex-[2] bg-stone-300" />
        <div className="flex flex-1 gap-px">
          <div className="flex-1 bg-stone-300" />
          <div className="flex-1 bg-stone-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-px bg-stone-800 p-0.5">
      <div className="h-[45%] bg-stone-500" />
      <div className="flex flex-1 gap-px">
        <div className="flex-1 bg-stone-500" />
        <div className="flex-1 bg-stone-500" />
      </div>
      <div className="h-[20%] bg-stone-500" />
    </div>
  );
}
