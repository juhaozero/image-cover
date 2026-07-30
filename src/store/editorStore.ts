import { create } from 'zustand';
import { clearFilterCache, extractColorsFromImage, pickTextColor } from '@/engine/colorEngine';
import { extractPhotoMeta } from '@/engine/exifEngine';
import { INS_TEMPLATES, resolveCanvasSize } from '@/engine/insTemplateEngine';
import { clampPhotoCrop, DEFAULT_PHOTO_CROP, loadImageFromFile } from '@/engine/layoutEngine';
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
  TemplateOptions,
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
};

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

    const suggested =
      palette.length > 0 ? pickTextColor(PAPER_BG, palette) : DEFAULT_TITLE_COLOR;

    const current = get();
    set({
      palette,
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
