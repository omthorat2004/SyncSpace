import { 
    FiArrowRight, 
    FiShare2, 
    FiClock, 
    FiLock, 
    FiUnlock, 
    FiEdit2, 
    FiEye, 
    FiFolder, 
    FiUser,
    FiAlertCircle
} from 'react-icons/fi';
import { useState } from 'react';

interface SharedSpace {
    id: number;
    name: string;
    description: string;
    owner: {
        name: string;
        avatar?: string;
    };
    shared_at: string;
    items_count: number;
    permission: 'view' | 'edit';
    is_public: boolean;
}

// Sample data - replace with actual API data
const sampleSharedSpaces: SharedSpace[] = [
    {
        id: 1,
        name: 'Design System Documentation',
        description: 'Complete design system guidelines and components for the new product',
        owner: { name: 'Sarah Johnson' },
        shared_at: '2024-01-15T10:30:00Z',
        items_count: 24,
        permission: 'edit',
        is_public: false,
    },
    {
        id: 2,
        name: 'Q1 Marketing Strategy',
        description: 'Marketing plans, content calendar, and campaign assets for Q1',
        owner: { name: 'Michael Chen' },
        shared_at: '2024-01-10T14:20:00Z',
        items_count: 18,
        permission: 'view',
        is_public: false,
    },
    {
        id: 3,
        name: 'Frontend Best Practices',
        description: 'Collection of frontend development resources, patterns, and examples',
        owner: { name: 'Emma Wilson' },
        shared_at: '2024-01-05T09:15:00Z',
        items_count: 32,
        permission: 'edit',
        is_public: true,
    },
    {
        id: 4,
        name: 'User Research Findings',
        description: 'User interviews, surveys, and usability testing results',
        owner: { name: 'David Kumar' },
        shared_at: '2023-12-28T16:45:00Z',
        items_count: 15,
        permission: 'view',
        is_public: false,
    },
];

const SharedSpaces = () => {
    const [sharedSpaces] = useState<SharedSpace[]>(sampleSharedSpaces);
    const [filter, setFilter] = useState<'all' | 'edit' | 'view'>('all');

    const filteredSpaces = sharedSpaces.filter(space => 
        filter === 'all' ? true : space.permission === filter
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

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

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    {(['all', 'edit', 'view'] as const).map((option) => (
                        <button
                            key={option}
                            onClick={() => setFilter(option)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize flex items-center gap-1.5 ${
                                filter === option
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
            </div>

            {/* Shared Spaces Grid */}
            {filteredSpaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSpaces.map((space) => (
                        <article
                            key={space.id}
                            className="card group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => console.log('Navigate to shared space:', space.id)}
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-accent/5 via-secondary/5 to-accent/5" />

                            <div className="relative z-10 p-5">
                                {/* Header with Permission Badge */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-foreground truncate">
                                            {space.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Permission Badge */}
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                            space.permission === 'edit'
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
                                </div>

                                {/* Description */}
                                <p className="text-sm text-muted mb-4 line-clamp-2">
                                    {space.description}
                                </p>

                                {/* Owner & Stats Info */}
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div className="flex items-center gap-2.5">
                                        {/* Avatar */}
                                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
                                            {space.owner.avatar ? (
                                                <img 
                                                    src={space.owner.avatar} 
                                                    alt={space.owner.name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-semibold text-muted">
                                                    {getInitials(space.owner.name)}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <FiUser size={11} className="text-muted" />
                                                <p className="text-xs font-medium text-foreground">
                                                    {space.owner.name}
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
                                            {space.items_count} items
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
                            <button className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1.5">
                                <FiAlertCircle size={14} />
                                Learn about sharing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View All Link (if more than 4 spaces) */}
            {filteredSpaces.length > 4 && (
                <div className="flex justify-center mt-6">
                    <button className="text-sm text-muted hover:text-foreground flex items-center gap-1.5 transition-all duration-200 group">
                        <span>View all shared spaces</span>
                        <FiArrowRight 
                            size={14} 
                            className="group-hover:translate-x-1 transition-transform duration-200" 
                        />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SharedSpaces;