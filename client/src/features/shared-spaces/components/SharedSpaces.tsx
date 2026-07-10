import Avatar from '@/components/atoms/Avatar';
import {
    FiArrowRight,
    FiShare2,
    FiClock,
    FiEdit2,
    FiEye,
    FiFolder,
    FiUser,
    FiAlertCircle
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { protectedApi } from '@/services/api.service';
import { formatDate } from '@/utils/format';

interface SharedSpace {
    id: number;
    name: string;
    description: string | null;
    owner_id: number;
    owner_name: string;
    shared_at: string;
    item_count: number;
    permission: 'view' | 'edit';
}

const SharedSpaces = () => {
    const navigate = useNavigate();
    const [sharedSpaces, setSharedSpaces] = useState<SharedSpace[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'edit' | 'view'>('all');

    useEffect(() => {
        let cancelled = false;

        const fetchSharedSpaces = async () => {
            try {
                setLoading(true);
                const response = await protectedApi.getSharedWithMeSpaces();
                if (!cancelled) {
                    setSharedSpaces(response.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch spaces shared with you:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchSharedSpaces();
        return () => {
            cancelled = true;
        };
    }, []);

    const filteredSpaces = sharedSpaces.filter(space =>
        filter === 'all' ? true : space.permission === filter
    );

    if (loading) {
        return null;
    }

    return (
        <div className="mt-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <FiShare2 className="text-muted" size={20} />
                        <h2 className="text-xl font-semibold text-foreground">Shared with you</h2>
                    </div>
                    <p className="text-sm text-muted">
                        Spaces that others have shared with you
                    </p>
                </div>

                {sharedSpaces.length > 0 && (
                    <div className="flex gap-2">
                        {(['all', 'edit', 'view'] as const).map((option) => (
                            <button
                                key={option}
                                onClick={() => setFilter(option)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize flex items-center gap-1.5 ${filter === option
                                        ? 'bg-foreground text-background'
                                        : 'bg-surface-container text-muted hover:bg-surface-container-high'
                                    }`}
                            >
                                {option === 'all' && <FiFolder size={14} />}
                                {option === 'edit' && <FiEdit2 size={14} />}
                                {option === 'view' && <FiEye size={14} />}
                                {option === 'all' ? 'All' : `Can ${option}`}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Shared Spaces Grid */}
            {filteredSpaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSpaces.map((space) => (
                        <article
                            key={space.id}
                            className="card group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => navigate(`/dashboard/spaces/${space.id}`)}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-accent/5 via-secondary/5 to-accent/5" />

                            <div className="relative z-10 p-5">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-foreground truncate">
                                            {space.name}
                                        </h3>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${space.permission === 'edit'
                                            ? 'bg-accent/10 text-accent'
                                            : 'bg-muted/10 text-muted'
                                        }`}>
                                        {space.permission === 'edit' ? (
                                            <FiEdit2 size={11} />
                                        ) : (
                                            <FiEye size={11} />
                                        )}
                                        {space.permission === 'edit' ? 'Can edit' : 'Can view'}
                                    </span>
                                </div>

                                <p className="text-sm text-muted mb-4 line-clamp-2">
                                    {space.description || 'No description'}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div className="flex items-center gap-2.5">
                                        <Avatar name={space.owner_name} size="sm" />

                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <FiUser size={11} className="text-muted" />
                                                <p className="text-xs font-medium text-foreground">
                                                    {space.owner_name}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted">
                                                <FiClock size={11} />
                                                <span>Shared {formatDate(space.shared_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted">
                                        <span className="flex items-center gap-1.5">
                                            <FiFolder size={12} />
                                            {space.item_count} items
                                        </span>
                                        <FiArrowRight
                                            size={14}
                                            className="group-hover:translate-x-1 transition-transform duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="card rounded-xl p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center">
                            <FiShare2 size={32} className="text-muted" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">No shared spaces yet</h3>
                            <p className="text-sm text-muted max-w-md">
                                When someone shares a space with you, it will appear here.
                                You can also share your spaces with others.
                            </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <span className="text-sm text-muted flex items-center gap-1.5">
                                <FiAlertCircle size={14} />
                                Open one of your spaces and use "Invite" to share it
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SharedSpaces;
