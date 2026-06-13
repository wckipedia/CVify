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

  const [{ domToCanvas }, { jsPDF }] = await Promise.all([
    import('modern-screenshot'),
    import('jspdf'),
  ]);

  const { element: captureRoot, cleanup } =
    await createIsolatedCaptureRoot(element);

  try {
    const canvas = await domToCanvas(captureRoot, {
      scale: 2,
      backgroundColor: '#ffffff',
      width: captureRoot.offsetWidth,
      height: captureRoot.offsetHeight,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${sanitizeFilename(filename)}.pdf`);
  } finally {
    cleanup();
  }
}
