import { INS_TEMPLATES } from '@/engine/insTemplateEngine';
import { useEditorStore } from '@/store/editorStore';
import { IconCheck } from './icons';
import { TemplateThumb } from './PhotoArtwork';

export default function TemplateSelector() {
  const templateId = useEditorStore((s) => s.templateId);
  const setTemplateId = useEditorStore((s) => s.setTemplateId);

  return (
    <section className="panel" aria-labelledby="templates-heading">
      <div className="panel-header">
        <h2 id="templates-heading" className="panel-title"><span className="step-number" aria-hidden="true">02</span>INS 模板</h2>
        <span className="studio-label rounded-md bg-studio-muted px-2 py-1">{INS_TEMPLATES.length} 款</span>
      </div>

      <div className="grid grid-cols-2 gap-2 px-3.5 pb-3.5 sm:max-lg:grid-cols-4">
        {INS_TEMPLATES.map((template) => {
          const active = templateId === template.id;
          return (
            <button
              key={template.id}
              type="button"
              className="template-card"
              aria-pressed={active}
              onClick={() => setTemplateId(template.id)}
            >
              <TemplateThumb id={template.id} />
              {active && <span className="template-check"><IconCheck size={11} /></span>}
              <span className="mt-1.5 block text-xs font-semibold">{template.name}</span>
              <span className="mt-0.5 block text-[10px] leading-snug text-ink-muted">{template.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
