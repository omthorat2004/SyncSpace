import React from 'react';
import { FiClipboard, FiFolder, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const GuestHero: React.FC = () => {
    return (
        <section className="hero-section" aria-labelledby="hero-heading">
            <div className="absolute inset-x-0 top-0 h-48 hero-gradient" />
            <div className="hero-grid">
                <div className="hero-copy-block" role="region" aria-label="Intro">
                    <span className="hero-eyebrow">Guest workspace for organized notes</span>
                    <h1 id="hero-heading" className="hero-title">
                        A calm, clean workspace for notes, links, and team knowledge.
                    </h1>
                    <p className="hero-copy">
                        SyncSpace helps guests understand the app instantly with clear organization, fast search, and a minimal workspace that puts content first.
                    </p>

                    <div className="hero-actions">
                        <Link to="/register" className="primary-button">
                            Get started
                        </Link>
                        <Link to="/login" className="secondary-button">
                            Sign in
                        </Link>
                    </div>
                </div>

                <div className="preview-panel" role="region" aria-label="Workspace preview">
                    <span className="panel-label">Workspace preview</span>
                    <div className="preview-grid">
                        {/* preview items are intentionally simple and semantic */}
                        <article className="preview-card">
                            <div className="preview-card-top">
                                <div className="preview-icon" aria-hidden>
                                    <FiFolder size={18} />
                                </div>
                                <div>
                                    <p className="preview-card-title">Project spaces</p>
                                    <p className="preview-card-text">Organize content by topic and project.</p>
                                </div>
                            </div>
                        </article>
                        <article className="preview-card">
                            <div className="preview-card-top">
                                <div className="preview-icon" aria-hidden>
                                    <FiSearch size={18} />
                                </div>
                                <div>
                                    <p className="preview-card-title">Instant search</p>
                                    <p className="preview-card-text">Find notes and links without extra clicks.</p>
                                </div>
                            </div>
                        </article>
                        <article className="preview-card">
                            <div className="preview-card-top">
                                <div className="preview-icon" aria-hidden>
                                    <FiClipboard size={18} />
                                </div>
                                <div>
                                    <p className="preview-card-title">Quick notes</p>
                                    <p className="preview-card-text">Capture ideas and reference material as you browse.</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuestHero;
