import { useRef, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '../../store/resumeStore';
import {
  extractResumePdfText,
  parseResumeText,
} from '../../utils/resumePdfImport';

export function ResumePdfUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const data = useResumeStore((s) => s.data);
  const loadData = useResumeStore((s) => s.loadData);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Upload a PDF resume to autofill the editor.');
      setStatus(null);
      return;
    }

    setIsParsing(true);
    setError(null);
    setStatus(`Reading ${file.name}...`);

    try {
      const text = await extractResumePdfText(file, {
        onStatus: setStatus,
      });
      if (text.trim().length < 40) {
        throw new Error('This PDF does not contain enough selectable text.');
      }

      loadData(parseResumeText(text, data));
      setStatus('Resume imported.');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to read this PDF. Try a text-based resume PDF.';
      setError(message);
      setStatus(null);
    } finally {
      setIsParsing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <section className="rounded-lg border border-neutral-200 bg-white/60 p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-neutral-900">
              Autofill from resume PDF
            </h2>
            {status ? (
              <p className="mt-1 text-sm text-neutral-600">{status}</p>
            ) : null}
            {error ? (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            ) : null}
          </div>
        </div>
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isParsing}
          className="h-9 w-full sm:w-auto"
        >
          <Upload className="size-4" aria-hidden="true" />
          {isParsing ? 'Reading PDF...' : 'Upload PDF'}
        </Button>
      </div>
      <Input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
    </section>
  );
}
