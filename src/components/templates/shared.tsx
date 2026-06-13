import type { CSSProperties, ReactNode } from 'react';
import type { FontSize, ResumeData, SectionSpacing } from '../../types/resume';

export function getFontSizeClass(fontSize: FontSize): string {
  switch (fontSize) {
    case 'S':
      return 'text-[10pt] leading-snug';
    case 'L':
      return 'text-[12pt] leading-relaxed';
    default:
      return 'text-[11pt] leading-normal';
  }
}

export function getSectionSpacingClass(spacing: SectionSpacing): string {
  return spacing === 'compact' ? 'space-y-3' : 'space-y-5';
}

export function getContactFields(
  data: ResumeData,
): { key: string; label: string; value: string }[] {
  const { personalInfo } = data;
  return [
    { key: 'email', label: 'Email', value: personalInfo.email },
    { key: 'phone', label: 'Phone', value: personalInfo.phone },
    { key: 'location', label: 'Location', value: personalInfo.location },
    { key: 'website', label: 'Website', value: personalInfo.website },
    { key: 'linkedin', label: 'LinkedIn', value: personalInfo.linkedin },
    { key: 'github', label: 'Additional link', value: personalInfo.github },
  ].filter((field) => field.value.trim());
}

export function getContactItems(data: ResumeData): string[] {
  return getContactFields(data).map((field) => field.value);
}

interface TemplateShellProps {
  data: ResumeData;
  fontFamily: string;
  headerClass: string;
  headerStyle?: CSSProperties;
  nameClass: string;
  nameStyle?: CSSProperties;
  titleClass: string;
  contactClass: string;
  headerExtra?: ReactNode;
  children: ReactNode;
}

export function TemplateShell({
  data,
  fontFamily,
  headerClass,
  headerStyle,
  nameClass,
  nameStyle,
  titleClass,
  contactClass,
  headerExtra,
  children,
}: TemplateShellProps) {
  const { layout } = data;
  const contact = getContactItems(data);
  const rootClass = getFontSizeClass(layout.fontSize);
  const sectionsClass = getSectionSpacingClass(layout.sectionSpacing);

  return (
    <div className={`${rootClass} ${sectionsClass} ${fontFamily} text-black`}>
      <header className={headerClass} style={headerStyle}>
        <h1 className={nameClass} style={nameStyle}>
          {data.personalInfo.name || 'Your Name'}
        </h1>
        {data.personalInfo.title && (
          <p className={titleClass}>{data.personalInfo.title}</p>
        )}
        {contact.length > 0 && (
          <p className={contactClass}>{contact.join(' · ')}</p>
        )}
        {headerExtra}
      </header>
      {children}
    </div>
  );
}

interface ResumeSectionsProps {
  data: ResumeData;
  headingClass: string;
  headingStyle?: CSSProperties;
  sectionClass?: string;
  sectionStyle?: CSSProperties;
}

export function ResumeSections({
  data,
  headingClass,
  headingStyle,
  sectionClass = '',
  sectionStyle,
}: ResumeSectionsProps) {
  const { visibility } = data;

  return (
    <>
      {visibility.summary && data.summary.trim() && (
        <section
          className={`resume-section ${sectionClass}`.trim()}
          style={sectionStyle}
        >
          <h2 className={headingClass} style={headingStyle}>
            Summary
          </h2>
          <p>{data.summary}</p>
        </section>
      )}

      {data.skills.length > 0 && (
        <section
          className={`resume-section ${sectionClass}`.trim()}
          style={sectionStyle}
        >
          <h2 className={headingClass} style={headingStyle}>
            Skills
          </h2>
          <div className="space-y-1">
            {data.skills.map((category) =>
              category.name || category.skills ? (
                <p key={category.id}>
                  {category.name && (
                    <span className="font-semibold">{category.name}: </span>
                  )}
                  {category.skills}
                </p>
              ) : null,
            )}
          </div>
        </section>
      )}

      {data.experience.length > 0 && (
        <section
          className={`resume-section ${sectionClass}`.trim()}
          style={sectionStyle}
        >
          <h2 className={headingClass} style={headingStyle}>
            Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((entry) => (
              <article key={entry.id} className="resume-entry">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold">
                    {entry.role}
                    {entry.company && (
                      <span className="font-normal"> — {entry.company}</span>
                    )}
                  </h3>
                  <span className="shrink-0 text-neutral-600">
                    {[entry.startDate, entry.endDate]
                      .filter(Boolean)
                      .join(' – ')}
                  </span>
                </div>
                {entry.location && (
                  <p className="text-neutral-600">{entry.location}</p>
                )}
                {entry.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc pl-5">
                    {entry.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section
          className={`resume-section ${sectionClass}`.trim()}
          style={sectionStyle}
        >
          <h2 className={headingClass} style={headingStyle}>
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((entry) => (
              <article key={entry.id} className="resume-entry">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold">
                    {entry.degree}
                    {entry.school && (
                      <span className="font-normal"> — {entry.school}</span>
                    )}
                  </h3>
                  <span className="shrink-0 text-neutral-600">
                    {[entry.startDate, entry.endDate]
                      .filter(Boolean)
                      .join(' – ')}
                  </span>
                </div>
                {entry.notes && (
                  <p className="text-neutral-600">{entry.notes}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {visibility.projects && data.projects.length > 0 && (
        <section
          className={`resume-section ${sectionClass}`.trim()}
          style={sectionStyle}
        >
          <h2 className={headingClass} style={headingStyle}>
            Projects
          </h2>
          <div className="space-y-2">
            {data.projects.map((entry) => (
              <article key={entry.id} className="resume-entry">
                <h3 className="font-semibold">
                  {entry.link ? (
                    <a href={entry.link} className="text-inherit underline">
                      {entry.name || entry.link}
                    </a>
                  ) : (
                    entry.name
                  )}
                </h3>
                {entry.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc pl-5">
                    {entry.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {visibility.certifications && data.certifications.length > 0 && (
        <section
          className={`resume-section ${sectionClass}`.trim()}
          style={sectionStyle}
        >
          <h2 className={headingClass} style={headingStyle}>
            Certifications
          </h2>
          <ul className="space-y-1">
            {data.certifications.map((entry) => (
              <li key={entry.id} className="resume-entry">
                <span className="font-semibold">{entry.name}</span>
                {entry.issuer && ` — ${entry.issuer}`}
                {entry.date && ` (${entry.date})`}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
