import { useEffect, useMemo } from 'react';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { createDefaultResume } from '@/utils/defaults';
import { validateResumeData } from '@/utils/validation';
import type { ResumeData } from '@/types/resume';

declare global {
  interface Window {
    __CVIFY_PRINT_DATA__?: unknown;
    __CVIFY_PRINT_READY__?: boolean;
  }
}

function getPrintData(): ResumeData {
  const injectedData = window.__CVIFY_PRINT_DATA__;
  if (validateResumeData(injectedData)) return injectedData;
  return createDefaultResume();
}

export function PrintPage() {
  const data = useMemo(() => getPrintData(), []);

  useEffect(() => {
    async function markReady() {
      await document.fonts.ready;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.__CVIFY_PRINT_READY__ = true;
        });
      });
    }

    void markReady();
  }, []);

  return (
    <main className="cvify-print-shell min-h-screen bg-white">
      <div id="resume-print-content" className="cvify-print-flow">
        <TemplateRenderer data={data} />
      </div>
    </main>
  );
}
