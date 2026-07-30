import type {
  InsTemplateId,
  OutputSizeId,
  PhotoFilterId,
  StylePreset,
  TemplateOptions,
  TitleFontId,
} from '@/types';

const STORAGE_KEY = 'ins-puzzle-presets-v1';
const SHARE_PARAM = 'preset';

const FALLBACK_OPTIONS: TemplateOptions = {
  polaroidPadding: 6,
  showPolaroidDate: true,
  magazineIssue: 'Kinfolk · Editorial',
  magazinePage: 'No. 01',
  magazineSubtitle: '',
};

export type PresetSnapshot = Omit<StylePreset, 'id' | 'name' | 'createdAt'>;

export function loadPresets(): StylePreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StylePreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePresets(presets: StylePreset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    /* quota / private mode */
  }
}

export function createPreset(name: string, snapshot: PresetSnapshot): StylePreset {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || '未命名组合',
    createdAt: Date.now(),
    ...snapshot,
  };
}

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodePresetShare(snapshot: PresetSnapshot): string {
  return toBase64Url(JSON.stringify(snapshot));
}

export function decodePresetShare(encoded: string): PresetSnapshot | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as Partial<PresetSnapshot>;
    if (!parsed.templateId || !parsed.filterId || !parsed.fontId) return null;
    return {
      templateId: parsed.templateId as InsTemplateId,
      filterId: parsed.filterId as PhotoFilterId,
      filterIntensity: typeof parsed.filterIntensity === 'number' ? parsed.filterIntensity : 100,
      fontId: parsed.fontId as TitleFontId,
      titleColor: parsed.titleColor || '#1c1917',
      title: parsed.title || '',
      outputSizeId: (parsed.outputSizeId as OutputSizeId) || 'instagram',
      templateOptions: { ...FALLBACK_OPTIONS, ...(parsed.templateOptions ?? {}) },
      paletteDriven: !!parsed.paletteDriven,
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(snapshot: PresetSnapshot): string {
  const url = new URL(window.location.href);
  url.searchParams.set(SHARE_PARAM, encodePresetShare(snapshot));
  return url.toString();
}

export function readShareFromLocation(): PresetSnapshot | null {
  try {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get(SHARE_PARAM);
    if (!encoded) return null;
    return decodePresetShare(encoded);
  } catch {
    return null;
  }
}

export function clearShareParamFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(SHARE_PARAM)) return;
    url.searchParams.delete(SHARE_PARAM);
    window.history.replaceState({}, '', url.toString());
  } catch {
    /* ignore */
  }
}

export const BATCH_EXPORT_SIZES: OutputSizeId[] = ['xiaohongshu', 'instagram'];
