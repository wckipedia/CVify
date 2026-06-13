import type { ResumeData } from '../../types/resume';
import { ResumeSections, TemplateShell } from './shared';

export function TechTemplate({ data }: { data: ResumeData }) {
  const accent = data.layout.accentColor;

  return (
    <TemplateShell
      data={data}
      fontFamily="font-[Inter,system-ui,sans-serif]"
      headerClass="border border-neutral-300 bg-neutral-50 p-4"
      nameClass="font-[ui-monospace,monospace] text-[18pt] font-bold"
      nameStyle={{ color: accent }}
      titleClass="mt-1 font-[ui-monospace,monospace] text-[11pt] text-neutral-600"
      contactClass="mt-2 font-[ui-monospace,monospace] text-[9pt] text-neutral-500"
    >
      <ResumeSections
        data={data}
        headingClass="mb-2 font-[ui-monospace,monospace] text-[10pt] font-bold uppercase tracking-wider"
        headingStyle={{ color: accent }}
        sectionClass="border-l-2 pl-3"
        sectionStyle={{ borderColor: accent }}
      />
    </TemplateShell>
  );
}
