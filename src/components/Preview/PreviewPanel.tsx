import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useResumeStore } from '../../store/resumeStore';
import { ResumePreviewSkeleton } from '../ui/resume-preview-skeleton';
import { getTemplateComponent } from '../templates/registry';
import { PreviewLayoutControls } from './PreviewLayoutControls';
import { TemplateBrowser } from './TemplateBrowser';

export function PreviewPanel() {
  const data = useResumeStore((s) => s.data);
  const isExportingPdf = useResumeStore((s) => s.isExportingPdf);
  const Template = getTemplateComponent(data.layout.template);
  const [browserOpen, setBrowserOpen] = useState(false);
  const [previewRevealed, setPreviewRevealed] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleOpenTemplates = useCallback(() => {
    setPreviewRevealed(false);
    setBrowserOpen(true);
  }, []);

  const handleCloseTemplates = useCallback(() => {
    setBrowserOpen(false);
    setPreviewRevealed(true);
  }, []);

  const handleFlybackStart = useCallback(() => {
    setPreviewRevealed(true);
  }, []);

  const getPreviewElement = useCallback(
    () => previewRef.current,
    [],
  );

  return (
    <div className="p-4 sm:p-6 print:p-0">
      <div className="no-print mb-4 flex flex-col items-center gap-4 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Live Preview
        </h2>
        <PreviewLayoutControls onOpenTemplates={handleOpenTemplates} />
      </div>
      <div className="no-print overflow-x-auto pb-2 lg:overflow-x-visible">
        <div className="relative mx-auto w-max min-w-full lg:w-auto">
          {isExportingPdf && (
            <div className="absolute inset-0 z-10">
              <ResumePreviewSkeleton />
            </div>
          )}
          <div
            ref={previewRef}
            id="resume-print-content"
            className={cn(
              'mx-auto min-h-[11in] w-[8.5in] max-w-none rounded-lg bg-white p-6 text-left shadow-inner transition-opacity duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 print:mx-0 print:min-h-0 print:w-full print:max-w-none print:rounded-none print:p-0 print:shadow-none',
              isExportingPdf && 'invisible',
              browserOpen && !previewRevealed ? 'opacity-0' : 'opacity-100',
            )}
          >
            <Template data={data} />
          </div>
        </div>
      </div>

      <TemplateBrowser
        open={browserOpen}
        onClose={handleCloseTemplates}
        onFlybackStart={handleFlybackStart}
        getPreviewElement={getPreviewElement}
      />
    </div>
  );
}
