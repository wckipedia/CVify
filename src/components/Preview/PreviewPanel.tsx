import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useResumeStore } from '../../store/resumeStore';
import { ResumePreviewSkeleton } from '../ui/resume-preview-skeleton';
import { getTemplateComponent, getTemplateName } from '../templates/registry';
import { PreviewLayoutControls } from './PreviewLayoutControls';
import { TemplateBrowser } from './TemplateBrowser';

export function PreviewPanel() {
  const data = useResumeStore((s) => s.data);
  const isExportingPdf = useResumeStore((s) => s.isExportingPdf);
  const Template = getTemplateComponent(data.layout.template);
  const [browserOpen, setBrowserOpen] = useState(false);
  const [previewRevealed, setPreviewRevealed] = useState(true);
  const [pageBreakPx, setPageBreakPx] = useState(1056);
  const previewRef = useRef<HTMLDivElement>(null);
  const firstPageRef = useRef<HTMLDivElement>(null);

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

  useLayoutEffect(() => {
    const page = firstPageRef.current;
    const source = page?.querySelector<HTMLElement>('[data-resume-page-source]');
    if (!page || !source) return;

    const pageHeight = page.clientHeight;
    const sourceTop = source.getBoundingClientRect().top;
    const candidates = Array.from(
      source.querySelectorAll<HTMLElement>('.resume-section, .resume-entry'),
    )
      .map((node) => Math.round(node.getBoundingClientRect().top - sourceTop))
      .filter((top) => top > pageHeight * 0.62 && top < pageHeight - 16);

    const nextBreak = candidates.length
      ? Math.max(...candidates)
      : pageHeight;

    setPageBreakPx((current) =>
      Math.abs(current - nextBreak) > 2 ? nextBreak : current,
    );
  }, [data]);

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
          <div
            ref={previewRef}
            id="resume-print-content"
            className={cn(
              'mx-auto flex w-[8.5in] max-w-none flex-col gap-6 text-left transition-opacity duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)] print:gap-0',
              isExportingPdf && 'invisible',
              browserOpen && !previewRevealed ? 'opacity-0' : 'opacity-100',
            )}
          >
            <div
              ref={firstPageRef}
              className="resume-print-page h-[11in] w-full overflow-hidden rounded-lg border border-neutral-300/70 bg-white p-6 shadow-inner sm:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none"
            >
              <div
                data-resume-page-source
                style={{ height: pageBreakPx, overflow: 'hidden' }}
              >
                <Template data={data} />
              </div>
            </div>
            <div
              className="resume-print-page h-[11in] w-full overflow-hidden rounded-lg border border-neutral-300/70 bg-white p-6 shadow-inner sm:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none"
              aria-label="Resume page 2"
            >
              <div
                data-resume-page-source
                style={{ transform: `translateY(-${pageBreakPx}px)` }}
              >
                <Template data={data} />
              </div>
            </div>
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
