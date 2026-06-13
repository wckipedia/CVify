import type { ComponentType } from 'react';
import type { ResumeData, TemplateId } from '../../types/resume';
import { ATSCleanTemplate } from './ATSCleanTemplate';
import { BentoTemplate } from './BentoTemplate';
import { DesignerTemplate } from './DesignerTemplate';
import { EditorialTemplate } from './EditorialTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { ModernTemplate } from './ModernTemplate';
import { SidebarProTemplate } from './SidebarProTemplate';
import { SunriseTemplate } from './SunriseTemplate';
import { TechTemplate } from './TechTemplate';
import { TimelineTemplate } from './TimelineTemplate';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  usesAccentColor: boolean;
  component: ComponentType<{ data: ResumeData }>;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'ats-clean',
    name: 'ATS Clean',
    usesAccentColor: false,
    component: ATSCleanTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    usesAccentColor: true,
    component: ModernTemplate,
  },
  {
    id: 'executive',
    name: 'Executive',
    usesAccentColor: true,
    component: ExecutiveTemplate,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    usesAccentColor: true,
    component: ElegantTemplate,
  },
  {
    id: 'tech',
    name: 'Tech',
    usesAccentColor: true,
    component: TechTemplate,
  },
  {
    id: 'designer',
    name: 'Designer',
    usesAccentColor: true,
    component: DesignerTemplate,
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    usesAccentColor: true,
    component: SunriseTemplate,
  },
  {
    id: 'sidebar-pro',
    name: 'Sidebar Pro',
    usesAccentColor: true,
    component: SidebarProTemplate,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    usesAccentColor: true,
    component: TimelineTemplate,
  },
  {
    id: 'bento',
    name: 'Bento',
    usesAccentColor: true,
    component: BentoTemplate,
  },
  {
    id: 'editorial',
    name: 'Editorial',
    usesAccentColor: true,
    component: EditorialTemplate,
  },
];

const templateMap = new Map(
  TEMPLATES.map((template) => [template.id, template]),
);

export const TEMPLATE_IDS = TEMPLATES.map((template) => template.id);

export function getTemplateDefinition(id: TemplateId): TemplateDefinition {
  return templateMap.get(id) ?? TEMPLATES[0];
}

export function getTemplateComponent(id: TemplateId) {
  return getTemplateDefinition(id).component;
}

export function getTemplateName(id: TemplateId): string {
  return getTemplateDefinition(id).name;
}

export function templateUsesAccentColor(id: TemplateId): boolean {
  return getTemplateDefinition(id).usesAccentColor;
}

export function isTemplateId(value: string): value is TemplateId {
  return templateMap.has(value as TemplateId);
}

export function normalizeTemplateId(value: string): TemplateId {
  return isTemplateId(value) ? value : 'ats-clean';
}
