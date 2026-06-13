import type { ResumeData } from '../../types/resume';
import { ResumeSections, TemplateShell } from './shared';

export function ATSCleanTemplate({ data }: { data: ResumeData }) {
  return (
    <TemplateShell
      data={data}
      fontFamily="font-[Georgia,'Times_New_Roman',serif]"
      headerClass="border-b border-black pb-3 text-center"
      nameClass="text-[18pt] font-bold"
      titleClass="mt-1 text-neutral-700"
      contactClass="mt-2 text-neutral-600"
    >
      <ResumeSections
        data={data}
        headingClass="mb-1 border-b border-neutral-400 text-[12pt] font-bold uppercase tracking-wide"
      />
    </TemplateShell>
  );
}
