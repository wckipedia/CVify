import type { ResumeData } from '../../types/resume';
import {
  AvatarPlaceholder,
  CertificationsSection,
  ContactSection,
  PillSectionTitle,
  ProjectsSection,
  SkillsListSection,
  TemplateRoot,
} from './layoutShared';

function SidebarExperience({
  data,
  accent,
}: {
  data: ResumeData;
  accent: string;
}) {
  if (data.experience.length === 0) return null;
  return (
    <section className="resume-section">
      <PillSectionTitle accent={accent}>Experience</PillSectionTitle>
      <div className="mt-4 space-y-4 border-t border-neutral-300 pt-4">
        {data.experience.map((entry) => (
          <article key={entry.id} className="resume-entry">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-bold">{entry.role || 'Role'}</h3>
              <span className="shrink-0 text-neutral-600">
                {[entry.startDate, entry.endDate].filter(Boolean).join(' – ')}
              </span>
            </div>
            <p className="font-medium text-neutral-700">
              {entry.company}
              {entry.location && `, ${entry.location}`}
            </p>
            {entry.bullets.filter(Boolean).length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-neutral-700">
                {entry.bullets.filter(Boolean).map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function SidebarEducation({
  data,
  accent,
}: {
  data: ResumeData;
  accent: string;
}) {
  if (data.education.length === 0) return null;
  return (
    <section className="resume-section">
      <PillSectionTitle accent={accent}>Education</PillSectionTitle>
      <div className="mt-4 space-y-3 border-t border-neutral-300 pt-4">
        {data.education.map((entry) => (
          <article key={entry.id} className="resume-entry">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-bold">{entry.degree || 'Degree'}</h3>
              <span className="shrink-0 text-neutral-600">
                {[entry.startDate, entry.endDate].filter(Boolean).join(' – ')}
              </span>
            </div>
            <p className="text-neutral-700">{entry.school}</p>
            {entry.notes && (
              <p className="text-neutral-600">{entry.notes}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function SidebarProTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor || '#FACC15';
  const sidebarBg = '#3D3D3D';
  const { personalInfo } = data;
  const nameParts = (personalInfo.name || 'Your Name').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Your';
  const lastName = nameParts.slice(1).join(' ') || 'Name';

  return (
    <TemplateRoot
      data={data}
      className="relative font-[Helvetica,Arial,sans-serif]"
    >
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-40 w-[55%] rounded-bl-[80px]"
        style={{ backgroundColor: sidebarBg }}
      />

      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24pt] font-black uppercase leading-none tracking-tight text-neutral-400">
            {firstName}
          </h1>
          <h1 className="text-[24pt] font-black uppercase leading-none tracking-tight text-neutral-800">
            {lastName}
          </h1>
          {personalInfo.title && (
            <p className="mt-2 text-[11pt] font-bold text-neutral-900">
              {personalInfo.title}
            </p>
          )}
        </div>
        <AvatarPlaceholder
          name={personalInfo.name || 'Your Name'}
          accent={accent}
          className="size-24 shrink-0 rounded-full border-[5px] bg-neutral-300"
          style={{ borderColor: accent }}
        />
      </div>

      <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-xl md:grid-cols-[0.85fr_1.15fr]">
        <aside
          className="space-y-5 px-5 py-6 text-white md:rounded-l-xl md:rounded-tr-[48px]"
          style={{ backgroundColor: sidebarBg }}
        >
          {data.visibility.summary && data.summary.trim() && (
            <section className="resume-section">
              <h2 className="mb-2 text-[11pt] font-bold uppercase tracking-wide">
                About Me
              </h2>
              <p className="text-[10pt] leading-relaxed text-white/90">
                {data.summary}
              </p>
            </section>
          )}

          <ContactSection
            data={data}
            title="Contact"
            titleClass="mb-3 text-[11pt] font-bold uppercase tracking-wide text-white"
            itemClassName="text-[10pt] text-white/90"
            variant="icons"
            accent={accent}
          />

          <SkillsListSection
            data={data}
            title="Skills"
            titleClass="mb-2 text-[11pt] font-bold uppercase tracking-wide text-white"
            contentClassName="text-[10pt] text-white/90"
          />
        </aside>

        <main className="space-y-5 bg-white px-5 py-6 md:rounded-r-xl">
          <SidebarExperience data={data} accent={accent} />
          <SidebarEducation data={data} accent={accent} />
          <ProjectsSection
            data={data}
            title="Projects"
            titleClass="mb-2 text-[11pt] font-bold uppercase tracking-wide"
            titleStyle={{ color: '#525252' }}
          />
          <CertificationsSection
            data={data}
            title="Certifications"
            titleClass="mb-2 text-[11pt] font-bold uppercase tracking-wide"
            titleStyle={{ color: '#525252' }}
            listClass="list-disc space-y-1 pl-5 text-neutral-700"
          />
        </main>
      </div>
    </TemplateRoot>
  );
}
