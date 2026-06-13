import type { ResumeData } from '../../types/resume';
import {
  CertificationsSection,
  ContactSection,
  EducationSection,
  ProjectsSection,
  SkillsListSection,
  SummarySection,
  TemplateRoot,
} from './layoutShared';

function TimelineExperience({
  data,
  accent,
}: {
  data: ResumeData;
  accent: string;
}) {
  if (data.experience.length === 0) return null;

  return (
    <section className="resume-section">
      <h2
        className="mb-4 text-[11pt] font-bold uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        Experience
      </h2>
      <div className="relative space-y-5 pl-6">
        <div
          className="absolute top-1 bottom-1 left-[7px] w-px"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        {data.experience.map((entry) => (
          <article key={entry.id} className="resume-entry relative">
            <span
              className="absolute top-1.5 -left-6 size-3.5 rounded-full border-2 border-white"
              style={{ backgroundColor: accent }}
              aria-hidden
            />
            <p
              className="text-[9pt] font-bold uppercase tracking-wider"
              style={{ color: accent }}
            >
              {[entry.startDate, entry.endDate].filter(Boolean).join(' – ')}
            </p>
            <h3 className="text-[11pt] font-bold">{entry.role}</h3>
            <p className="text-neutral-600">
              {entry.company}
              {entry.location && ` · ${entry.location}`}
            </p>
            {entry.bullets.filter(Boolean).length > 0 && (
              <ul className="mt-1 list-none space-y-0.5 pl-0 text-neutral-700">
                {entry.bullets.filter(Boolean).map((bullet, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: accent }}>—</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function TimelineTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor || '#0D9488';
  const { personalInfo } = data;
  const headingClass =
    'mb-2 text-[11pt] font-bold uppercase tracking-[0.2em]';
  const headingStyle = { color: accent };

  return (
    <TemplateRoot data={data} className="font-[Helvetica,Arial,sans-serif]">
      <header
        className="mb-6 flex flex-col gap-4 border-b-2 pb-5 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: accent }}
      >
        <div>
          <p
            className="text-[9pt] font-bold uppercase tracking-[0.35em]"
            style={{ color: accent }}
          >
            Curriculum Vitae
          </p>
          <h1 className="mt-1 text-[26pt] font-black leading-none tracking-tight">
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p className="mt-2 text-[12pt] text-neutral-600">
              {personalInfo.title}
            </p>
          )}
        </div>
        <ContactSection
          data={data}
          itemClassName="text-[10pt] text-neutral-600 sm:text-right"
        />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="space-y-5">
          <SummarySection
            data={data}
            title="Profile"
            titleClass={headingClass}
            titleStyle={headingStyle}
          />
          <TimelineExperience data={data} accent={accent} />
        </div>
        <aside
          className="space-y-5 lg:border-l lg:pl-6"
          style={{ borderColor: `${accent}44` }}
        >
          <SkillsListSection
            data={data}
            title="Skills"
            titleClass={headingClass}
            titleStyle={headingStyle}
          />
          <EducationSection
            data={data}
            titleClass={headingClass}
            titleStyle={headingStyle}
          />
          <ProjectsSection
            data={data}
            titleClass={headingClass}
            titleStyle={headingStyle}
          />
          <CertificationsSection
            data={data}
            titleClass={headingClass}
            titleStyle={headingStyle}
            listClass="list-none space-y-1 pl-0"
          />
        </aside>
      </div>
    </TemplateRoot>
  );
}
