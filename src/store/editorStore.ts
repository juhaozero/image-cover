import { create } from 'zustand';
import { clearFilterCache, extractColorsFromImage, pickTextColor } from '@/engine/colorEngine';
import { extractPhotoMeta } from '@/engine/exifEngine';
import { INS_TEMPLATES, resolveCanvasSize } from '@/engine/insTemplateEngine';
import { clampPhotoCrop, DEFAULT_PHOTO_CROP, loadImageFromFile } from '@/engine/layoutEngine';
import {
  clearShareParamFromUrl,
  createPreset,
  loadPresets,
  type PresetSnapshot,
  readShareFromLocation,
  savePresets,
} from '@/engine/presetEngine';
import { DEFAULT_THEME, deriveThemeFromPalette } from '@/engine/themeEngine';
import type {
  CanvasSize,
  ColorSwatch,
  EditorImage,
  ExportFormat,
  ExportScale,
  InsTemplateId,
  OutputSizeId,
  PhotoCrop,
  PhotoFilterId,
  StylePreset,
  TemplateOptions,
  ThemeColors,
  TitleFontId,
} from '@/types';

const PAPER_BG = '#f5f0e8';
const DEFAULT_TITLE_COLOR = '#1c1917';

export const DEFAULT_TEMPLATE_OPTIONS: TemplateOptions = {
  polaroidPadding: 6,
  showPolaroidDate: true,
  magazineIssue: 'Kinfolk · Editorial',
  magazinePage: 'No. 01',
  magazineSubtitle: '',
};

type EditorState = {
  image: EditorImage | null;
  templateId: InsTemplateId;
  filterId: PhotoFilterId;
  filterIntensity: number;
  title: string;
  fontId: TitleFontId;
  outputSizeId: OutputSizeId;
  photoDate: string;
  photoLocation: string;
  palette: ColorSwatch[];
  titleColor: string;
  suggestedTitleColor: string;
  titleColorManual: boolean;
  exportFormat: ExportFormat;
  exportScale: ExportScale;
  analyzing: boolean;
  photoCrop: PhotoCrop;
  templateOptions: TemplateOptions;
  paletteDriven: boolean;
  themeColors: ThemeColors;
  savedPresets: StylePreset[];

  setImage: (file: File) => Promise<void>;
  clearImage: () => void;
  setTemplateId: (id: InsTemplateId) => void;
  setFilterId: (id: PhotoFilterId) => void;
  setFilterIntensity: (value: number) => void;
  setTitle: (title: string) => void;
  setFontId: (id: TitleFontId) => void;
  setOutputSizeId: (id: OutputSizeId) => void;
  setTitleColor: (color: string) => void;
  applySuggestedTitleColor: () => void;
  setExportFormat: (format: ExportFormat) => void;
  setExportScale: (scale: ExportScale) => void;
  setPhotoCrop: (crop: PhotoCrop) => void;
  updatePhotoCrop: (partial: Partial<PhotoCrop>) => void;
  resetPhotoCrop: () => void;
  setTemplateOptions: (partial: Partial<TemplateOptions>) => void;
  setPaletteDriven: (enabled: boolean) => void;
  getPresetSnapshot: () => PresetSnapshot;
  saveCurrentPreset: (name: string) => void;
  deletePreset: (id: string) => void;
  applyPreset: (preset: StylePreset | PresetSnapshot) => void;
  hydrateFromShareUrl: () => boolean;
  getCanvasSize: () => CanvasSize | null;
};

const emptyEnrichment = {
  photoDate: '',
  photoLocation: '',
  palette: [] as ColorSwatch[],
  titleColor: DEFAULT_TITLE_COLOR,
  suggestedTitleColor: DEFAULT_TITLE_COLOR,
  titleColorManual: false,
  analyzing: false,
  themeColors: { ...DEFAULT_THEME },
};

function readInitialPresets(): StylePreset[] {
  if (typeof window === 'undefined') return [];
  return loadPresets();
}

