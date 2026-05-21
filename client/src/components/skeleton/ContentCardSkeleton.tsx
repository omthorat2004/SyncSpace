export const ContentCardSkeleton = () => {
  return (
    <div className="card overflow-hidden">
      <div className="flex justify-between mb-4">
        <div className="space-y-3 flex-1">
          <div className="shimmer h-5 w-2/3 rounded-md" />
          <div className="shimmer h-5 w-20 rounded-full" />
        </div>

        <div className="shimmer h-4 w-16 rounded-md" />
      </div>

      <div className="space-y-2 mb-5">
        <div className="shimmer h-4 w-full" />
        <div className="shimmer h-4 w-5/6" />
        <div className="shimmer h-4 w-2/3" />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <div className="shimmer h-8 w-16 rounded-md" />
        <div className="shimmer h-8 w-16 rounded-md" />
        <div className="shimmer h-8 w-20 rounded-md" />
      </div>
    </div>
  );
};