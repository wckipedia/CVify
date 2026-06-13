import { create } from 'zustand';
import type {
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  LayoutSettings,
  PersonalInfo,
  ProjectEntry,
  ResumeData,
  SectionVisibility,
  SkillCategory,
} from '../types/resume';
import {
  createDefaultResume,
  createEmptyCertification,
  createEmptyEducation,
  createEmptyExperience,
  createEmptyProject,
  createEmptySkillCategory,
  STORAGE_KEY,
} from '../utils/defaults';
import { normalizeTemplateId } from '../components/templates/registry';
import { validateResumeData } from '../utils/validation';

interface ResumeStore {
  data: ResumeData;
  importError: string | null;
  isExportingPdf: boolean;
  setPersonalInfo: (info: Partial<PersonalInfo>) => void;
  setSummary: (summary: string) => void;
  setLayout: (layout: Partial<LayoutSettings>) => void;
  setVisibility: (visibility: Partial<SectionVisibility>) => void;
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, updates: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;
  moveSkillCategory: (id: string, direction: 'up' | 'down') => void;
  reorderSkillCategories: (fromIndex: number, toIndex: number) => void;
  addExperience: () => void;
  updateExperience: (id: string, updates: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, direction: 'up' | 'down') => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;
  updateExperienceBullet: (
    id: string,
    bulletIndex: number,
    value: string,
  ) => void;
  addExperienceBullet: (id: string) => void;
  removeExperienceBullet: (id: string, bulletIndex: number) => void;
  addEducation: () => void;
  updateEducation: (id: string, updates: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;
  moveEducation: (id: string, direction: 'up' | 'down') => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;
  addProject: () => void;
  updateProject: (id: string, updates: Partial<ProjectEntry>) => void;
  removeProject: (id: string) => void;
  moveProject: (id: string, direction: 'up' | 'down') => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
  updateProjectBullet: (id: string, bulletIndex: number, value: string) => void;
  addProjectBullet: (id: string) => void;
  removeProjectBullet: (id: string, bulletIndex: number) => void;
  addCertification: () => void;
  updateCertification: (
    id: string,
    updates: Partial<CertificationEntry>,
  ) => void;
  removeCertification: (id: string) => void;
  moveCertification: (id: string, direction: 'up' | 'down') => void;
  reorderCertifications: (fromIndex: number, toIndex: number) => void;
  loadData: (data: ResumeData) => void;
  resetData: () => void;
  clearImportError: () => void;
  setImportError: (message: string) => void;
  setExportingPdf: (isExporting: boolean) => void;
}

function loadFromStorage(): ResumeData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultResume();
    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'layout' in parsed &&
      typeof parsed.layout === 'object' &&
      parsed.layout !== null &&
      'template' in parsed.layout &&
      typeof parsed.layout.template === 'string'
    ) {
      const layout = parsed.layout as { template: string };
      layout.template = normalizeTemplateId(layout.template);
    }
    if (validateResumeData(parsed)) return parsed;
  } catch {
    // fall through to default
  }
  return createDefaultResume();
}

