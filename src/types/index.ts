export type EditorImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  file?: File;
};

export type InsTemplateId = 'polaroid' | 'magazine' | 'ccd' | 'y2k' | 'cream';

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
