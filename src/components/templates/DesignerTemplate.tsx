import type { ResumeData } from '../../types/resume';
import {
  AvatarPlaceholder,
  CertificationsSection,
  ContactBar,
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  SkillsListSection,
  SummarySection,
  TemplateRoot,
} from './layoutShared';

export function DesignerTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor || '#6BADCF';
  const headingClass =
    'mb-2 border-b pb-1 text-[13pt] font-normal tracking-wide';
  const headingStyle = { color: accent, borderColor: accent };
  const { personalInfo } = data;

  return (
    <TemplateRoot data={data} className="font-[Helvetica,Arial,sans-serif]">
      <div className="border-t border-neutral-800 pt-3">
        <h1
          className="font-[Georgia,'Times_New_Roman',serif] text-[26pt] leading-tight"
          style={{ color: accent }}
        >
          {personalInfo.name || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="mt-1 text-[12pt] text-neutral-700">
            {personalInfo.title}
          </p>
        )}

        <div className="my-3 border-y border-neutral-800 py-2">
          <ContactBar
            data={data}
            className="justify-center text-[10pt] text-neutral-700"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-5">
          <SummarySection
            data={data}
            title="Summary"
            titleClass={headingClass}
            titleStyle={headingStyle}
          />
          <ExperienceSection
            data={data}
            title="Work Experience"
            titleClass={headingClass}
            titleStyle={headingStyle}
          />
          <SkillsListSection
            data={data}
            title="Key Skills"
            titleClass={headingClass}
            titleStyle={headingStyle}
          />
          <ProjectsSection
            data={data}
            title="Projects"
            titleClass={headingClass}
            titleStyle={headingStyle}
          />
        </div>

        <aside className="space-y-5">
          <AvatarPlaceholder
            name={personalInfo.name || 'Your Name'}
            accent={accent}
            className="mx-auto aspect-[3/4] w-full max-w-[180px] rounded-sm"
          />

          <EducationSection
            data={data}
            title="Education"
            titleClass={headingClass}
            titleStyle={headingStyle}
          />

          <CertificationsSection
            data={data}
            title="Certifications"
            titleClass={headingClass}
            titleStyle={headingStyle}
            listClass="list-disc space-y-1 pl-5"
          />
        </aside>
      </div>
    </TemplateRoot>
  );
}
