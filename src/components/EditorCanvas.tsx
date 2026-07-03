import { IconCanvasEmpty, IconMove, IconZoom } from '@/components/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Group, Image as KonvaImage } from 'react-konva';
import type Konva from 'konva';
import {
  computePreviewScale,
  getBackgroundStyle,
  getSlotRenderConfig,
} from '@/engine/renderEngine';
import { computeCoverTransform } from '@/engine/layoutEngine';
import { useEditorStore } from '@/store/editorStore';
import type { ImageTransform, SlotMapping } from '@/types';

function useLoadedImage(src: string | undefined): HTMLImageElement | undefined {
  const [image, setImage] = useState<HTMLImageElement | undefined>();

  useEffect(() => {
    if (!src) {
      setImage(undefined);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = src;
    return () => {
      img.onload = null;
    };
  }, [src]);

  return image;
}

function SlotImage({
  mapping,
  style,
  slotScale,
  transform,
  onTransformChange,
}: {
  mapping: SlotMapping;
  style: ReturnType<typeof useEditorStore.getState>['template']['style'];
  slotScale: number;
  transform?: ImageTransform;
  onTransformChange: (slotIndex: number, t: ImageTransform) => void;
}) {
  const image = useLoadedImage(mapping.image?.src);
  const groupRef = useRef<Konva.Group>(null);

  const effectiveTransform =
    transform ??
    (mapping.image
      ? computeCoverTransform(
          mapping.image.width,
          mapping.image.height,
          mapping.slot.w,
          mapping.slot.h,
        )
      : undefined);

  const config = getSlotRenderConfig({
    slot: mapping.slot,
    imageSrc: mapping.image?.src ?? null,
    imageWidth: mapping.image?.width ?? 0,
    imageHeight: mapping.image?.height ?? 0,
    transform: effectiveTransform,
    style,
  });

  if (!mapping.image || !image) {
    return (
      <Group x={config.x} y={config.y} rotation={config.rotation}>
        <Rect
          width={config.width}
          height={config.height}
          fill="#3f3f46"
          stroke="#52525b"
          strokeWidth={1}
          dash={[8, 6]}
        />
      </Group>
    );
  }

  return (
    <Group
      ref={groupRef}
      x={config.x}
      y={config.y}
      rotation={config.rotation}
      draggable
      onDragEnd={() => {
        const node = groupRef.current;
        if (!node || !effectiveTransform) return;
        const dx = node.x() - config.x;
        const dy = node.y() - config.y;
        onTransformChange(mapping.slotIndex, {
          ...effectiveTransform,
          offsetX: effectiveTransform.offsetX + dx / slotScale,
          offsetY: effectiveTransform.offsetY + dy / slotScale,
        });
        node.position({ x: config.x, y: config.y });
      }}
      onWheel={(e) => {
        e.evt.preventDefault();
        if (!effectiveTransform) return;
        const scaleBy = e.evt.deltaY > 0 ? 0.95 : 1.05;
        onTransformChange(mapping.slotIndex, {
          ...effectiveTransform,
          scale: effectiveTransform.scale * scaleBy,
        });
      }}
    >
      <Group
        clipX={config.clipX}
        clipY={config.clipY}
        clipWidth={config.clipWidth}
        clipHeight={config.clipHeight}
      >
        {config.shadowEnabled && (
          <Rect
            x={4}
            y={4}
            width={config.width}
            height={config.height}
            fill="black"
            opacity={0.15}
          />
        )}
        <KonvaImage
          x={config.imageX}
          y={config.imageY}
          width={config.imageWidth}
          height={config.imageHeight}
          image={image}
        />
        {config.borderWidth > 0 && (
          <Rect
            width={config.width}
            height={config.height}
            stroke={config.borderColor}
            strokeWidth={config.borderWidth}
            listening={false}
          />
        )}
      </Group>
    </Group>
  );
}

function EmptyCanvasState() {
  return (
    <div className="pointer-events-none flex flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <IconCanvasEmpty size={36} className="text-white/35" />
      </div>
      <p className="text-sm font-medium text-white/50">画布预览区</p>
      <p className="mt-1 max-w-[200px] text-xs leading-relaxed text-white/30">
        从左侧上传照片并选择模板，拼图将在此实时呈现
      </p>
    </div>
  );
}

type Props = {
  stageRef: React.RefObject<Konva.Stage | null>;
};

export default function EditorCanvas({ stageRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const template = useEditorStore((s) => s.template);
  const images = useEditorStore((s) => s.images);
  const mappings = useEditorStore((s) => s.mappings);
  const transforms = useEditorStore((s) => s.transforms);
  const updateTransform = useEditorStore((s) => s.updateTransform);
  const [slotScale, setSlotScale] = useState(0.5);

  const hasContent = images.length > 0;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setSlotScale(computePreviewScale(el.clientWidth - 64, template, 720));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [template]);

  const stageWidth = template.canvas.width * slotScale;
  const stageHeight = template.canvas.height * slotScale;
  const bg = getBackgroundStyle(template.style);

  const handleTransformChange = useCallback(
    (slotIndex: number, t: ImageTransform) => updateTransform(slotIndex, t),
    [updateTransform],
  );

  return (
    <section className="flex min-h-0 flex-1 flex-col lg:min-h-[calc(100vh-8rem)]">
      {/* 画布工具栏 */}
      <div className="flex items-center justify-between border-b border-studio-border px-4 py-3 lg:px-6">
        <div>
          <h2 className="text-sm font-semibold text-ink">{template.name}</h2>
          <p className="text-[11px] text-ink-muted">
            {template.canvas.width} × {template.canvas.height} px · {template.slots.length} 格
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-lg bg-studio-muted px-2.5 py-1.5 sm:flex">
            <IconMove size={14} className="text-ink-muted" />
            <span className="text-[11px] text-ink-muted">拖拽移动</span>
          </div>
          <div className="hidden items-center gap-1.5 rounded-lg bg-studio-muted px-2.5 py-1.5 sm:flex">
            <IconZoom size={14} className="text-ink-muted" />
            <span className="text-[11px] text-ink-muted">滚轮缩放</span>
          </div>
        </div>
      </div>

      {/* 画布暗房背景 */}
      <div
        ref={containerRef}
        className="canvas-matte relative flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-12"
      >
        {!hasContent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <EmptyCanvasState />
          </div>
        )}

        <div
          className={[
            'relative animate-slide-up overflow-hidden rounded-lg shadow-canvas ring-1 ring-white/10 transition-opacity duration-300',
            hasContent ? 'opacity-100' : 'opacity-30',
          ].join(' ')}
          style={{ width: stageWidth, height: stageHeight }}
        >
          <Stage
            ref={stageRef}
            width={stageWidth}
            height={stageHeight}
            scaleX={slotScale}
            scaleY={slotScale}
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={template.canvas.width}
                height={template.canvas.height}
                fill={bg.fill}
              />
              {mappings.map((mapping) => (
                <SlotImage
                  key={mapping.slotIndex}
                  mapping={mapping}
                  style={template.style}
                  slotScale={slotScale}
                  transform={transforms[mapping.slotIndex]}
                  onTransformChange={handleTransformChange}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </section>
  );
}
