import { FiLayers, FiUsers } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export type SpaceCardData = {
    id: number
    name: string
    description: string
    members: number
    items: number
    updated: string
    tags: string[]
}

interface SpaceCardProps {
    space: SpaceCardData
}

const SpaceCard = ({ space }: SpaceCardProps) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/dashboard/spaces/${space.id}`)
    }

    return (
        <article
            onClick={handleClick}
            className="rounded-xl border border-border bg-card p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">{space.name}</h3>
                    <p className="text-sm text-muted mt-2">{space.description}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-background border border-border text-muted whitespace-nowrap">
                    Updated {space.updated}
                </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {space.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-background border border-border text-muted">
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-5 mt-5 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted">
                    <FiUsers size={14} />
                    {space.members} members
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted">
                    <FiLayers size={14} />
                    {space.items} items
                </span>
            </div>
        </article>
    )
}

export default SpaceCard
