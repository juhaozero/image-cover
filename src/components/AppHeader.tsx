import { Logo } from '@/components/icons';
import StepIndicator from './ui/StepIndicator';
import { useEditorStore } from '@/store/editorStore';

export default function AppHeader() {
  const images = useEditorStore((s) => s.images);
  const hasImages = images.length > 0;

  const steps = [
    { id: 1, label: '上传图片', done: hasImages, active: !hasImages },
    { id: 2, label: '选择模板', done: hasImages, active: hasImages },
    { id: 3, label: '导出作品', done: false, active: false },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-studio-border bg-studio-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl shadow-sm"
            aria-hidden
          >
            <Logo size={32} variant="brand" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-ink sm:text-lg">SnapLayout</h1>
            <p className="hidden text-[11px] text-ink-muted sm:block">INS 风拼图工作室</p>
          </div>
        </div>

        <StepIndicator steps={steps} />
      </div>
    </header>
  );
}
