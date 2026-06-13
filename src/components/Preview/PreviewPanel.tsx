import { useResumeStore } from '../../store/resumeStore';
import { ResumePreviewSkeleton } from '../ui/resume-preview-skeleton';
import { getTemplateComponent, getTemplateName } from '../templates/registry';

export function PreviewPanel() {
  const data = useResumeStore((s) => s.data);
  const isExportingPdf = useResumeStore((s) => s.isExportingPdf);
  const Template = getTemplateComponent(data.layout.template);

  return (
    <div className="p-4 sm:p-6 print:p-0">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Live Preview
        </h2>
        <span className="text-xs text-neutral-400">
          {getTemplateName(data.layout.template)}
        </span>
      </div>
      <div className="no-print overflow-x-auto pb-2 lg:overflow-x-visible">
        <div className="relative mx-auto w-max min-w-full lg:w-auto">
          {isExportingPdf && (
            <div className="absolute inset-0 z-10">
              <ResumePreviewSkeleton />
            </div>
          )}
          <div
            id="resume-print-content"
            className={`mx-auto min-h-[11in] w-[8.5in] max-w-none rounded-lg bg-white p-6 text-left shadow-inner sm:p-10 print:mx-0 print:min-h-0 print:w-full print:max-w-none print:rounded-none print:p-0 print:shadow-none ${
              isExportingPdf ? 'invisible' : ''
            }`}
          >
            <Template data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
