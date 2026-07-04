import { create } from 'zustand';
import { INS_TEMPLATES, resolveCanvasSize } from '@/engine/insTemplateEngine';
import { loadImageFromFile } from '@/engine/layoutEngine';
import type { CanvasSize, EditorImage, InsTemplateId, OutputSizeId, PhotoFilterId, TitleFontId } from '@/types';

type EditorState = {
  image: EditorImage | null;
  templateId: InsTemplateId;
  filterId: PhotoFilterId;
  title: string;
  fontId: TitleFontId;
  outputSizeId: OutputSizeId;

  setImage: (file: File) => Promise<void>;
  clearImage: () => void;
  setTemplateId: (id: InsTemplateId) => void;
  setFilterId: (id: PhotoFilterId) => void;
  setTitle: (title: string) => void;
  setFontId: (id: TitleFontId) => void;
  setOutputSizeId: (id: OutputSizeId) => void;
  getCanvasSize: () => CanvasSize | null;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  image: null,
  templateId: 'polaroid',
  filterId: 'none',
  title: '',
  fontId: 'typewriter',
  outputSizeId: 'instagram',

  setImage: async (file) => {
    try {
      const editorImage = await loadImageFromFile(file);
      editorImage.file = file;
      set({ image: editorImage, title: '' });
    } catch {
      /* ignore */
    }
  },

  clearImage: () => {
    set({ image: null, title: '' });
  },

  setTemplateId: (templateId) => set({ templateId }),
  setFilterId: (filterId) => set({ filterId }),
  setTitle: (title) => set({ title }),
  setFontId: (fontId) => set({ fontId }),
  setOutputSizeId: (outputSizeId) => set({ outputSizeId }),

  getCanvasSize: () => {
    const { image, outputSizeId } = get();
    if (!image) return null;
    return resolveCanvasSize(outputSizeId, image.width, image.height);
  },
}));

export { INS_TEMPLATES };
