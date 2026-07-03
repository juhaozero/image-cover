import { useRef } from 'react';
import type Konva from 'konva';
import AppHeader from './AppHeader';
import Uploader from './Uploader';
import TemplateSelector from './TemplateSelector';
import EditorCanvas from './EditorCanvas';
import ExportDock from './ExportButton';

export default function Editor() {
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 p-4 sm:gap-0 sm:p-0 lg:flex-row">
        {/* 左侧素材栏 */}
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[300px] lg:border-r lg:border-studio-border lg:bg-studio-surface/50 lg:p-4 xl:w-[320px]">
          <Uploader />
          <TemplateSelector />
        </aside>

        {/* 中央画布区 */}
        <div className="flex min-h-0 flex-1 flex-col">
          <EditorCanvas stageRef={stageRef} />
        </div>
      </main>

      <ExportDock stageRef={stageRef} />
    </div>
  );
}
