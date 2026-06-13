import type { CSSProperties, ReactNode } from 'react';
import type { ResumeData } from '../../types/resume';
import { getContactFields, getFontSizeClass, getSectionSpacingClass } from './shared';

const CONTACT_ICONS: Record<string, string> = {
  email: '✉',
  phone: '☎',
  location: '⌖',
  website: '⌁',
  linkedin: 'in',
  github: '↗',
};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function TemplateRoot({
  data,
  className = '',
  style,
  children,
}: {
  data: ResumeData;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={`${getFontSizeClass(data.layout.fontSize)} ${getSectionSpacingClass(data.layout.sectionSpacing)} text-black ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function AvatarPlaceholder({
  name,
  accent,
  className = '',
  style,
  overlay,
}: {
  name: string;
  accent: string;
  className?: string;
  style?: CSSProperties;
  overlay?: ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-neutral-200 text-neutral-600 ${className}`}
      style={style}
      aria-hidden
    >
      <span className="text-[18pt] font-semibold">{getInitials(name)}</span>
      {overlay}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

export function SummarySection({
  data,
  title = 'Summary',
  titleClass,
  titleStyle,
}: {
  data: ResumeData;
  title?: string;
  titleClass: string;
  titleStyle?: CSSProperties;
}) {
  if (!data.visibility.summary || !data.summary.trim()) return null;
  return (
    <section className="resume-section">
      <h2 className={titleClass} style={titleStyle}>
        {title}
      </h2>
      <p className="leading-relaxed">{data.summary}</p>
    </section>
  );
}

export function ExperienceSection({
  data,
  title = 'Experience',
  titleClass,
  titleStyle,
  bulletClass = 'list-disc pl-5',
}: {
  data: ResumeData;
  title?: string;
  titleClass: string;
  titleStyle?: CSSProperties;
  bulletClass?: string;
}) {
  if (data.experience.length === 0) return null;
  return (
    <section className="resume-section">
      <h2 className={titleClass} style={titleStyle}>
        {title}
      </h2>
      <div className="space-y-3">
        {data.experience.map((entry) => (
          <article key={entry.id} className="resume-entry">
            <h3 className="font-bold">{entry.role || 'Role'}</h3>
            <p className="text-neutral-600">
              {[entry.startDate, entry.endDate].filter(Boolean).join(' – ')}
              {entry.company && (
                <>
                  {' '}
                  | {entry.company}
                  {entry.location && `, ${entry.location}`}
                </>
              )}
            </p>
            {entry.bullets.filter(Boolean).length > 0 && (
              <ul className={`mt-1 ${bulletClass}`}>
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

export function EducationSection({
  data,
  title = 'Education',
  titleClass,
  titleStyle,
}: {
  data: ResumeData;
  title?: string;
  titleClass: string;
  titleStyle?: CSSProperties;
}) {
  if (data.education.length === 0) return null;
  return (
    <section className="resume-section">
      <h2 className={titleClass} style={titleStyle}>
        {title}
      </h2>
      <div className="space-y-2">
        {data.education.map((entry) => (
          <article key={entry.id} className="resume-entry">
            <h3 className="font-bold">{entry.degree || 'Degree'}</h3>
            <p className="text-neutral-600">
              {entry.school}
              {[entry.startDate, entry.endDate].filter(Boolean).length > 0 && (
                <>
                  {' '}
                  | {[entry.startDate, entry.endDate].filter(Boolean).join(' – ')}
                </>
              )}
            </p>
            {entry.notes && (
              <p className="mt-0.5 text-neutral-600">{entry.notes}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function SkillsListSection({
  data,
  title = 'Skills',
  titleClass,
  titleStyle,
  listClass = 'list-disc space-y-0.5 pl-5',
  contentClassName = '',
  flat = false,
}: {
  data: ResumeData;
  title?: string;
  titleClass: string;
  titleStyle?: CSSProperties;
  listClass?: string;
  contentClassName?: string;
  flat?: boolean;
}) {
  if (data.skills.length === 0) return null;

  if (flat) {
    const items = data.skills.flatMap((category) =>
      category.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    );
    if (items.length === 0) return null;
    return (
      <section className="resume-section">
        <h2 className={titleClass} style={titleStyle}>
          {title}
        </h2>
        <ul className={`${listClass} ${contentClassName}`.trim()}>
          {items.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="resume-section">
      <h2 className={titleClass} style={titleStyle}>
        {title}
      </h2>
      <div className={`space-y-1 ${contentClassName}`.trim()}>
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
  );
}

export function SkillBarsSection({
  data,
  title = 'Skills',
  titleClass,
  titleStyle,
  accent,
}: {
  data: ResumeData;
  title?: string;
  titleClass: string;
  titleStyle?: CSSProperties;
  accent: string;
}) {
  const items = data.skills.flatMap((category) =>
    category.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
  if (items.length === 0) return null;

  const widths = [95, 88, 82, 76, 90, 85, 78, 92];

  return (
    <section className="resume-section">
      <h2 className={titleClass} style={titleStyle}>
        {title}
      </h2>
      <div className="space-y-2.5">
        {items.map((skill, index) => (
          <div key={`${skill}-${index}`}>
            <p className="font-semibold">{skill}</p>
            <div className="mt-1 h-1.5 w-full rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${widths[index % widths.length]}%`,
                  backgroundColor: accent,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProjectsSection({
  data,
  title = 'Projects',
  titleClass,
  titleStyle,
}: {
  data: ResumeData;
  title?: string;
  titleClass: string;
  titleStyle?: CSSProperties;
}) {
  if (!data.visibility.projects || data.projects.length === 0) return null;
  return (
    <section className="resume-section">
      <h2 className={titleClass} style={titleStyle}>
        {title}
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
  );
}

export function CertificationsSection({
  data,
  title = 'Certifications',
  titleClass,
  titleStyle,
  listClass = 'list-disc space-y-0.5 pl-5',
}: {
  data: ResumeData;
  title?: string;
  titleClass: string;
  titleStyle?: CSSProperties;
  listClass?: string;
}) {
  if (!data.visibility.certifications || data.certifications.length === 0) {
    return null;
  }
  return (
    <section className="resume-section">
      <h2 className={titleClass} style={titleStyle}>
        {title}
      </h2>
      <ul className={listClass}>
        {data.certifications.map((entry) => (
          <li key={entry.id} className="resume-entry">
            <span className="font-semibold">{entry.name}</span>
            {entry.issuer && ` — ${entry.issuer}`}
            {entry.date && ` (${entry.date})`}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ContactSection({
  data,
  title = 'Contact',
  titleClass,
  titleStyle,
  variant = 'list',
  className = '',
  itemClassName = 'text-[10pt]',
  showLabels = false,
  accent,
}: {
  data: ResumeData;
  title?: string;
  titleClass?: string;
  titleStyle?: CSSProperties;
  variant?: 'list' | 'inline' | 'icons';
  className?: string;
  itemClassName?: string;
  showLabels?: boolean;
  accent?: string;
}) {
  const fields = getContactFields(data);
  if (fields.length === 0) return null;

  if (variant === 'inline') {
    return (
      <div className={className}>
        {titleClass && (
          <h2 className={titleClass} style={titleStyle}>
            {title}
          </h2>
        )}
        <p className={itemClassName}>
          {fields.map((field) => field.value).join(' · ')}
        </p>
      </div>
    );
  }

  if (variant === 'icons') {
    return (
      <section className={`resume-section ${className}`.trim()}>
        {titleClass && (
          <h2 className={titleClass} style={titleStyle}>
            {title}
          </h2>
        )}
        <div className="space-y-2.5">
          {fields.map((field) => (
            <div key={field.key} className="flex items-center gap-2.5">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded text-[10pt] text-neutral-900"
                style={{ backgroundColor: accent ?? '#FACC15' }}
              >
                {CONTACT_ICONS[field.key] ?? '•'}
              </span>
              <span className={itemClassName}>
                {showLabels && (
                  <span className="font-semibold">{field.label}: </span>
                )}
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`resume-section ${className}`.trim()}>
      {titleClass && (
        <h2 className={titleClass} style={titleStyle}>
          {title}
        </h2>
      )}
      <div className={`space-y-1 ${itemClassName}`}>
        {fields.map((field) => (
          <p key={field.key}>
            {showLabels && (
              <span className="font-semibold">{field.label}: </span>
            )}
            {field.value}
          </p>
        ))}
      </div>
    </section>
  );
}

export function ContactBar({
  data,
  className = '',
}: {
  data: ResumeData;
  className?: string;
}) {
  const fields = getContactFields(data);
  if (fields.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      {fields.map((field, index) => (
        <span key={field.key} className="flex items-center gap-3">
          {index > 0 && (
            <span className="hidden h-3 w-px bg-current opacity-40 sm:inline" />
          )}
          {field.value}
        </span>
      ))}
    </div>
  );
}

export function ContactItems({
  data,
  className = '',
  separator = ' · ',
}: {
  data: ResumeData;
  className?: string;
  separator?: string;
}) {
  const fields = getContactFields(data);
  if (fields.length === 0) return null;

  return (
    <p className={className}>
      {fields.map((field) => field.value).join(separator)}
    </p>
  );
}

export function PillSectionTitle({
  children,
  accent,
  className = '',
}: {
  children: ReactNode;
  accent: string;
  className?: string;
}) {
  return (
    <h2
      className={`inline-block rounded-full border px-4 py-1 text-[10pt] font-bold uppercase tracking-wide ${className}`}
      style={{ borderColor: accent, color: accent }}
    >
      {children}
    </h2>
  );
}

export function LanguageRings({
  data,
  accent,
}: {
  data: ResumeData;
  accent: string;
}) {
  const categories = data.skills.filter((c) => c.name || c.skills).slice(0, 3);
  if (categories.length === 0) return null;

  const levels = [100, 85, 70];

  return (
    <section className="resume-section">
      <h2 className="mb-3 text-[11pt] font-bold uppercase tracking-wide text-white">
        Languages
      </h2>
      <div className="flex flex-wrap gap-4">
        {categories.map((category, index) => (
          <div key={category.id} className="text-center">
            <p className="mb-2 text-[9pt] text-white/90">
              {category.name || 'Skills'}
            </p>
            <div
              className="relative mx-auto flex size-14 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${accent} ${levels[index]}%, rgba(255,255,255,0.15) 0)`,
              }}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-neutral-800 text-[9pt] font-semibold text-white">
                {levels[index]}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
