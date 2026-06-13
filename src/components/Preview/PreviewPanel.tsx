import { useResumeStore } from '../../store/resumeStore';
import { ResumePreviewSkeleton } from '../ui/resume-preview-skeleton';
import { getTemplateComponent, getTemplateName } from '../templates/registry';

export function PreviewPanel() {
  const data = useResumeStore((s) => s.data);
  const isExportingPdf = useResumeStore((s) => s.isExportingPdf);
  const Template = getTemplateComponent(data.layout.template);

  return (
    <div className="p-6 print:p-0">
      <div className="no-print mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Live Preview
        </h2>
        <span className="text-xs text-neutral-400">
          {getTemplateName(data.layout.template)}
        </span>
      </div>
      <div className="relative">
        {isExportingPdf && (
          <div className="absolute inset-0 z-10">
            <ResumePreviewSkeleton />
          </div>
        )}
        <div
          id="resume-print-content"
          className={`mx-auto min-h-[11in] max-w-[8.5in] rounded-lg bg-white p-10 text-left shadow-inner print:mx-0 print:min-h-0 print:max-w-none print:rounded-none print:p-0 print:shadow-none ${
            isExportingPdf ? 'invisible' : ''
          }`}
        >
          <Template data={data} />
        </div>
      </div>
    </div>
  );
}
