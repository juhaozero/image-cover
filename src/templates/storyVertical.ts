import type { Template } from '@/types';

const CANVAS = { width: 1080, height: 1920 };
const GAP = 12;

export const storyVertical: Template = {
  id: 'story_vertical',
  name: 'Story 竖版',
  description: '9:16 竖版，适合 Instagram Story',
  canvas: CANVAS,
  slots: [
    { x: GAP, y: GAP, w: CANVAS.width - GAP * 2, h: 900 },
    { x: GAP, y: 920, w: (CANVAS.width - GAP * 3) / 2, h: 480 },
    { x: GAP * 2 + (CANVAS.width - GAP * 3) / 2, y: 920, w: (CANVAS.width - GAP * 3) / 2, h: 480 },
    { x: GAP, y: 1420, w: CANVAS.width - GAP * 2, h: CANVAS.height - 1420 - GAP },
  ],
  style: {
    background: '#1a1a1a',
    padding: 0,
    shadow: false,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
};
