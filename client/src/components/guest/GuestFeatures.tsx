import React from 'react';
import { FiClipboard, FiFolder, FiLayers, FiSearch, FiShield, FiUsers } from 'react-icons/fi';

const features = [
    { icon: <FiFolder size={20} aria-hidden />, title: 'Spaces for every topic', description: 'Create dedicated spaces for notes, links, and code snippets so related work stays grouped.' },
    { icon: <FiClipboard size={20} aria-hidden />, title: 'Structured content', description: 'Add titles, summaries, tags, and descriptions that make information easy to scan.' },
    { icon: <FiSearch size={20} aria-hidden />, title: 'Fast find', description: 'Search across all spaces with instant results and clear organization.' },
    { icon: <FiLayers size={20} aria-hidden />, title: 'Clear workspace', description: 'Keep the dashboard minimal with soft cards, subtle borders, and precise spacing.' },
    { icon: <FiUsers size={20} aria-hidden />, title: 'Team-ready flow', description: 'Invite collaborators and make shared work easy to browse and maintain.' },
    { icon: <FiShield size={20} aria-hidden />, title: 'Secure by design', description: 'Protect your notes and links while keeping access simple for your workflow.' }
];

const GuestFeatures: React.FC = () => {
    return (
        <section className="features-section" aria-label="Features">
            <div className="section-intro">
                <p className="section-eyebrow">Built for clarity</p>
                <h2 className="section-heading">Focus on content, not clutter</h2>
                <p className="section-copy">A soft grayscale design keeps the guest page calm, readable, and easy to scan on every screen.</p>
            </div>

            <div className="features-grid">
                {features.map((f) => (
                    <article key={f.title} className="feature-card">
                        <div className="feature-icon">{f.icon}</div>
                        <h3 className="feature-title">{f.title}</h3>
                        <p className="feature-copy">{f.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default GuestFeatures;
