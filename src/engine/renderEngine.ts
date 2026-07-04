export function computePreviewScale(
  containerWidth: number,
  canvasWidth: number,
  canvasHeight: number,
  maxHeight = 640,
): number {
  const scaleByWidth = containerWidth / canvasWidth;
  const scaleByHeight = maxHeight / canvasHeight;
  return Math.min(scaleByWidth, scaleByHeight, 1);
}
