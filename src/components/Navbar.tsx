import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '../store/resumeStore';
import {
  exportPdf,
  exportResumeJson,
  importResumeJson,
} from '../utils/importExport';
import { GlassPanel } from './GlassPanel';

export function Navbar() {
  const data = useResumeStore((s) => s.data);
  const importError = useResumeStore((s) => s.importError);
  const loadData = useResumeStore((s) => s.loadData);
  const resetData = useResumeStore((s) => s.resetData);
  const setImportError = useResumeStore((s) => s.setImportError);
  const clearImportError = useResumeStore((s) => s.clearImportError);
  const setExportingPdf = useResumeStore((s) => s.setExportingPdf);
  const isExportingPdf = useResumeStore((s) => s.isExportingPdf);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const name = data.personalInfo.name.trim() || 'resume';
      await exportPdf(name);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : 'PDF export failed.',
      );
    } finally {
      setExportingPdf(false);
    }
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const imported = await importResumeJson(file);
      loadData(imported);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <div className="no-print fixed inset-x-0 top-2 z-50 sm:top-4">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4">
          <GlassPanel
            as="nav"
            className="flex w-full flex-col gap-3 px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-4"
          >
            <div className="flex shrink-0 items-center">
              <Link
                to="/"
                className="text-lg font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-70"
              >
                CVify.
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
              <Button
                type="button"
                className="col-span-2 sm:col-span-1"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
              >
                {isExportingPdf ? 'Downloading…' : 'Download PDF'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => exportResumeJson(data)}
              >
                Export JSON
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Import JSON
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="secondary">
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset your resume?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Everything in the editor will be cleared and replaced with a
                      blank template. Export a JSON backup first if you want to keep
                      your current work.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep editing</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={resetData}>
                      Reset resume
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => handleImport(e.target.files?.[0])}
              />
            </div>
          </GlassPanel>
        </div>
      </div>

      {importError && (
        <div
          className="no-print fixed left-3 right-3 top-24 z-50 rounded-lg border border-red-500 bg-red-50 px-4 py-2 text-sm text-red-800 shadow-lg sm:left-1/2 sm:right-auto sm:w-auto sm:max-w-md sm:-translate-x-1/2"
          role="alert"
        >
          {importError}
          <Button
            type="button"
            variant="link"
            className="ml-3 h-auto p-0 text-red-800"
            onClick={clearImportError}
          >
            Dismiss
          </Button>
        </div>
      )}
    </>
  );
}
