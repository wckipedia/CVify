import type { ResumeData } from '../../types/resume';
import { ResumeSections, TemplateShell } from './shared';

export function ChronicleTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor || '#1f2937';

  return (
    <TemplateShell
      data={data}
      fontFamily="font-[Georgia,Times,serif]"
      headerClass="mb-5 border-b border-neutral-900 pb-4 text-center"
      nameClass="text-[25pt] font-bold leading-tight tracking-normal"
      nameStyle={{ color: '#111827' }}
      titleClass="mt-1 text-[12pt] font-normal uppercase tracking-[0.12em] text-neutral-700"
      contactClass="mx-auto mt-3 max-w-[6.8in] text-[10pt] leading-relaxed text-neutral-600"
      headerExtra={
        <div
          className="mx-auto mt-3 h-0.5 w-24"
          style={{ backgroundColor: accent }}
        />
      }
    >
      <ResumeSections
        data={data}
        headingClass="mb-2 border-b border-neutral-300 pb-1 text-[10pt] font-bold uppercase tracking-[0.18em]"
        headingStyle={{ color: accent }}
        sectionClass="text-[10.5pt] leading-relaxed"
      />
    </TemplateShell>
  );
}
