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
            className="rounded-xl border border-outline-variant bg-white p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer dark:bg-slate-950 dark:border-slate-700"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-primary dark:text-white">{space.name}</h3>
                    <p className="text-sm text-secondary mt-2">{space.description}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-background border border-border text-secondary whitespace-nowrap dark:bg-slate-900 dark:border-slate-700">
                    Updated {space.updated_at}
                </span>
            </div>

            <div className="flex items-center gap-5 mt-5 text-sm text-secondary">
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