export const useEditorStore = create<EditorState>((set, get) => ({
  image: null,
  templateId: 'polaroid',
  filterId: 'none',
  filterIntensity: 100,
  title: '',
  fontId: 'typewriter',
  outputSizeId: 'instagram',
  exportFormat: 'png',
  exportScale: 2,
  photoCrop: { ...DEFAULT_PHOTO_CROP },
  templateOptions: { ...DEFAULT_TEMPLATE_OPTIONS },
  paletteDriven: true,
  savedPresets: readInitialPresets(),
  ...emptyEnrichment,

  setImage: async (file) => {
    clearFilterCache();
    const editorImage = await loadImageFromFile(file);
    editorImage.file = file;
    set({
      image: editorImage,
      title: '',
      photoCrop: { ...DEFAULT_PHOTO_CROP },
      filterIntensity: 100,
      ...emptyEnrichment,
      analyzing: true,
    });

    void enrichImage(editorImage, file, set, get);
  },

  clearImage: () => {
    clearFilterCache();
    set({
      image: null,
      title: '',
      photoCrop: { ...DEFAULT_PHOTO_CROP },
      filterIntensity: 100,
      ...emptyEnrichment,
    });
  },

  setTemplateId: (templateId) => set({ templateId }),
  setFilterId: (filterId) => set({ filterId }),
  setFilterIntensity: (filterIntensity) =>
    set({ filterIntensity: Math.max(0, Math.min(100, Math.round(filterIntensity))) }),
  setTitle: (title) => set({ title }),
  setFontId: (fontId) => set({ fontId }),
  setOutputSizeId: (outputSizeId) => set({ outputSizeId }),

  setTitleColor: (titleColor) => set({ titleColor, titleColorManual: true }),

  applySuggestedTitleColor: () => {
    const { suggestedTitleColor } = get();
    set({ titleColor: suggestedTitleColor, titleColorManual: false });
  },

  setExportFormat: (exportFormat) => set({ exportFormat }),
  setExportScale: (exportScale) => set({ exportScale }),

  setPhotoCrop: (crop) => set({ photoCrop: clampPhotoCrop(crop) }),

  updatePhotoCrop: (partial) => {
    const next = clampPhotoCrop({ ...get().photoCrop, ...partial });
    set({ photoCrop: next });
  },

  resetPhotoCrop: () => set({ photoCrop: { ...DEFAULT_PHOTO_CROP } }),

  setTemplateOptions: (partial) =>
    set({ templateOptions: { ...get().templateOptions, ...partial } }),

  setPaletteDriven: (paletteDriven) => set({ paletteDriven }),

  getPresetSnapshot: () => {
    const s = get();
    return {
      templateId: s.templateId,
      filterId: s.filterId,
      filterIntensity: s.filterIntensity,
      fontId: s.fontId,
      titleColor: s.titleColor,
      title: s.title,
      outputSizeId: s.outputSizeId,
      templateOptions: { ...s.templateOptions },
      paletteDriven: s.paletteDriven,
    };
  },

  saveCurrentPreset: (name) => {
    const preset = createPreset(name, get().getPresetSnapshot());
    const savedPresets = [preset, ...get().savedPresets].slice(0, 20);
    savePresets(savedPresets);
    set({ savedPresets });
  },

  deletePreset: (id) => {
    const savedPresets = get().savedPresets.filter((p) => p.id !== id);
    savePresets(savedPresets);
    set({ savedPresets });
  },

  applyPreset: (preset) => {
    set({
      templateId: preset.templateId,
      filterId: preset.filterId,
      filterIntensity: preset.filterIntensity,
      fontId: preset.fontId,
      titleColor: preset.titleColor,
      title: preset.title,
      outputSizeId: preset.outputSizeId,
      templateOptions: { ...DEFAULT_TEMPLATE_OPTIONS, ...preset.templateOptions },
      paletteDriven: preset.paletteDriven,
      titleColorManual: true,
    });
  },

  hydrateFromShareUrl: () => {
    const snapshot = readShareFromLocation();
    if (!snapshot) return false;
    get().applyPreset(snapshot);
    clearShareParamFromUrl();
    return true;
  },

  getCanvasSize: () => {
    const { image, outputSizeId } = get();
    if (!image) return null;
    return resolveCanvasSize(outputSizeId, image.width, image.height);
  },
}));

async function enrichImage(
  editorImage: EditorImage,
  file: File,
  set: (partial: Partial<EditorState>) => void,
  get: () => EditorState,
) {
  try {
    const [palette, meta] = await Promise.all([
      extractColorsFromImage(editorImage.src, 5).catch(() => [] as ColorSwatch[]),
      extractPhotoMeta(file).catch(() => ({ location: '', dateTime: '' })),
    ]);

    if (get().image?.id !== editorImage.id) return;

    const themeColors = deriveThemeFromPalette(palette);
    const suggested =
      palette.length > 0 ? pickTextColor(PAPER_BG, palette) : DEFAULT_TITLE_COLOR;

    const current = get();
    set({
      palette,
      themeColors,
      photoDate: meta.dateTime,
      photoLocation: meta.location,
      suggestedTitleColor: suggested,
      titleColor: current.titleColorManual ? current.titleColor : suggested,
      ...(current.title === '' && meta.location ? { title: meta.location } : {}),
      analyzing: false,
    });
  } catch {
    if (get().image?.id === editorImage.id) {
      set({ analyzing: false });
    }
  }
}

export { INS_TEMPLATES };
