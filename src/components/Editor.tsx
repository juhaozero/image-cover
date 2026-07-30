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
  const hydrateFromShareUrl = useEditorStore((s) => s.hydrateFromShareUrl);

  useEffect(() => {
    hydrateFromShareUrl();
  }, [hydrateFromShareUrl]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-r border-studio-border bg-studio-surface/50 p-4 lg:w-[340px] xl:w-[380px] lg:max-h-[calc(100vh-4rem)]">
          <Uploader />
          <TemplateSelector />
          <ControlPanel />
          <PresetPanel />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <InsPreview ref={exportRef} />
        </div>
      </main>

      <ExportDock exportRef={exportRef} />
    </div>
  );
}
