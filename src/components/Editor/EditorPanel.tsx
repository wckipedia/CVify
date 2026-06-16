import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CertificationsSection } from './CertificationsSection';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { PersonalInfoSection, SummarySection } from './PersonalInfoSection';
import { ProjectsSection } from './ProjectsSection';
import { ResumePdfUpload } from './ResumePdfUpload';
import { SkillsSection } from './SkillsSection';

type EditorFilter =
  | 'all'
  | 'skills'
  | 'experience'
  | 'education'
  | 'projects'
  | 'certifications';

const editorFilters: Array<{ label: string; value: EditorFilter }> = [
  { label: 'Show all', value: 'all' },
  { label: 'Skills', value: 'skills' },
  { label: 'Experience', value: 'experience' },
  { label: 'Education', value: 'education' },
  { label: 'Projects', value: 'projects' },
  { label: 'Certifications', value: 'certifications' },
];

export function EditorPanel() {
  const [activeFilter, setActiveFilter] = useState<EditorFilter>('all');
  const shouldShow = (filter: Exclude<EditorFilter, 'all'>) =>
    activeFilter === 'all' || activeFilter === filter;

  return (
    <div className="space-y-9 p-4 sm:p-6 xl:p-8">
      <ResumePdfUpload />
      <PersonalInfoSection />
      <SummarySection />
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-neutral-900">Filter</h2>
        <div className="flex flex-wrap gap-3">
          {editorFilters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              variant={activeFilter === filter.value ? 'default' : 'secondary'}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      {shouldShow('skills') && <SkillsSection />}
      {shouldShow('experience') && <ExperienceSection />}
      {shouldShow('education') && <EducationSection />}
      {shouldShow('projects') && <ProjectsSection />}
      {shouldShow('certifications') && <CertificationsSection />}
    </div>
  );
}
