import { useCallback, useEffect, useRef } from 'react';
import { PHOTO_ZOOM_MAX, PHOTO_ZOOM_MIN, photoCropStyle } from '@/engine/layoutEngine';
import { useEditorStore } from '@/store/editorStore';

type Props = {
  src: string;
  className?: string;
  interactive?: boolean;
  previewScale?: number;
};

export default function CroppedPhoto({
  src,
  className = 'ins-template__photo',
  interactive = false,
  previewScale = 1,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const photoCrop = useEditorStore((s) => s.photoCrop);
  const updatePhotoCrop = useEditorStore((s) => s.updatePhotoCrop);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive) return;
      dragging.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [interactive],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive || !dragging.current) return;
      const scale = Math.max(previewScale, 0.05);
      const sensitivity = 0.004 / scale;
      const latest = useEditorStore.getState().photoCrop;
      updatePhotoCrop({
        panX: latest.panX + e.movementX * sensitivity,
        panY: latest.panY + e.movementY * sensitivity,
      });
    },
    [interactive, previewScale, updatePhotoCrop],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const el = wrapRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const latest = useEditorStore.getState().photoCrop;
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      updatePhotoCrop({
        zoom: Math.min(PHOTO_ZOOM_MAX, Math.max(PHOTO_ZOOM_MIN, latest.zoom + delta)),
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [interactive, updatePhotoCrop]);

  return (
    <div
      ref={wrapRef}
      className={['ins-photo-slot', interactive ? 'ins-photo-slot--interactive' : '']
        .filter(Boolean)
        .join(' ')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img
        src={src}
        alt=""
        className={className}
        crossOrigin="anonymous"
        draggable={false}
        style={photoCropStyle(photoCrop)}
      />
    </div>
  );
}
