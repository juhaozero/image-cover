import { templates } from '@/templates';
import type { Template } from '@/types';

export function getAllTemplates(): Template[] {
  return templates;
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getDefaultTemplate(): Template {
  return templates[0];
}
