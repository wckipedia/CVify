import { Skeleton } from './skeleton';

export function BuilderPageSkeleton() {
  return (
    <div className="min-h-screen pb-8 pt-24">
      <Skeleton className="fixed left-4 right-4 top-4 mx-auto h-14 max-w-[1600px] rounded-2xl" />
      <main className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 lg:flex-row">
        <Skeleton className="h-[720px] w-full rounded-2xl lg:max-w-xl" />
        <Skeleton className="h-[720px] min-w-0 flex-1 rounded-2xl" />
      </main>
    </div>
  );
}
