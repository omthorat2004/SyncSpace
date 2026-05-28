import { setCurrentSpace } from '@/features/space/spaceSlice';
import { useAppDispatch } from '@/store/hook';
import { FiLayers, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

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

    const handleClick = () => {
        dispatch(setCurrentSpace(space));
        navigate(`/dashboard/spaces/${space.id}`);
    };

    return (
        <article
            onClick={handleClick}
            className="card rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{space.name}</h3>
                    <p className="text-sm text-muted mt-2 line-clamp-2">{space.description}</p>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-surface-container border border-border text-muted whitespace-nowrap">
                    Updated {space.updated_at}
                </span>
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
        </article>
    );
};

export default SpaceCard;