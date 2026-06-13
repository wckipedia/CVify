import { CertificationsSection } from './CertificationsSection';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { PersonalInfoSection, SummarySection } from './PersonalInfoSection';
import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';

export function EditorPanel() {
  return (
    <div className="space-y-8 p-4 sm:p-6">
      <PersonalInfoSection />
      <SummarySection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <CertificationsSection />
    </div>
  );
}
