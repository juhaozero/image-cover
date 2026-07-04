import { useEditorStore } from '@/store/editorStore';

export default function AppHeader() {
  const image = useEditorStore((s) => s.image);

  return (
    <header className="sticky top-0 z-40 border-b border-studio-border bg-studio-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-lg shadow-sm">
            🎨
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-ink sm:text-lg">Ins拼图</h1>
            <p className="hidden text-[11px] text-ink-muted sm:block">
              上传照片，选择 INS 风模板生成拼图
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 text-[11px] text-ink-muted sm:flex">
          <span className={image ? 'text-emerald-600' : ''}>
            {image ? '● 已加载照片' : '○ 等待上传'}
          </span>
          <span>·</span>
          <span>本地处理 · 免费</span>
        </div>
      </div>
    </header>
  );
}
