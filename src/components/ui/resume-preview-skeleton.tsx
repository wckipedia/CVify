import { Skeleton } from './skeleton';

export function ResumePreviewSkeleton() {
  return (
    <div className="mx-auto min-h-[11in] max-w-[8.5in] rounded-lg bg-white p-10 shadow-inner">
      <div className="space-y-6">
        <div className="space-y-3 border-b border-neutral-200 pb-6 text-center">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto h-4 w-36" />
          <Skeleton className="mx-auto h-3 w-64" />
        </div>

        {[0, 1, 2].map((section) => (
          <div key={section} className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-full max-w-md" />
            <Skeleton className="h-3 w-full max-w-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
