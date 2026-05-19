// components/skeleton/StatsSkeleton.tsx

import Skeleton from './Skeleton';

export const StatsSkeleton = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16 mt-3" />
    </div>
  );
};