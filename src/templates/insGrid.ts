import type { Template } from '@/types';

const CANVAS = { width: 1080, height: 1080 };
const GAP = 8;
const COLS = 3;
const ROWS = 3;
const CELL = (CANVAS.width - GAP * (COLS + 1)) / COLS;

const slots = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return {
    x: GAP + col * (CELL + GAP),
    y: GAP + row * (CELL + GAP),
    w: CELL,
    h: CELL,
  };
});

export const insGrid: Template = {
  id: 'ins_grid',
  name: 'INS 九宫格',
  description: '3×3 等间距白边网格',
  canvas: CANVAS,
  slots,
  style: {
    background: '#ffffff',
    padding: 0,
    shadow: false,
    borderWidth: 0,
    borderColor: '#ffffff',
  },
};
