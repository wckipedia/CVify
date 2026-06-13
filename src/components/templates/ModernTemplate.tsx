import type { ResumeData } from '../../types/resume';
import { ResumeSections, TemplateShell } from './shared';

export function ModernTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor;

  return (
    <TemplateShell
      data={data}
      fontFamily="font-[Inter,system-ui,sans-serif]"
      headerClass="mb-1"
      nameClass="text-[22pt] font-bold tracking-tight"
      nameStyle={{ color: accent }}
      titleClass="mt-1 text-[13pt] font-medium text-neutral-700"
      contactClass="mt-2 text-neutral-600"
      headerExtra={
        <div
          className="mt-3 h-1 w-16 rounded-full"
          style={{ backgroundColor: accent }}
        />
      }
    >
      <ResumeSections
        data={data}
        headingClass="mb-2 text-[11pt] font-bold uppercase tracking-wider"
        headingStyle={{ color: accent }}
      />
    </TemplateShell>
  );
}
