import type {
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  ResumeData,
  SkillCategory,
} from '../types/resume';

export function createId(): string {
  return crypto.randomUUID();
}

export function createDefaultResume(): ResumeData {
  return {
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
    },
    summary: '',
    skills: [
      {
        id: createId(),
        name: 'Languages',
        skills: 'TypeScript, JavaScript, Python',
      },
      {
        id: createId(),
        name: 'Frameworks',
        skills: 'React, Node.js',
      },
    ],
    experience: [
      {
        id: createId(),
        role: 'Software Engineer',
        company: 'Acme Corp',
        location: 'San Francisco, CA',
        startDate: '2022-01',
        endDate: 'Present',
        bullets: [
          'Built and maintained customer-facing web applications.',
          'Collaborated with cross-functional teams to deliver features.',
        ],
      },
    ],
    education: [
      {
        id: createId(),
        school: 'University of Example',
        degree: 'B.S. Computer Science',
        startDate: '2018',
        endDate: '2022',
        notes: '',
      },
    ],
    projects: [
      {
        id: createId(),
        name: 'Portfolio Website',
        link: 'https://example.com',
        bullets: ['Personal site built with React and TypeScript.'],
      },
    ],
    certifications: [],
    layout: {
      template: 'ats-clean',
      fontSize: 'M',
      accentColor: '#2563eb',
      sectionSpacing: 'normal',
    },
    visibility: {
      summary: true,
      projects: true,
      certifications: false,
    },
  };
}

export function createEmptyExperience(): ExperienceEntry {
  return {
    id: createId(),
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    bullets: [''],
  };
}

export function createEmptyEducation(): EducationEntry {
  return {
    id: createId(),
    school: '',
    degree: '',
    startDate: '',
    endDate: '',
    notes: '',
  };
}

export function createEmptyProject(): ProjectEntry {
  return {
    id: createId(),
    name: '',
    link: '',
    bullets: [''],
  };
}

export function createEmptyCertification(): CertificationEntry {
  return {
    id: createId(),
    name: '',
    issuer: '',
    date: '',
  };
}

export function createEmptySkillCategory(): SkillCategory {
  return {
    id: createId(),
    name: '',
    skills: '',
  };
}

export const STORAGE_KEY = 'cvify-resume-data';
