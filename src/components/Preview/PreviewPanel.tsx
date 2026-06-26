import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useResumeStore } from '../../store/resumeStore';
import { ResumePreviewSkeleton } from '../ui/resume-preview-skeleton';
import { getTemplateName } from '../templates/registry';
import { PreviewLayoutControls } from './PreviewLayoutControls';
import { ResumePrintDocument } from './ResumePrintDocument';
import { TemplateBrowser } from './TemplateBrowser';

export function PreviewPanel() {
  const data = useResumeStore((s) => s.data);
  const isExportingPdf = useResumeStore((s) => s.isExportingPdf);
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

  const getPreviewElement = useCallback(() => previewRef.current, []);

  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-6 print:block print:p-0">
      <div className="no-print mb-4 flex shrink-0 flex-col items-center gap-4 text-center">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          <span>Live Preview</span>
          <span aria-hidden="true">•</span>
          <span>{getTemplateName(data.layout.template)}</span>
        </h2>
        <PreviewLayoutControls onOpenTemplates={handleOpenTemplates} />
      </div>
      <div className="preview-scroll no-print min-h-0 flex-1 overflow-x-auto overflow-y-auto pb-2 overscroll-y-contain lg:overflow-x-visible">
        <div className="relative mx-auto w-max min-w-full lg:w-auto">
          {isExportingPdf && (
            <div className="absolute inset-0 z-10">
              <ResumePreviewSkeleton />
            </div>
          )}
          <ResumePrintDocument
            ref={previewRef}
            id="resume-print-content"
            data={data}
            hidden={isExportingPdf}
            contentClassName={cn(
              browserOpen && !previewRevealed ? 'opacity-0' : 'opacity-100',
            )}
          />
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
