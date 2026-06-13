import type { ResumeData } from '../../types/resume';
import { ResumeSections, TemplateShell } from './shared';

export function ElegantTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor;

  return (
    <TemplateShell
      data={data}
      fontFamily="font-[Garamond,'Times_New_Roman',serif]"
      headerClass="border-b border-neutral-300 pb-5 text-center"
      nameClass="text-[22pt] font-normal tracking-[0.08em]"
      nameStyle={{ color: accent }}
      titleClass="mt-2 text-[12pt] italic text-neutral-600"
      contactClass="mt-3 text-[10pt] tracking-wide text-neutral-500"
      headerExtra={
        <div
          className="mx-auto mt-4 h-px w-24"
          style={{ backgroundColor: accent }}
        />
      }
    >
      <ResumeSections
        data={data}
        headingClass="mb-2 text-center text-[10pt] font-normal uppercase tracking-[0.25em]"
        headingStyle={{ color: accent }}
      />
    </TemplateShell>
  );
}
