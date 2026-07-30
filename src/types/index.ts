export type EditorImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  file?: File;
};

export type ColorSwatch = {
  hex: string;
  rgb: [number, number, number];
  nameZh: string;
  nameEn: string;
  ratio: number;
};

export type InsTemplateId =
  | 'polaroid'
  | 'magazine'
  | 'ccd'
  | 'y2k'
  | 'cream'
  | 'cinema'
  | 'note'
  | 'filmstrip';

export type PhotoFilterId =
  | 'none'
  | 'film'
  | 'faded'
  | 'golden'
  | 'cool'
  | 'mono'
  | 'cinematic'
  | 'classic_chrome'
  | 'positive';

export type OutputSizeId =
  | 'free'
  | 'xiaohongshu'
  | 'instagram'
  | 'square'
  | 'wallpaper'
  | 'postcard';

export type ExportFormat = 'png' | 'jpeg';
export type ExportScale = 1 | 2 | 3;

export type InsTemplate = {
  id: InsTemplateId;
  name: string;
  description: string;
};

export type OutputSizePreset = {
  id: OutputSizeId;
  label: string;
  width: number;
  height: number;
};

export type PhotoFilter = {
  id: PhotoFilterId;
  label: string;
};

export type CanvasSize = {
  width: number;
  height: number;
};

export type TitleFontId =
  | 'typewriter'
  | 'serif'
  | 'sans'
  | 'pixel'
  | 'handwriting'
  | 'bold';

export type TitleFont = {
  id: TitleFontId;
  label: string;
  family: string;
};

/** 照片构图：zoom≥1 为相对 cover 的放大；pan 为相对中心的平移比例 */
export type PhotoCrop = {
  zoom: number;
  panX: number;
  panY: number;
};

export type TemplateOptions = {
  polaroidPadding: number;
  showPolaroidDate: boolean;
  magazineIssue: string;
  magazinePage: string;
  magazineSubtitle: string;
};

/** 由色板推导的模板主题色 */
export type ThemeColors = {
  background: string;
  surface: string;
  accent: string;
  accentSoft: string;
  text: string;
  muted: string;
};

/** 可本地收藏 / 分享的风格组合 */
export type StylePreset = {
  id: string;
  name: string;
  createdAt: number;
  templateId: InsTemplateId;
  filterId: PhotoFilterId;
  filterIntensity: number;
  fontId: TitleFontId;
  titleColor: string;
  title: string;
  outputSizeId: OutputSizeId;
  templateOptions: TemplateOptions;
  paletteDriven: boolean;
};
