import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import AppHeader from './AppHeader';
import Uploader from './Uploader';
import TemplateSelector from './TemplateSelector';
import ControlPanel from './ControlPanel';
import PresetPanel from './PresetPanel';
import InsPreview from './InsPreview';
import ExportDock from './ExportButton';

export default function Editor() {
  const exportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hydrateFromShareUrl = useEditorStore((s) => s.hydrateFromShareUrl);
  const pickPhoto = () => inputRef.current?.click();

  useEffect(() => {
    hydrateFromShareUrl();
  }, [hydrateFromShareUrl]);

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="studio-wrap flex flex-1 flex-col pb-6">
        <div className="workspace-intro">
          <div>
            <div className="studio-label mb-2 flex items-center gap-2 text-accent">
              <span className="h-px w-5 bg-accent" aria-hidden="true" />
              THE COLLAGE WORKSPACE
            </div>
            <h1 className="workspace-title">拼图工作台</h1>
          </div>
          <p className="text-sm leading-relaxed text-ink-secondary">上传照片，选一款模板，做成属于你的相纸。</p>
        </div>
        <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-start-1">
            <Uploader inputRef={inputRef} />
            <TemplateSelector />
          </div>
          <InsPreview ref={exportRef} onPickPhoto={pickPhoto} />
          <aside aria-label="更多编辑设置" className="flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-start-2">
            <ControlPanel />
            <PresetPanel />
          </aside>
        </div>
      </main>
      <ExportDock exportRef={exportRef} />
    </div>
  );
}
