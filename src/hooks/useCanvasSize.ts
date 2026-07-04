import { useMemo } from 'react';
import { resolveCanvasSize } from '@/engine/insTemplateEngine';
import { useEditorStore } from '@/store/editorStore';
import type { CanvasSize } from '@/types';

export function useCanvasSize(): CanvasSize | null {
  const image = useEditorStore((s) => s.image);
  const outputSizeId = useEditorStore((s) => s.outputSizeId);

  return useMemo(() => {
    if (!image) return null;
    return resolveCanvasSize(outputSizeId, image.width, image.height);
  }, [image, outputSizeId]);
}
