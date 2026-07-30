import { IconClose, IconPhotoAdd, IconSpinner } from '@/components/icons';
import { useCallback, useRef, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function isSupportedImage(file: File): boolean {
  if (ACCEPTED_TYPES.has(file.type)) return true;
  // 部分环境可能拿不到 MIME，按扩展名兜底
  return /\.(jpe?g|png|webp|gif)$/i.test(file.name);
}

export default function Uploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const image = useEditorStore((s) => s.image);
  const setImage = useEditorStore((s) => s.setImage);
  const clearImage = useEditorStore((s) => s.clearImage);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!isSupportedImage(file)) {
        setError('暂不支持该格式，请使用 JPG / PNG / WebP');
        return;
      }
      setLoading(true);
      try {
        await setImage(file);
      } catch {
        setError('照片读取失败，请换一张图再试');
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

  const handleClear = () => {
    setError(null);
    clearImage();
  };

  return (
    <section className="panel overflow-hidden">
      <div className="panel-header">
        <h2 className="panel-title">上传照片</h2>
        {image && (
          <button type="button" onClick={handleClear} className="btn-ghost text-red-500">
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
                <p className="text-xs font-medium text-ink-secondary">读取照片中…</p>
              </div>
            ) : (
              <>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-ink-secondary">
                  <IconPhotoAdd size={20} />
                </div>
                <p className="text-sm font-semibold text-ink">点击或拖入照片</p>
                <p className="mt-0.5 text-center text-[11px] text-ink-muted">JPG / PNG / WebP</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
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
              onClick={handleClear}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm"
              aria-label="更换照片"
            >
              <IconClose size={14} />
            </button>
          </div>
        )}
        {error && (
          <p className="mt-2 text-center text-[11px] text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
