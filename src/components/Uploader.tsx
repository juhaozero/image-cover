import { useRef, useState, type RefObject } from 'react';
import { IconClose, IconPhotoAdd, IconSpinner } from '@/components/icons';
import { useEditorStore } from '@/store/editorStore';

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export default function Uploader({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const processing = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const image = useEditorStore((s) => s.image);
  const setImage = useEditorStore((s) => s.setImage);
  const clearImage = useEditorStore((s) => s.clearImage);

  const processFile = async (file: File) => {
    if (processing.current) return;
    setError(null);
    if (!ACCEPTED_TYPES.has(file.type) && !/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
      setError('暂不支持该格式，请使用 JPG、PNG、WebP 或 GIF。');
      return;
    }
    processing.current = true;
    setLoading(true);
    try {
      await setImage(file);
    } catch {
      setError('照片读取失败，请换一张再试。');
    } finally {
      setLoading(false);
      processing.current = false;
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title"><span className="step-number" aria-hidden="true">01</span>上传照片</h2>
      </div>
      <div className="px-3.5 pb-3.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          disabled={loading}
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            e.currentTarget.value = '';
            if (file) void processFile(file);
          }}
        />
        <button
          type="button"
          className={`upload-zone w-full ${dragging ? 'upload-zone-active' : ''}`}
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) void processFile(file);
          }}
        >
          <span className="upload-icon">
            {loading ? <IconSpinner size={21} className="animate-spin" /> : image
              ? <img src={image.src} alt="" className="size-full rounded-lg object-cover" />
              : <IconPhotoAdd size={22} />}
          </span>
          <span className="text-sm font-semibold">{loading ? '读取照片中…' : image ? '更换照片' : '点击或拖入照片'}</span>
          <span className="mt-1 text-xs text-ink-muted">JPG、PNG、WebP、GIF</span>
        </button>
        {image && (
          <button type="button" disabled={loading} onClick={() => { clearImage(); setError(null); }} className="btn-ghost mt-2">
            <IconClose size={14} /> 移除照片
          </button>
        )}
        {error && <p className="mt-2 text-xs text-red-700" role="alert">{error}</p>}
      </div>
    </section>
  );
}