function moveItem<T extends { id: string }>(
  items: T[],
  id: string,
  direction: 'up' | 'down',
): T[] {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

function reorderList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  data: loadFromStorage(),
  importError: null,
  isExportingPdf: false,

  setPersonalInfo: (info) =>
    set((state) => ({
      data: {
        ...state.data,
        personalInfo: { ...state.data.personalInfo, ...info },
      },
    })),

  setSummary: (summary) =>
    set((state) => ({ data: { ...state.data, summary } })),

  setLayout: (layout) =>
    set((state) => ({
      data: {
        ...state.data,
        layout: { ...state.data.layout, ...layout },
      },
    })),

  setVisibility: (visibility) =>
    set((state) => ({
      data: {
        ...state.data,
        visibility: { ...state.data.visibility, ...visibility },
      },
    })),

  addSkillCategory: () =>
    set((state) => ({
      data: {
        ...state.data,
        skills: [...state.data.skills, createEmptySkillCategory()],
      },
    })),

  updateSkillCategory: (id, updates) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      },
    })),

  removeSkillCategory: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.filter((item) => item.id !== id),
      },
    })),

  moveSkillCategory: (id, direction) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: moveItem(state.data.skills, id, direction),
      },
    })),

  reorderSkillCategories: (fromIndex, toIndex) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: reorderList(state.data.skills, fromIndex, toIndex),
      },
    })),

  addExperience: () =>
    set((state) => ({
      data: {
        ...state.data,
        experience: [...state.data.experience, createEmptyExperience()],
      },
    })),

  updateExperience: (id, updates) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.filter((item) => item.id !== id),
      },
    })),

  moveExperience: (id, direction) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: moveItem(state.data.experience, id, direction),
      },
    })),

  reorderExperience: (fromIndex, toIndex) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: reorderList(state.data.experience, fromIndex, toIndex),
      },
    })),

  updateExperienceBullet: (id, bulletIndex, value) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((item) => {
          if (item.id !== id) return item;
          const bullets = [...item.bullets];
          bullets[bulletIndex] = value;
          return { ...item, bullets };
        }),
      },
    })),

  addExperienceBullet: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((item) =>
          item.id === id ? { ...item, bullets: [...item.bullets, ''] } : item,
        ),
      },
    })),

  removeExperienceBullet: (id, bulletIndex) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((item) => {
          if (item.id !== id) return item;
          return {
            ...item,
            bullets: item.bullets.filter((_, i) => i !== bulletIndex),
          };
        }),
      },
    })),

  addEducation: () =>
    set((state) => ({
      data: {
        ...state.data,
        education: [...state.data.education, createEmptyEducation()],
      },
    })),

  updateEducation: (id, updates) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.filter((item) => item.id !== id),
      },
    })),

  moveEducation: (id, direction) =>
    set((state) => ({
      data: {
        ...state.data,
        education: moveItem(state.data.education, id, direction),
      },
    })),

  reorderEducation: (fromIndex, toIndex) =>
    set((state) => ({
      data: {
        ...state.data,
        education: reorderList(state.data.education, fromIndex, toIndex),
      },
    })),

  addProject: () =>
    set((state) => ({
      data: {
        ...state.data,
        projects: [...state.data.projects, createEmptyProject()],
      },
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: state.data.projects.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: state.data.projects.filter((item) => item.id !== id),
      },
    })),

  moveProject: (id, direction) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: moveItem(state.data.projects, id, direction),
      },
    })),

  reorderProjects: (fromIndex, toIndex) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: reorderList(state.data.projects, fromIndex, toIndex),
      },
    })),

  updateProjectBullet: (id, bulletIndex, value) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: state.data.projects.map((item) => {
          if (item.id !== id) return item;
          const bullets = [...item.bullets];
          bullets[bulletIndex] = value;
          return { ...item, bullets };
        }),
      },
    })),

  addProjectBullet: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: state.data.projects.map((item) =>
          item.id === id ? { ...item, bullets: [...item.bullets, ''] } : item,
        ),
      },
    })),

  removeProjectBullet: (id, bulletIndex) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: state.data.projects.map((item) => {
          if (item.id !== id) return item;
          return {
            ...item,
            bullets: item.bullets.filter((_, i) => i !== bulletIndex),
          };
        }),
      },
    })),

  addCertification: () =>
    set((state) => ({
      data: {
        ...state.data,
        certifications: [
          ...state.data.certifications,
          createEmptyCertification(),
        ],
      },
    })),

  updateCertification: (id, updates) =>
    set((state) => ({
      data: {
        ...state.data,
        certifications: state.data.certifications.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      },
    })),

  removeCertification: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        certifications: state.data.certifications.filter(
          (item) => item.id !== id,
        ),
      },
    })),

  moveCertification: (id, direction) =>
    set((state) => ({
      data: {
        ...state.data,
        certifications: moveItem(state.data.certifications, id, direction),
      },
    })),

  reorderCertifications: (fromIndex, toIndex) =>
    set((state) => ({
      data: {
        ...state.data,
        certifications: reorderList(
          state.data.certifications,
          fromIndex,
          toIndex,
        ),
      },
    })),

  loadData: (data) => set({ data, importError: null }),

  resetData: () => set({ data: createDefaultResume(), importError: null }),

  clearImportError: () => set({ importError: null }),

  setImportError: (message) => set({ importError: message }),

  setExportingPdf: (isExporting) => set({ isExportingPdf: isExporting }),
}));

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

useResumeStore.subscribe((state) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  }, 300);
});
