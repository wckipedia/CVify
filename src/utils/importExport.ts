import type { ResumeData } from '../types/resume';
import { exportPdf as downloadPdf } from './exportPdf';
import { parseResumeJson } from './validation';

export function exportResumeJson(data: ResumeData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'resume-data.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

export function importResumeJson(file: File): Promise<ResumeData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result;
        if (typeof content !== 'string') {
          reject(new Error('Could not read file.'));
          return;
        }
        resolve(parseResumeJson(content));
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Import failed.'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}

export async function exportPdf(filename = 'resume'): Promise<void> {
  await downloadPdf(filename);
}
