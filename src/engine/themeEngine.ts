import type { ColorSwatch, ThemeColors } from '@/types';

export const DEFAULT_THEME: ThemeColors = {
  background: '#f5f0e8',
  surface: '#ffffff',
  accent: '#c45c26',
  accentSoft: 'rgba(196, 92, 38, 0.18)',
  text: '#1c1917',
  muted: '#78716c',
};

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function mixHex(a: string, b: string, t: number): string {
  const pa = a.replace('#', '');
  const pb = b.replace('#', '');
  const mix = (i: number) => {
    const va = parseInt(pa.slice(i, i + 2), 16);
    const vb = parseInt(pb.slice(i, i + 2), 16);
    return Math.round(va + (vb - va) * t)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${mix(0)}${mix(2)}${mix(4)}`;
}

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 从色板推导模板背景 / 强调 / 文字色 */
export function deriveThemeFromPalette(palette: ColorSwatch[]): ThemeColors {
  if (palette.length === 0) return { ...DEFAULT_THEME };

  const sorted = [...palette].sort((a, b) => luminance(b.hex) - luminance(a.hex));
  const lightest = sorted[0];
  const darkest = sorted[sorted.length - 1];
  const dominant = palette[0];
  const mid = palette[Math.min(1, palette.length - 1)];

  const background = mixHex(lightest.hex, '#ffffff', 0.35);
  const surface = mixHex(lightest.hex, '#ffffff', 0.55);
  const accent = dominant.hex;
  const text = luminance(darkest.hex) < 0.35 ? darkest.hex : '#1c1917';
  const muted = mixHex(mid.hex, '#78716c', 0.45);

  return {
    background,
    surface,
    accent,
    accentSoft: withAlpha(accent, 0.2),
    text,
    muted,
  };
}

export function themeToCssVars(theme: ThemeColors): Record<string, string> {
  return {
    '--tpl-bg': theme.background,
    '--tpl-surface': theme.surface,
    '--tpl-accent': theme.accent,
    '--tpl-accent-soft': theme.accentSoft,
    '--tpl-text': theme.text,
    '--tpl-muted': theme.muted,
  };
}
