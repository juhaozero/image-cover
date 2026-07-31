import { describe, expect, it } from 'vitest';
import { resolveCanvasSize } from './insTemplateEngine';

describe('resolveCanvasSize', () => {
  it('自由尺寸：横图以长边 1350 为宽', () => {
    expect(resolveCanvasSize('free', 4000, 3000)).toEqual({
      width: 1350,
      height: 1013,
    });
  });

  it('自由尺寸：竖图以长边 1350 为高', () => {
    expect(resolveCanvasSize('free', 1080, 1920)).toEqual({
      width: 759,
      height: 1350,
    });
  });

  it('自由尺寸：正方形返回 1350×1350', () => {
    expect(resolveCanvasSize('free', 2000, 2000)).toEqual({
      width: 1350,
      height: 1350,
    });
  });

  it('预设尺寸直接返回固定宽高', () => {
    expect(resolveCanvasSize('xiaohongshu', 100, 100)).toEqual({
      width: 1080,
      height: 1440,
    });
    expect(resolveCanvasSize('instagram', 100, 100)).toEqual({
      width: 1080,
      height: 1350,
    });
    expect(resolveCanvasSize('square', 100, 100)).toEqual({
      width: 1080,
      height: 1080,
    });
    expect(resolveCanvasSize('wallpaper', 100, 100)).toEqual({
      width: 1080,
      height: 1920,
    });
    expect(resolveCanvasSize('postcard', 100, 100)).toEqual({
      width: 1800,
      height: 1200,
    });
  });

  it('未知 id 回退到自由尺寸逻辑', () => {
    expect(resolveCanvasSize('unknown' as 'free', 1920, 1080)).toEqual({
      width: 1350,
      height: 759,
    });
  });
});
