import type { ResumeData } from '../../types/resume';
import {
  CertificationsSection,
  ContactSection,
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  SkillsListSection,
  TemplateRoot,
} from './layoutShared';

export function SplitRailTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor || '#0f766e';
  const { personalInfo } = data;
  const railTitle =
    'mb-2 text-[9pt] font-black uppercase tracking-[0.18em] text-white/80';
  const mainTitle =
    'mb-3 text-[10pt] font-black uppercase tracking-[0.18em] text-neutral-900';

  return (
    <TemplateRoot data={data} className="font-[Inter,Arial,sans-serif]">
      <div className="grid min-h-[10in] grid-cols-[0.78fr_1.22fr] overflow-hidden rounded-sm border border-neutral-200">
        <aside
          className="space-y-5 p-5 text-white"
          style={{ backgroundColor: accent }}
        >
          <header className="resume-section">
            <p className="text-[9pt] font-semibold uppercase tracking-[0.22em] text-white/70">
              Resume
            </p>
            <h1 className="mt-3 text-[24pt] font-black leading-none tracking-tight">
              {personalInfo.name || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p className="mt-2 text-[11pt] font-medium text-white/90">
                {personalInfo.title}
              </p>
            )}
          </header>

          <ContactSection
            data={data}
            title="Contact"
            titleClass={railTitle}
            itemClassName="break-words text-[9.5pt] leading-relaxed text-white/90"
          />

          <SkillsListSection
            data={data}
            title="Core Skills"
            titleClass={railTitle}
            contentClassName="text-[9.5pt] leading-relaxed text-white/90"
          />
        </aside>

        <main className="space-y-5 bg-white p-6">
          {data.visibility.summary && data.summary.trim() && (
            <section className="resume-section">
              <h2 className={mainTitle}>Profile</h2>
              <p
                className="border-l-4 pl-4 leading-relaxed text-neutral-700"
                style={{ borderColor: accent }}
              >
                {data.summary}
              </p>
            </section>
          )}

          <ExperienceSection
            data={data}
            title="Experience"
            titleClass={mainTitle}
            bulletClass="list-disc pl-5 text-neutral-700"
          />
          <EducationSection
            data={data}
            title="Education"
            titleClass={mainTitle}
          />
          <ProjectsSection
            data={data}
            title="Projects"
            titleClass={mainTitle}
          />
          <CertificationsSection
            data={data}
            title="Certifications"
            titleClass={mainTitle}
          />
        </main>
      </div>
    </TemplateRoot>
  );
}
