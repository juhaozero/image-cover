import { useEditorStore } from '@/store/editorStore';

export default function AppHeader() {
  const image = useEditorStore((s) => s.image);

  return (
    <header className="border-b border-studio-border bg-studio-surface">
      <div className="studio-wrap flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
              <path d="m5 15-2-9 12-3 2 7" />
              <rect x="7" y="8" width="14" height="13" rx="2" />
              <path d="m7 18 4.5-4 3.2 2.8 2.6-2.2 3.7 3.1" />
              <circle cx="16.5" cy="11.7" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <p className="text-lg font-bold tracking-tight">Ins拼图</p>
          <span className="studio-label hidden border-l border-studio-border pl-3 sm:block">PHOTO STUDIO</span>
        </div>
        <span className="status-chip" role="status">
          <span className={image ? 'status-dot status-dot-ready' : 'status-dot'} />
          {image ? '照片已载入' : '等待上传'}
        </span>
      </div>
    </header>
  );
}
