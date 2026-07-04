import { IconClose, IconPhotoAdd, IconSpinner } from '@/components/icons';
import { useCallback, useRef, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';

export default function Uploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const image = useEditorStore((s) => s.image);
  const setImage = useEditorStore((s) => s.setImage);
  const clearImage = useEditorStore((s) => s.clearImage);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      setLoading(true);
      try {
        await setImage(file);
      } finally {
        setLoading(false);
      }
    },
    [setImage],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  return (
    <section className="panel overflow-hidden">
      <div className="panel-header">
        <h2 className="panel-title">上传照片</h2>
        {image && (
          <button type="button" onClick={clearImage} className="btn-ghost text-red-500">
            更换
          </button>
        )}
      </div>

      <div className="p-3">
        {!image ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={['upload-zone px-4 py-8', dragging ? 'upload-zone-active' : ''].join(' ')}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <IconSpinner size={24} className="animate-spin text-accent" />
                <p className="text-xs font-medium text-ink-secondary">取色分析中…</p>
              </div>
            ) : (
              <>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-lg">
                  📷
                </div>
                <p className="text-sm font-semibold text-ink">点击或拖入照片</p>
                <p className="mt-0.5 text-center text-[11px] text-ink-muted">JPG / PNG / HEIC</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
                e.target.value = '';
              }}
            />
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl ring-1 ring-studio-border">
            <img src={image.src} alt="已上传" className="aspect-[3/4] w-full object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm"
              aria-label="更换照片"
            >
              <IconClose size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
