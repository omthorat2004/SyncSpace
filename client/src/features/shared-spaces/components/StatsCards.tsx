// components/StatsCards.tsx
import { type Stats } from '../types';

interface StatsCardsProps {
    stats: Stats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
    const cards = [
        { label: 'Total collaborators', value: stats.total, className: '' },
        { label: 'Can edit', value: stats.editors, className: 'text-accent' },
        { label: 'Can view', value: stats.viewers, className: 'text-muted' },
        { label: 'Pending invites', value: stats.pending, className: 'text-warning' },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
            {cards.map((card, index) => (
                <div 
                    key={index}
                    className="rounded-xl border border-border bg-card p-3 sm:p-4"
                >
                    <p className="text-[10px] sm:text-xs text-muted">{card.label}</p>
                    <p className={`text-lg sm:text-xl font-bold mt-1 ${card.className}`}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
};