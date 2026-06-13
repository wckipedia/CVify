import type { ResumeData } from '../../types/resume';
import {
  CertificationsSection,
  ContactItems,
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  SkillsListSection,
  TemplateRoot,
} from './layoutShared';

export function EditorialTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor || '#BE123C';
  const { personalInfo } = data;
  const nameParts = (personalInfo.name || 'Your Name').split(/\s+/);
  const firstName = nameParts[0] ?? 'Your';
  const restName = nameParts.slice(1).join(' ') || 'Name';

  const columnRule = 'border-neutral-300 md:border-r md:pr-5 md:last:border-r-0';
  const sectionTitle =
    'mb-3 font-[Helvetica,sans-serif] text-[10pt] font-bold uppercase tracking-widest';
  const sectionStyle = { color: accent };

  return (
    <TemplateRoot
      data={data}
      className="font-[Georgia,'Times_New_Roman',serif]"
    >
      <header
        className="-mx-10 -mt-10 mb-6 px-10 py-8 text-white"
        style={{ backgroundColor: accent }}
      >
        <p className="font-[Helvetica,sans-serif] text-[9pt] font-bold uppercase tracking-[0.4em] text-white/80">
          Resume
        </p>
        <div className="mt-2 flex flex-wrap items-end gap-x-3 leading-none">
          <h1 className="text-[34pt] font-bold italic">{firstName}</h1>
          <h1 className="text-[34pt] font-bold not-italic">{restName}</h1>
        </div>
        {personalInfo.title && (
          <p className="mt-3 font-[Helvetica,sans-serif] text-[12pt] font-medium text-white/90">
            {personalInfo.title}
          </p>
        )}
      </header>

      <div className="mb-5 border-y border-neutral-800 py-2 font-[Helvetica,sans-serif] text-[9pt] uppercase tracking-wider text-neutral-600">
        <ContactItems data={data} />
      </div>

      {data.visibility.summary && data.summary.trim() && (
        <blockquote
          className="resume-section mb-6 border-l-4 pl-4 text-[12pt] italic leading-relaxed text-neutral-800"
          style={{ borderColor: accent }}
        >
          {data.summary}
        </blockquote>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className={`space-y-5 ${columnRule}`}>
          <ExperienceSection
            data={data}
            title="Experience"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
            bulletClass="list-none space-y-1 pl-0"
          />
        </div>

        <div className={`space-y-5 ${columnRule}`}>
          <EducationSection
            data={data}
            title="Education"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
          />
          <ProjectsSection
            data={data}
            title="Projects"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
          />
        </div>

        <div className="space-y-5">
          <SkillsListSection
            data={data}
            title="Expertise"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
          />
          <CertificationsSection
            data={data}
            title="Credentials"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
            listClass="list-none space-y-1 pl-0 font-[Helvetica,sans-serif] text-[10pt]"
          />
        </div>
      </div>
    </TemplateRoot>
  );
}
