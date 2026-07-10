import React from 'react';
import { Link } from 'react-router-dom';

const GuestCTA: React.FC = () => {
    return (
        <section className="cta-section" aria-labelledby="cta-heading">
            <div className="cta-block">
                <p className="cta-eyebrow">Get started</p>
                <h2 id="cta-heading" className="cta-heading">Ready to see the workflow in action?</h2>
                <p className="cta-text">Create your first space, add content, and keep everything easy to find.</p>
                <div className="cta-actions">
                    <Link to="/signup" className="primary-button">Create account</Link>
                    <Link to="/login" className="secondary-button">Sign in</Link>
                </div>
            </div>
        </section>
    );
};

export default GuestCTA;
