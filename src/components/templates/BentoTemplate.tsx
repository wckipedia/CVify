import type { CSSProperties, ReactNode } from 'react';
import type { ResumeData } from '../../types/resume';
import {
  CertificationsSection,
  ContactSection,
  EducationSection,
  ProjectsSection,
  SkillsListSection,
  TemplateRoot,
  getInitials,
} from './layoutShared';

function BentoCell({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl border border-neutral-300 p-4 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function BentoHeading({
  children,
  accent,
}: {
  children: ReactNode;
  accent: string;
}) {
  return (
    <h2
      className="mb-2 text-[10pt] font-black uppercase tracking-widest"
      style={{ color: accent }}
    >
      {children}
    </h2>
  );
}

export function BentoTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor || '#7C3AED';
  const { personalInfo } = data;
  const sectionTitle = 'mb-2 text-[10pt] font-black uppercase tracking-widest';
  const sectionStyle = { color: accent };

  return (
    <TemplateRoot data={data} className="font-[Helvetica,Arial,sans-serif]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
        <BentoCell
          className="sm:col-span-4"
          style={{ backgroundColor: `${accent}12` }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-[14pt] font-bold text-white"
              style={{ backgroundColor: accent }}
            >
              {getInitials(personalInfo.name || 'YN')}
            </div>
            <div>
              <h1 className="text-[22pt] font-black leading-tight">
                {personalInfo.name || 'Your Name'}
              </h1>
              {personalInfo.title && (
                <p className="text-[11pt] font-medium text-neutral-600">
                  {personalInfo.title}
                </p>
              )}
            </div>
          </div>
        </BentoCell>

        <BentoCell className="sm:col-span-2" style={{ backgroundColor: '#fafafa' }}>
          <ContactSection
            data={data}
            title="Contact"
            titleClass={sectionTitle}
            titleStyle={sectionStyle}
            itemClassName="text-[10pt] text-neutral-700"
          />
        </BentoCell>

        {data.visibility.summary && data.summary.trim() && (
          <BentoCell className="sm:col-span-3">
            <BentoHeading accent={accent}>About</BentoHeading>
            <p className="leading-relaxed text-neutral-800">{data.summary}</p>
          </BentoCell>
        )}

        {data.skills.length > 0 && (
          <BentoCell
            className="sm:col-span-3"
            style={{ backgroundColor: `${accent}08` }}
          >
            <SkillsListSection
              data={data}
              title="Skills"
              titleClass={sectionTitle}
              titleStyle={sectionStyle}
            />
          </BentoCell>
        )}

        {data.experience.length > 0 && (
          <BentoCell className="sm:col-span-4">
            <BentoHeading accent={accent}>Experience</BentoHeading>
            <div className="space-y-3">
              {data.experience.map((entry) => (
                <article key={entry.id} className="resume-entry">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3 className="font-bold">{entry.role}</h3>
                    <span className="text-[9pt] text-neutral-500">
                      {[entry.startDate, entry.endDate]
                        .filter(Boolean)
                        .join(' – ')}
                    </span>
                  </div>
                  <p className="text-[10pt] text-neutral-600">
                    {entry.company}
                    {entry.location && ` · ${entry.location}`}
                  </p>
                  {entry.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-1 list-disc pl-4 text-[10pt] text-neutral-700">
                      {entry.bullets.filter(Boolean).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </BentoCell>
        )}

        {data.education.length > 0 && (
          <BentoCell className="sm:col-span-2" style={{ backgroundColor: '#fafafa' }}>
            <EducationSection
              data={data}
              title="Education"
              titleClass={sectionTitle}
              titleStyle={sectionStyle}
            />
          </BentoCell>
        )}

        {data.visibility.projects && data.projects.length > 0 && (
          <BentoCell className="sm:col-span-3">
            <ProjectsSection
              data={data}
              title="Projects"
              titleClass={sectionTitle}
              titleStyle={sectionStyle}
            />
          </BentoCell>
        )}

        {data.visibility.certifications && data.certifications.length > 0 && (
          <BentoCell className="sm:col-span-3">
            <CertificationsSection
              data={data}
              title="Certifications"
              titleClass={sectionTitle}
              titleStyle={sectionStyle}
              listClass="list-disc space-y-1 pl-4 text-[10pt] text-neutral-700"
            />
          </BentoCell>
        )}
      </div>
    </TemplateRoot>
  );
}
