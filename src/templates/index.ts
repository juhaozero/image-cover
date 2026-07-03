import type { Template } from '@/types';
import { filmCollage } from './filmCollage';
import { insGrid } from './insGrid';
import { minimalCard } from './minimalCard';
import { storyVertical } from './storyVertical';

export const templates: Template[] = [
  insGrid,
  filmCollage,
  minimalCard,
  storyVertical,
];

export { insGrid, filmCollage, minimalCard, storyVertical };
