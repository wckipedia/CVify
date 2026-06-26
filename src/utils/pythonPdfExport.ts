import type { ResumeData } from '../types/resume';

interface PdfExportResponse {
  blob: Blob;
  filename: string;
}

function sanitizeFilename(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  return cleaned || 'resume';
}

function filenameFromDisposition(disposition: string | null): string | null {
  if (!disposition) return null;

  const match = /filename="?([^";]+)"?/i.exec(disposition);
  return match?.[1] ?? null;
}

export async function exportPdfWithPython(
  data: ResumeData,
  filename = 'resume',
): Promise<PdfExportResponse> {
  const response = await fetch('/api/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, filename: sanitizeFilename(filename) }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Python PDF export failed.');
  }

  const blob = await response.blob();
  const responseFilename =
    filenameFromDisposition(response.headers.get('Content-Disposition')) ??
    `${sanitizeFilename(filename)}.pdf`;

  return { blob, filename: responseFilename };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
