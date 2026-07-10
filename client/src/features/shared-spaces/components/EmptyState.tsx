// components/EmptyState.tsx
import { FiUsers, FiUserPlus } from 'react-icons/fi';

interface EmptyStateProps {
    onInviteClick: () => void;
}

export const EmptyState = ({ onInviteClick }: EmptyStateProps) => {
    return (
        <div className="rounded-xl border border-border bg-card p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-container flex items-center justify-center">
                    <FiUsers size={28} className="sm:size-8 text-muted" />
                </div>
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                        No collaborators yet
                    </h3>
                    <p className="text-sm text-muted max-w-md px-4">
                        Invite people to collaborate on this space.
                        They can view or edit content based on the permissions you set.
                    </p>
                </div>
                <button
                    onClick={onInviteClick}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-accent text-accent-text hover:bg-accent-hover transition-colors font-medium text-sm sm:text-base"
                >
                    <FiUserPlus size={16} />
                    Invite People
                </button>
            </div>
        </div>
    );
};