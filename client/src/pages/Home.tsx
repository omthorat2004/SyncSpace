import SpaceCard, { type SpaceCardData } from '@/components/SpaceCard';
import CreateSpaceModal from '@/features/space/components/CreateSpaceModal';
import SharedSpaces from '@/features/shared-spaces/components/SharedSpaces'; // Add this import
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
      <div className="min-h-full bg-background text-foreground">
        <div className="site-nav-inner py-10 space-y-6">
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="site-nav-inner py-10">
        {/* Header Card */}
        <div className="card rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Workspace Dashboard</p>
              <h1 className="text-2xl sm:text-3xl font-semibold mt-2">Your Spaces</h1>
              <p className="text-sm text-muted mt-2 max-w-2xl">Organize notes, links and snippets by space.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateSpaceClick}
                className="primary-button py-2.5 px-5"
              >
                <FiPlus size={16} />
                New space
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Spaces', value: totalSpaces },
            { label: 'Total Items', value: totalItems },
            { label: 'Collaborators', value: collaborators },
            { label: 'Recently Active', value: recentlyActive },
          ].map((stat) => (
            <div key={stat.label} className="card rounded-xl p-4">
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* My Spaces Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-foreground">My Spaces</h2>
            {spaceCards.length > 0 && (
              <button className="text-sm text-muted flex items-center gap-1 hover:text-foreground transition-colors">
                View all <FiArrowRight />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Create Space Card */}
            <article className="card rounded-xl border-dashed p-6 text-left">
              <div className="flex items-center gap-3">
                <FiFolderPlus size={20} className="text-muted" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Create a new space</h3>
                  <p className="text-sm text-muted mt-1">Start organizing your workflow.</p>
                </div>
              </div>

              <button
                onClick={handleCreateSpaceClick}
                className="mt-5 primary-button py-2 px-4"
              >
                New space
              </button>
            </article>

            {/* Existing Spaces */}
            {spaceCards.length > 0 ? (
              spaceCards.map((space) => <SpaceCard key={space.id} space={space} />)
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-12">
                <p className="text-muted">No spaces yet. Create your first space to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Shared Spaces Section - NEW */}
        <SharedSpaces />
      </div>

      <CreateSpaceModal />
    </div>
  )
}

export default Home;