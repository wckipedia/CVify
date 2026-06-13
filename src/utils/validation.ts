import { isTemplateId } from '../components/templates/registry';
import type { ResumeData } from '../types/resume';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function validatePersonalInfo(value: unknown): boolean {
  if (!isObject(value)) return false;
  const fields = [
    'name',
    'title',
    'email',
    'phone',
    'location',
    'website',
    'linkedin',
    'github',
  ];
  return fields.every((field) => isString(value[field]));
}

function validateSkillCategory(value: unknown): boolean {
  if (!isObject(value)) return false;
  return isString(value.id) && isString(value.name) && isString(value.skills);
}

function validateExperienceEntry(value: unknown): boolean {
  if (!isObject(value)) return false;
  return (
    isString(value.id) &&
    isString(value.role) &&
    isString(value.company) &&
    isString(value.location) &&
    isString(value.startDate) &&
    isString(value.endDate) &&
    isStringArray(value.bullets)
  );
}

function validateEducationEntry(value: unknown): boolean {
  if (!isObject(value)) return false;
  return (
    isString(value.id) &&
    isString(value.school) &&
    isString(value.degree) &&
    isString(value.startDate) &&
    isString(value.endDate) &&
    isString(value.notes)
  );
}

function validateProjectEntry(value: unknown): boolean {
  if (!isObject(value)) return false;
  return (
    isString(value.id) &&
    isString(value.name) &&
    isString(value.link) &&
    isStringArray(value.bullets)
  );
}

function validateCertificationEntry(value: unknown): boolean {
  if (!isObject(value)) return false;
  return (
    isString(value.id) &&
    isString(value.name) &&
    isString(value.issuer) &&
    isString(value.date)
  );
}

function validateLayout(value: unknown): boolean {
  if (!isObject(value)) return false;
  return (
    isString(value.template) &&
    isTemplateId(value.template) &&
    (value.fontSize === 'S' ||
      value.fontSize === 'M' ||
      value.fontSize === 'L') &&
    isString(value.accentColor) &&
    (value.sectionSpacing === 'compact' || value.sectionSpacing === 'normal')
  );
}

function validateVisibility(value: unknown): boolean {
  if (!isObject(value)) return false;
  return (
    typeof value.summary === 'boolean' &&
    typeof value.projects === 'boolean' &&
    typeof value.certifications === 'boolean'
  );
}

export function validateResumeData(value: unknown): value is ResumeData {
  if (!isObject(value)) return false;

  return (
    validatePersonalInfo(value.personalInfo) &&
    isString(value.summary) &&
    Array.isArray(value.skills) &&
    value.skills.every(validateSkillCategory) &&
    Array.isArray(value.experience) &&
    value.experience.every(validateExperienceEntry) &&
    Array.isArray(value.education) &&
    value.education.every(validateEducationEntry) &&
    Array.isArray(value.projects) &&
    value.projects.every(validateProjectEntry) &&
    Array.isArray(value.certifications) &&
    value.certifications.every(validateCertificationEntry) &&
    validateLayout(value.layout) &&
    validateVisibility(value.visibility)
  );
}

export function parseResumeJson(json: string): ResumeData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON file.');
  }

  if (!validateResumeData(parsed)) {
    throw new Error('Invalid resume data structure.');
  }

  return parsed;
}
