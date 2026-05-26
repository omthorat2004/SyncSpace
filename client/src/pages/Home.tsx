import SpaceCard, { type SpaceCardData } from '@/components/SpaceCard';
import CreateSpaceModal from '@/features/space/components/CreateSpaceModal';
import { fetchSpaces, openCreateModal } from '@/features/space/spaceSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiFolderPlus, FiPlus } from 'react-icons/fi';

import { HeaderSkeleton } from '@/components/skeleton/HeaderSkeleton';
import { SpaceCardSkeleton } from '@/components/skeleton/SpaceCardSkeleton';
import { StatsSkeleton } from '@/components/skeleton/StatsSkeleton';

const Home = () => {
  const dispatch = useAppDispatch();
  const { spaces, loading, error } = useAppSelector((state) => state.space);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchSpaces());
    const timer = window.setTimeout(() => setInitialLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, [dispatch]);

  const handleCreateSpaceClick = () => {
    dispatch(openCreateModal());
  };

  const spaceCards: SpaceCardData[] = spaces.map((space) => ({
    id: space.id,
    name: space.name,
    description: space.description || 'No description',
    members: 1,
    items: 0,
    updated_at: new Date(space.updated_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    created_at: new Date(space.updated_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    owner_id: space.owner_id,
  }));

  const totalSpaces = spaces.length;
  const totalItems = 0;
  const collaborators = 1;
  const recentlyActive = spaces.length > 0 ? 1 : 0;

  if (initialLoading || loading) {
    return (
      <div className="min-h-full bg-background text-foreground dark:bg-slate-950 dark:text-slate-100">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
          <HeaderSkeleton />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatsSkeleton key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SpaceCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground dark:bg-slate-950 dark:text-slate-100">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                Workspace Dashboard
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2">Your Spaces</h1>
              <p className="text-base text-secondary mt-2 max-w-2xl">
                Keep all your notes, links, snippets, and ideas grouped by space.
              </p>
            </div>

            <button
              onClick={handleCreateSpaceClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-slate-900 transition-colors"
            >
              <FiPlus size={16} />
              Create New Space
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Spaces', value: totalSpaces },
            { label: 'Total Items', value: totalItems },
            { label: 'Collaborators', value: collaborators },
            { label: 'Recently Active', value: recentlyActive },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-secondary">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold">Spaces</h2>
            </div>
            {spaceCards.length > 0 && (
              <button className="text-sm text-secondary flex items-center gap-1 hover:text-foreground transition-colors">
                View all <FiArrowRight />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="border border-dashed border-border bg-card p-5 rounded-xl">
              <FiFolderPlus size={20} className="text-secondary" />
              <h3 className="text-lg font-semibold mt-4 text-primary">Create a New Space</h3>
              <p className="text-sm text-secondary mt-2">Start organizing your workflow.</p>

              <button
                onClick={handleCreateSpaceClick}
                className="mt-5 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-slate-900 transition-colors"
              >
                New Space
              </button>
            </article>

            {spaceCards.length > 0 ? (
              spaceCards.map((space) => <SpaceCard key={space.id} space={space} />)
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-8">
                <p className="text-secondary">No spaces yet. Create your first space to get started!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CreateSpaceModal />
    </div>
  );
};

export default Home;
