import { IconClose, IconPhotoAdd, IconSpinner } from '@/components/icons';
import { useCallback, useRef, useState } from 'react';
import { loadImageFromFile, MAX_IMAGES } from '@/engine/layoutEngine';
import { useEditorStore } from '@/store/editorStore';

export default function Uploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const images = useEditorStore((s) => s.images);
  const template = useEditorStore((s) => s.template);
  const addImages = useEditorStore((s) => s.addImages);
  const removeImage = useEditorStore((s) => s.removeImage);
  const clearImages = useEditorStore((s) => s.clearImages);

  const slotCount = template.slots.length;
  const filledSlots = Math.min(images.length, slotCount);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (imageFiles.length === 0) return;

      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;

      setLoading(true);
      try {
        const toLoad = imageFiles.slice(0, remaining);
        const loaded = await Promise.all(toLoad.map(loadImageFromFile));
        addImages(loaded);
      } finally {
        setLoading(false);
      }
    },
    [images.length, addImages],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  return (
    <section className="panel animate-fade-in overflow-hidden">
      <div className="panel-header">
        <h2 className="panel-title">素材</h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-studio-muted px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
            {images.length}/{MAX_IMAGES}
          </span>
          {images.length > 0 && (
            <button type="button" onClick={clearImages} className="btn-ghost text-red-400 hover:text-red-500">
              清空
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 p-3">
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
          className={['upload-zone px-4 py-6', dragging ? 'upload-zone-active' : ''].join(' ')}
          aria-label="上传图片区域，支持点击或拖拽"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <IconSpinner size={24} className="animate-spin text-accent" />
              <p className="text-xs font-medium text-ink-secondary">处理图片中…</p>
            </div>
          ) : (
            <>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
                <IconPhotoAdd size={22} className="text-accent" />
              </div>
              <p className="text-sm font-semibold text-ink">添加照片</p>
              <p className="mt-0.5 text-center text-[11px] leading-relaxed text-ink-muted">
                拖拽或点击 · JPG / PNG / WebP
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) processFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {images.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-ink-muted">已填充 {filledSlots}/{slotCount} 格</span>
              <div className="h-1.5 flex-1 mx-3 overflow-hidden rounded-full bg-studio-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-rose-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (filledSlots / slotCount) * 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-studio-border transition-all hover:ring-accent-muted"
                >
                  <img
                    src={img.src}
                    alt={`素材 ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-black/60 text-[10px] text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus:opacity-100"
                    aria-label={`删除第 ${i + 1} 张图片`}
                  >
                    <IconClose size={12} />
                  </button>
                  <span className="absolute bottom-0.5 left-0.5 flex h-4 min-w-[16px] items-center justify-center rounded bg-black/50 px-1 text-[9px] font-bold text-white backdrop-blur-sm">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
