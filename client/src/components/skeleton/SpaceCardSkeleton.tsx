// components/skeleton/SpaceCardSkeleton.tsx

import Skeleton from './Skeleton';

export const SpaceCardSkeleton = () => {
  return (
    <article className="rounded-xl border border-border bg-card p-5 space-y-3">
      <Skeleton className="h-5 w-2/5" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <Skeleton className="h-4 w-1/2 mt-2" />
    </article>
  );
};