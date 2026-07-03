import type { Template } from '@/types';

export const filmCollage: Template = {
  id: 'film_collage',
  name: '胶片拼贴',
  description: '不规则布局，轻微旋转重叠',
  canvas: { width: 1080, height: 1350 },
  slots: [
    { x: 40, y: 60, w: 480, h: 640, rotate: -3 },
    { x: 520, y: 120, w: 480, h: 640, rotate: 2 },
    { x: 80, y: 720, w: 420, h: 520, rotate: -2 },
    { x: 480, y: 680, w: 520, h: 580, rotate: 3 },
    { x: 280, y: 380, w: 360, h: 280, rotate: 1 },
  ],
  style: {
    background: '#f5f0e8',
    padding: 24,
    shadow: true,
    borderWidth: 8,
    borderColor: '#ffffff',
  },
};
