import { Skeleton } from './skeleton';

export function BuilderPageSkeleton() {
  return (
    <div className="min-h-screen pb-8 pt-28 sm:pt-32 lg:pt-24">
      <Skeleton className="fixed left-3 right-3 top-2 mx-auto h-20 max-w-[1600px] rounded-2xl sm:left-4 sm:right-4 sm:top-4 sm:h-14" />
      <main className="mx-auto flex max-w-[1600px] flex-col gap-6 px-3 sm:px-4 lg:flex-row">
        <Skeleton className="h-[720px] w-full rounded-2xl lg:max-w-xl" />
        <Skeleton className="h-[720px] min-w-0 flex-1 rounded-2xl" />
      </main>
    </div>
  );
}
