export type Slot = {
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
};

export type TemplateStyle = {
  background: string;
  padding: number;
  shadow: boolean;
  borderWidth: number;
  borderColor: string;
};

export type Template = {
  id: string;
  name: string;
  description: string;
  canvas: {
    width: number;
    height: number;
  };
  slots: Slot[];
  style: TemplateStyle;
};

export type EditorImage = {
  id: string;
  src: string;
  width: number;
  height: number;
};

export type SlotMapping = {
  slotIndex: number;
  image: EditorImage | null;
  slot: Slot;
};

export type ImageTransform = {
  offsetX: number;
  offsetY: number;
  scale: number;
};

export type ExportFormat = 'png' | 'jpeg';
export type ExportScale = 1 | 2 | 3;
