import { create } from 'zustand';
import { getDefaultTemplate } from '@/engine/templateEngine';
import { mapImagesToSlots } from '@/engine/layoutEngine';
import type { EditorImage, ImageTransform, SlotMapping, Template } from '@/types';

type EditorState = {
  images: EditorImage[];
  template: Template;
  mappings: SlotMapping[];
  transforms: Record<number, ImageTransform>;
  previewScale: number;

  addImages: (images: EditorImage[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  setTemplate: (template: Template) => void;
  setPreviewScale: (scale: number) => void;
  updateTransform: (slotIndex: number, transform: ImageTransform) => void;
  replaceSlotImage: (slotIndex: number, image: EditorImage) => void;
};

function rebuildMappings(images: EditorImage[], template: Template): SlotMapping[] {
  return mapImagesToSlots(images, template.slots);
}

export const useEditorStore = create<EditorState>((set, get) => ({
  images: [],
  template: getDefaultTemplate(),
  mappings: [],
  transforms: {},
  previewScale: 0.5,

  addImages: (newImages) => {
    const images = [...get().images, ...newImages].slice(0, 20);
    const { template } = get();
    set({
      images,
      mappings: rebuildMappings(images, template),
      transforms: {},
    });
  },

  removeImage: (id) => {
    const images = get().images.filter((img) => img.id !== id);
    const { template } = get();
    set({
      images,
      mappings: rebuildMappings(images, template),
      transforms: {},
    });
  },

  clearImages: () => {
    set({ images: [], mappings: [], transforms: {} });
  },

  setTemplate: (template) => {
    const { images } = get();
    set({
      template,
      mappings: rebuildMappings(images, template),
      transforms: {},
    });
  },

  setPreviewScale: (previewScale) => set({ previewScale }),

  updateTransform: (slotIndex, transform) => {
    set((state) => ({
      transforms: { ...state.transforms, [slotIndex]: transform },
    }));
  },

  replaceSlotImage: (slotIndex, image) => {
    const images = [...get().images];
    while (images.length <= slotIndex) {
      images.push(image);
    }
    images[slotIndex] = image;
    const { template } = get();
    set({
      images,
      mappings: rebuildMappings(images, template),
    });
  },
}));
