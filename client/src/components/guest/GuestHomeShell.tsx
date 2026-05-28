import React from 'react';
import GuestCTA from './GuestCTA';
import GuestFeatures from './GuestFeatures';
import GuestHero from './GuestHero';

const GuestHomeShell: React.FC = () => {
    return (
        <main className="page-shell">
            <div className="page-container">
                <GuestHero />
                <GuestFeatures />
                <GuestCTA />
            </div>
        </main>
    );
};

export default GuestHomeShell;
