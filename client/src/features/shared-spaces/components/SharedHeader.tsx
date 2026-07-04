// components/SharedHeader.tsx
import { FiUsers, FiUserPlus } from 'react-icons/fi';

interface SharedHeaderProps {
    spaceName?: string;
    onInviteClick: () => void;
}

export const SharedHeader = ({ spaceName, onInviteClick }: SharedHeaderProps) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <FiUsers className="text-muted" size={20} />
                    <h2 className="text-xl font-semibold text-foreground">Shared with others</h2>
                </div>
                <p className="text-sm text-muted">
                    Manage who has access to "{spaceName || 'this space'}"
                </p>
            </div>

            <button
                onClick={onInviteClick}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-foreground text-background hover:bg-secondary transition-colors font-medium text-sm sm:text-base"
            >
                <FiUserPlus size={16} />
                <span className="hidden xs:inline">Invite People</span>
                <span className="xs:hidden">Invite</span>
            </button>
        </div>
    );
};