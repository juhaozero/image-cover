import type { Template } from '@/types';

export const minimalCard: Template = {
  id: 'minimal_card',
  name: '极简卡片',
  description: '1~3 张大图，大量留白',
  canvas: { width: 1080, height: 1350 },
  slots: [
    { x: 80, y: 120, w: 920, h: 720 },
    { x: 80, y: 900, w: 440, h: 330 },
    { x: 560, y: 900, w: 440, h: 330 },
  ],
  style: {
    background: '#fafafa',
    padding: 40,
    shadow: true,
    borderWidth: 0,
    borderColor: '#ffffff',
  },
};
