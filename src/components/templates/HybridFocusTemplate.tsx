import type { ResumeData } from '../../types/resume';
import {
  CertificationsSection,
  ContactBar,
  EducationSection,
  ProjectsSection,
  TemplateRoot,
} from './layoutShared';

function FocusSkills({ data, accent }: { data: ResumeData; accent: string }) {
  const skills = data.skills.filter(
    (category) => category.name || category.skills,
  );
  if (skills.length === 0) return null;

  return (
    <section className="resume-section">
      <h2 className="mb-3 text-[10pt] font-black uppercase tracking-[0.18em]">
        Skills Snapshot
      </h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {skills.map((category) => (
          <div
            key={category.id}
            className="rounded border border-neutral-200 bg-neutral-50 p-3"
          >
            {category.name && (
              <p className="text-[9.5pt] font-bold" style={{ color: accent }}>
                {category.name}
              </p>
            )}
            <p className="mt-1 text-[9.5pt] leading-relaxed text-neutral-700">
              {category.skills}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FocusExperience({ data }: { data: ResumeData }) {
  if (data.experience.length === 0) return null;

  return (
    <section className="resume-section">
      <h2 className="mb-3 text-[10pt] font-black uppercase tracking-[0.18em]">
        Work History
      </h2>
      <div className="space-y-3">
        {data.experience.map((entry) => (
          <article key={entry.id} className="resume-entry">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-[11pt] font-bold">
                {entry.role || 'Role'}
                {entry.company && (
                  <span className="font-normal"> / {entry.company}</span>
                )}
              </h3>
              <span className="shrink-0 text-[9.5pt] font-semibold text-neutral-500">
                {[entry.startDate, entry.endDate].filter(Boolean).join(' - ')}
              </span>
            </div>
            {entry.location && (
              <p className="text-[9.5pt] text-neutral-500">{entry.location}</p>
            )}
            {entry.bullets.filter(Boolean).length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-neutral-700">
                {entry.bullets.filter(Boolean).map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function HybridFocusTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor || '#4f46e5';
  const { personalInfo } = data;

  return (
    <TemplateRoot data={data} className="font-[Inter,Arial,sans-serif]">
      <header className="resume-section border-b border-neutral-300 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              className="text-[9pt] font-bold uppercase tracking-[0.24em]"
              style={{ color: accent }}
            >
              Hybrid Resume
            </p>
            <h1 className="mt-2 text-[25pt] font-black leading-tight tracking-tight text-neutral-950">
              {personalInfo.name || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p className="mt-1 text-[12pt] font-semibold text-neutral-700">
                {personalInfo.title}
              </p>
            )}
          </div>
          <div
            className="h-16 w-16 rounded-full border-[10px]"
            style={{ borderColor: `${accent}33`, backgroundColor: accent }}
          />
        </div>
        <ContactBar
          data={data}
          className="mt-3 text-[9.5pt] text-neutral-600"
        />
      </header>

      {data.visibility.summary && data.summary.trim() && (
        <section className="resume-section">
          <p
            className="rounded-sm border-l-4 bg-neutral-50 p-4 leading-relaxed text-neutral-800"
            style={{ borderColor: accent }}
          >
            {data.summary}
          </p>
        </section>
      )}

      <FocusSkills data={data} accent={accent} />
      <FocusExperience data={data} />
      <EducationSection
        data={data}
        title="Education"
        titleClass="mb-2 text-[10pt] font-black uppercase tracking-[0.18em]"
      />
      <ProjectsSection
        data={data}
        title="Projects"
        titleClass="mb-2 text-[10pt] font-black uppercase tracking-[0.18em]"
      />
      <CertificationsSection
        data={data}
        title="Certifications"
        titleClass="mb-2 text-[10pt] font-black uppercase tracking-[0.18em]"
      />
    </TemplateRoot>
  );
}
