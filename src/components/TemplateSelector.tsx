import { INS_TEMPLATES } from '@/engine/insTemplateEngine';
import { useEditorStore } from '@/store/editorStore';
import type { InsTemplateId } from '@/types';

export default function TemplateSelector() {
  const templateId = useEditorStore((s) => s.templateId);
  const setTemplateId = useEditorStore((s) => s.setTemplateId);

  return (
    <section className="panel overflow-hidden">
      <div className="panel-header">
        <h2 className="panel-title">INS 模板</h2>
        <span className="text-[10px] text-ink-muted">{INS_TEMPLATES.length} 款</span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        {INS_TEMPLATES.map((t) => {
          const active = templateId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateId(t.id as InsTemplateId)}
              className={[
                'rounded-xl border p-2.5 text-left transition-all',
                active
                  ? 'border-accent bg-accent-soft shadow-sm'
                  : 'border-studio-border bg-studio-muted/40 hover:border-accent-muted',
              ].join(' ')}
              aria-pressed={active}
            >
              <TemplateThumb id={t.id} />
              <p className="mt-2 truncate text-xs font-semibold text-ink">{t.name}</p>
              <p className="truncate text-[10px] text-ink-muted">{t.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TemplateThumb({ id }: { id: InsTemplateId }) {
  const base = 'h-14 w-full overflow-hidden rounded-lg';

  if (id === 'polaroid') {
    return (
      <div className={`${base} bg-stone-200 p-1.5`}>
        <div className="h-[72%] bg-stone-400" />
        <div className="mt-1 mx-auto h-1 w-8 rounded bg-stone-300" />
      </div>
    );
  }
  if (id === 'magazine') {
    return (
      <div className={`${base} flex flex-col bg-[#f4f1ea] p-1.5`}>
        <div className="mb-1 h-px w-full bg-stone-600" />
        <div className="h-[55%] w-[55%] bg-stone-400" />
      </div>
    );
  }
  if (id === 'ccd') {
    return (
      <div className={`${base} relative bg-black p-1 ring-1 ring-white/20`}>
        <div className="h-full bg-stone-500" />
        <span className="absolute bottom-0.5 right-1 text-[6px] text-red-500">REC</span>
      </div>
    );
  }
  if (id === 'y2k') {
    return (
      <div
        className={`${base} flex items-center justify-center`}
        style={{ background: 'linear-gradient(135deg,#ff00ff,#00ffff)' }}
      >
        <div
          className="h-8 w-8 bg-stone-300"
          style={{
            clipPath:
              'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
          }}
        />
      </div>
    );
  }
  if (id === 'cinema') {
    return (
      <div className={`${base} flex flex-col bg-black`}>
        <div className="h-[18%] bg-black" />
        <div className="flex-1 bg-stone-500" />
        <div className="h-[18%] bg-black" />
      </div>
    );
  }
  if (id === 'note') {
    return (
      <div className={`${base} relative flex items-center justify-center bg-[#f3ebe1] p-1.5`}>
        <div className="h-[78%] w-[70%] rotate-1 bg-[#fffaf3] p-1 shadow-sm">
          <div className="h-full bg-stone-400" />
        </div>
        <span className="absolute right-1.5 bottom-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-orange-600 text-[5px] text-white">
          ✦
        </span>
      </div>
    );
  }
  if (id === 'filmstrip') {
    return (
      <div className={`${base} flex bg-neutral-900`}>
        <div className="flex w-[12%] flex-col justify-evenly px-0.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="mx-auto block h-1.5 w-1.5 rounded-[1px] bg-stone-300" />
          ))}
        </div>
        <div className="flex-1 bg-stone-500" />
        <div className="flex w-[12%] flex-col justify-evenly px-0.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="mx-auto block h-1.5 w-1.5 rounded-[1px] bg-stone-300" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={`${base} flex items-center justify-center bg-[#fffdf9] p-1.5`}>
      <div className="h-[80%] w-[70%] rounded-lg bg-stone-300" />
    </div>
  );
}
