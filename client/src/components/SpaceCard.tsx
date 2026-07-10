import EditSpaceModal from '@/features/space/components/EditSpaceModal';
import { deleteSpace, setCurrentSpace } from '@/features/space/spaceSlice';
import type { Space } from '@/features/space/space.type';
import { useAppDispatch } from '@/store/hook';
import { useEffect, useRef, useState } from 'react';
import { FiEdit2, FiLayers, FiMoreVertical, FiTrash2, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type SpaceCardData = {
    id: number;
    name: string;
    description: string;
    members: number;
    items: number;
    updated_at: string;
    created_at: string;
    owner_id: number;
};

interface SpaceCardProps {
    space: SpaceCardData;
}

const SpaceCard = ({ space }: SpaceCardProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [editingSpace, setEditingSpace] = useState<Space | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClick = () => {
        dispatch(setCurrentSpace(space as unknown as Space));
        navigate(`/dashboard/spaces/${space.id}`);
    };

    const handleRename = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        setEditingSpace(space as unknown as Space);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        if (!window.confirm(`Delete "${space.name}"? This will permanently delete all its content.`)) {
            return;
        }
        try {
            await dispatch(deleteSpace(space.id)).unwrap();
            toast.success('Space deleted');
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to delete space');
        }
    };

    return (
        <article
            onClick={handleClick}
            className="card rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer relative"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">{space.name}</h3>
                    <p className="text-sm text-muted mt-2 line-clamp-2">{space.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-surface-container border border-border text-muted whitespace-nowrap">
                        Updated {space.updated_at}
                    </span>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu((v) => !v);
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container transition-colors"
                            aria-label="Space options"
                        >
                            <FiMoreVertical size={16} className="text-muted" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                                <button
                                    onClick={handleRename}
                                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-surface-container transition-colors text-foreground"
                                >
                                    <FiEdit2 size={14} />
                                    Rename
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-destructive/10 transition-colors text-destructive"
                                >
                                    <FiTrash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-5 mt-5 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                    <FiUsers size={14} />
                    {space.members} members
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <FiLayers size={14} />
                    {space.items} items
                </span>
            </div>

            {editingSpace && (
                <div onClick={(e) => e.stopPropagation()}>
                    <EditSpaceModal space={editingSpace} onClose={() => setEditingSpace(null)} />
                </div>
            )}
        </article>
    );
};

export default SpaceCard;