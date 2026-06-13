import type { ResumeData } from '../../types/resume';
import {
  AvatarPlaceholder,
  CertificationsSection,
  ContactSection,
  EducationSection,
  ProjectsSection,
  SkillBarsSection,
  SkillsListSection,
  SummarySection,
  TemplateRoot,
} from './layoutShared';

function SunriseExperience({
  data,
  accent,
}: {
  data: ResumeData;
  accent: string;
}) {
  if (data.experience.length === 0) return null;
  return (
    <div className="space-y-4">
      {data.experience.map((entry) => (
        <article key={entry.id} className="resume-entry flex gap-3">
          <span
            className="mt-1.5 size-2 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <div>
            <p className="font-bold">
              {[entry.startDate, entry.endDate].filter(Boolean).join(' – ')}
            </p>
            <h3 className="font-bold">{entry.role}</h3>
            <p className="text-neutral-700">
              {entry.company}
              {entry.location && `, ${entry.location}`}
            </p>
            {entry.bullets.filter(Boolean).length > 0 && (
              <ul className="mt-1 space-y-0.5 text-neutral-700">
                {entry.bullets.filter(Boolean).map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export function SunriseTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor || '#F97316';
  const accentDark = '#C2410C';
  const { personalInfo } = data;
  const sectionTitle =
    'mb-3 text-[12pt] font-bold uppercase tracking-wide';
  const sectionStyle = { color: accentDark };

  return (
    <TemplateRoot data={data} className="font-[Helvetica,Arial,sans-serif]">
      <header
        className="-mx-10 -mt-10 mb-6 px-8 pb-6 pt-8"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, #FBBF24 100%)`,
        }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-5">
            <AvatarPlaceholder
              name={personalInfo.name || 'Your Name'}
              accent="#ffffff"
              className="size-24 shrink-0 rounded-full border-4 border-white shadow-md"
            />
            <div className="pt-2">
              <h1 className="text-[22pt] font-black uppercase leading-none tracking-tight text-neutral-900">
                {personalInfo.name || 'Your Name'}
              </h1>
              {personalInfo.title && (
                <p className="mt-2 text-[12pt] font-medium text-neutral-900">
                  {personalInfo.title}
                </p>
              )}
            </div>
          </div>
          <ContactSection
            data={data}
            title="Contact"
            titleClass="text-[11pt] font-bold uppercase tracking-wide text-neutral-900"
            itemClassName="text-[10pt] text-neutral-900"
            className="min-w-[180px] lg:text-right"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <SummarySection
            data={data}
            title="About Me"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
          />
          <section className="resume-section">
            <h2 className={sectionTitle} style={sectionStyle}>
              Work Experience
            </h2>
            <SunriseExperience data={data} accent={accent} />
          </section>
        </div>
        <aside className="space-y-5">
          <EducationSection
            data={data}
            title="Education"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
          />
          <SkillBarsSection
            data={data}
            title="Skills"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
            accent={accent}
          />
          <SkillsListSection
            data={data}
            title="Skill Categories"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
          />
          <ProjectsSection
            data={data}
            title="Portfolio"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
          />
          <CertificationsSection
            data={data}
            title="Certifications"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
          />
        </aside>
      </div>

      <div
        className="-mx-10 -mb-10 mt-8 h-3"
        style={{ backgroundColor: accent }}
      />
    </TemplateRoot>
  );
}
