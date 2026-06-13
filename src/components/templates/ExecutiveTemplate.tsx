import type { ResumeData } from '../../types/resume';
import { ResumeSections, TemplateShell } from './shared';

export function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor;

  return (
    <TemplateShell
      data={data}
      fontFamily="font-[Inter,system-ui,sans-serif]"
      headerClass="border-b-4 pb-4 text-center"
      headerStyle={{ borderColor: accent }}
      nameClass="text-[24pt] font-bold uppercase tracking-wide"
      nameStyle={{ color: accent }}
      titleClass="mt-2 text-[12pt] font-medium text-neutral-700"
      contactClass="mt-3 text-[10pt] text-neutral-600"
    >
      <ResumeSections
        data={data}
        headingClass="mb-2 border-b border-neutral-300 pb-1 text-[11pt] font-bold uppercase tracking-wider"
        headingStyle={{ color: accent }}
      />
    </TemplateShell>
  );
}
