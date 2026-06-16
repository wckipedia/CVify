import { createIsolatedCaptureRoot } from './pdfStyles';

function sanitizeFilename(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  return cleaned || 'resume';
}

export async function exportPdf(filename = 'resume'): Promise<void> {
  const element = document.getElementById('resume-print-content');
  if (!element) {
    throw new Error('Resume preview not found.');
  }

  const pages = Array.from(
    element.querySelectorAll<HTMLElement>('.resume-print-page'),
  );
  const captureTargets = pages.length > 0 ? pages : [element];

  const [{ domToCanvas }, { jsPDF }] = await Promise.all([
    import('modern-screenshot'),
    import('jspdf'),
  ]);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (const [index, target] of captureTargets.entries()) {
    const { element: captureRoot, cleanup } =
      await createIsolatedCaptureRoot(target);

    try {
      const canvas = await domToCanvas(captureRoot, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: captureRoot.offsetWidth,
        height: captureRoot.offsetHeight,
      });

      if (index > 0) {
        pdf.addPage();
      }

      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);

      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
      }
    } finally {
      cleanup();
    }
  }

  pdf.save(`${sanitizeFilename(filename)}.pdf`);
}
