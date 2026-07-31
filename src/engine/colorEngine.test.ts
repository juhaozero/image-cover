import { describe, expect, it } from 'vitest';
import type { ColorSwatch } from '@/types';
import {
  getColorName,
  getFilterMatrix,
  interpolateFilterMatrix,
  pickTextColor,
  type FilterMatrix,
} from './colorEngine';

function swatch(
  hex: string,
  rgb: [number, number, number],
  overrides: Partial<ColorSwatch> = {},
): ColorSwatch {
  return {
    hex,
    rgb,
    nameZh: '测试',
    nameEn: 'Test',
    ratio: 0.5,
    ...overrides,
  };
}

const IDENTITY: FilterMatrix = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
];

describe('getColorName', () => {
  it('低饱和深色归为墨黑', () => {
    expect(getColorName(20, 20, 20)).toEqual({ zh: '墨黑', en: 'Ink' });
  });

  it('低饱和浅色归为云白', () => {
    expect(getColorName(240, 240, 240)).toEqual({ zh: '云白', en: 'Cloud' });
  });

  it('低饱和中性色归为烟灰', () => {
    expect(getColorName(120, 120, 120)).toEqual({ zh: '烟灰', en: 'Slate' });
  });

  it('按色相映射中文色名', () => {
    expect(getColorName(220, 40, 40).zh).toBe('暮霞');
    expect(getColorName(255, 140, 60).zh).toBe('珊瑚');
    expect(getColorName(40, 160, 80).zh).toBe('松针');
    expect(getColorName(20, 160, 180).zh).toBe('海蓝');
    expect(getColorName(40, 70, 210).zh).toBe('靛青');
    expect(getColorName(120, 60, 200).zh).toBe('暮紫');
  });
});

describe('interpolateFilterMatrix', () => {
  const film = getFilterMatrix('film')!;

  it('强度 0 返回 identity', () => {
    expect(interpolateFilterMatrix(film, 0)).toEqual(IDENTITY);
  });

  it('强度 100 返回目标矩阵副本', () => {
    const result = interpolateFilterMatrix(film, 100);
    expect(result).toEqual(film);
    expect(result).not.toBe(film);
  });

  it('强度 50 在 identity 与目标之间线性插值', () => {
    const result = interpolateFilterMatrix(film, 50);
    expect(result[0]).toBeCloseTo(IDENTITY[0] + (film[0] - IDENTITY[0]) * 0.5);
    expect(result[4]).toBeCloseTo(IDENTITY[4] + (film[4] - IDENTITY[4]) * 0.5);
    expect(result[6]).toBeCloseTo(IDENTITY[6] + (film[6] - IDENTITY[6]) * 0.5);
  });

  it('强度越界会被钳制到 0–100', () => {
    expect(interpolateFilterMatrix(film, -20)).toEqual(IDENTITY);
    expect(interpolateFilterMatrix(film, 150)).toEqual(film);
  });

  it('未知滤镜 id 返回 null', () => {
    expect(getFilterMatrix('none')).toBeNull();
    expect(getFilterMatrix('not-a-filter')).toBeNull();
  });
});

describe('pickTextColor', () => {
  it('从色板中选出对比度最高的色', () => {
    const palette = [
      swatch('#333333', [51, 51, 51]),
      swatch('#f5f5f5', [245, 245, 245]),
      swatch('#888888', [136, 136, 136]),
    ];
    expect(pickTextColor('#1a1a1a', palette)).toBe('#f5f5f5');
  });

  it('浅色背景优先选深色色板项', () => {
    const palette = [
      swatch('#eeeeee', [238, 238, 238]),
      swatch('#111111', [17, 17, 17]),
    ];
    expect(pickTextColor('#faf7f4', palette)).toBe('#111111');
  });

  it('对比度不足 4.5 时：深底回退浅字', () => {
    const palette = [swatch('#222222', [34, 34, 34])];
    expect(pickTextColor('#1c1917', palette)).toBe('#faf7f4');
  });

  it('对比度不足 4.5 时：浅底回退深字', () => {
    const palette = [swatch('#f0f0f0', [240, 240, 240])];
    expect(pickTextColor('#faf7f4', palette)).toBe('#1c1917');
  });

  it('空色板时按背景明度回退', () => {
    expect(pickTextColor('#ffffff', [])).toBe('#1c1917');
    expect(pickTextColor('#000000', [])).toBe('#faf7f4');
  });
});
