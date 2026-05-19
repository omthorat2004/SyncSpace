// components/skeleton/HeaderSkeleton.tsx

import Skeleton from './Skeleton';

export const HeaderSkeleton = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-4">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full max-w-xl" />
    </div>
  );
};