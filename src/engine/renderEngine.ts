import type Konva from 'konva';
import type { ImageTransform, Slot, Template, TemplateStyle } from '@/types';
import { computeCoverTransform } from './layoutEngine';

export type RenderSlotConfig = {
  slot: Slot;
  imageSrc: string | null;
  imageWidth: number;
  imageHeight: number;
  transform?: ImageTransform;
  style: TemplateStyle;
};

export function getCanvasDimensions(template: Template, previewScale: number) {
  return {
    width: template.canvas.width * previewScale,
    height: template.canvas.height * previewScale,
    scale: previewScale,
  };
}

export function getBackgroundStyle(style: TemplateStyle): { fill: string } {
  return { fill: style.background };
}

export function getSlotRenderConfig(
  config: RenderSlotConfig,
): {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  clipX: number;
  clipY: number;
  clipWidth: number;
  clipHeight: number;
  imageX: number;
  imageY: number;
  imageWidth: number;
  imageHeight: number;
  shadowEnabled: boolean;
  borderWidth: number;
  borderColor: string;
} {
  const { slot, imageSrc, imageWidth, imageHeight, transform, style } = config;
  const rotation = slot.rotate ?? 0;

  const base = {
    x: slot.x,
    y: slot.y,
    width: slot.w,
    height: slot.h,
    rotation,
    clipX: 0,
    clipY: 0,
    clipWidth: slot.w,
    clipHeight: slot.h,
    shadowEnabled: style.shadow,
    borderWidth: style.borderWidth,
    borderColor: style.borderColor,
    imageX: 0,
    imageY: 0,
    imageWidth: 0,
    imageHeight: 0,
  };

  if (!imageSrc) return base;

  const tf = computeCoverTransform(imageWidth, imageHeight, slot.w, slot.h, transform);
  const scaledW = imageWidth * tf.scale;
  const scaledH = imageHeight * tf.scale;

  return {
    ...base,
    imageX: tf.offsetX,
    imageY: tf.offsetY,
    imageWidth: scaledW,
    imageHeight: scaledH,
  };
}

export function applyStageExportSettings(
  stage: Konva.Stage,
  template: Template,
  pixelRatio: number,
): void {
  stage.width(template.canvas.width);
  stage.height(template.canvas.height);
  stage.scale({ x: 1, y: 1 });
  stage.getLayers().forEach((layer) => {
    layer.scale({ x: 1, y: 1 });
    layer.batchDraw();
  });
  stage.setAttr('pixelRatio', pixelRatio);
}

export function computePreviewScale(
  containerWidth: number,
  template: Template,
  maxHeight = 640,
): number {
  const scaleByWidth = containerWidth / template.canvas.width;
  const scaleByHeight = maxHeight / template.canvas.height;
  return Math.min(scaleByWidth, scaleByHeight, 1);
}
