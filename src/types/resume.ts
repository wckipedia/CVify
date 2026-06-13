export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  notes: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  link: string;
  bullets: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export type TemplateId =
  | 'ats-clean'
  | 'modern'
  | 'executive'
  | 'elegant'
  | 'tech'
  | 'designer'
  | 'sunrise'
  | 'sidebar-pro'
  | 'timeline'
  | 'bento'
  | 'editorial';
export type FontSize = 'S' | 'M' | 'L';
export type SectionSpacing = 'compact' | 'normal';

export interface LayoutSettings {
  template: TemplateId;
  fontSize: FontSize;
  accentColor: string;
  sectionSpacing: SectionSpacing;
}

export interface SectionVisibility {
  summary: boolean;
  projects: boolean;
  certifications: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  skills: SkillCategory[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  layout: LayoutSettings;
  visibility: SectionVisibility;
}

export interface TemplateProps {
  data: ResumeData;
}
