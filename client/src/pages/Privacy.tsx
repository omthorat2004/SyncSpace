const Privacy = () => {
    return (
        <div className="min-h-full bg-background text-foreground">
            <div className="page-container py-12 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Legal</p>
                <h1 className="text-3xl font-bold mt-2 mb-6">Privacy Policy</h1>

                <div className="space-y-6 text-sm leading-7 text-muted">
                    <p>
                        SyncSpace stores the information you provide directly: your name, email address, and the
                        spaces and content you create. We use it only to operate the product for you and the
                        collaborators you choose to share spaces with.
                    </p>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">What we store</h2>
                        <p>
                            Account details (name, email, hashed password), the spaces and content you create,
                            and sharing relationships between you and other users.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">Sharing</h2>
                        <p>
                            Content in a space is only visible to its owner and the specific users that space has
                            been shared with. We do not sell your data to third parties.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">Your control</h2>
                        <p>
                            You can rename or delete your spaces and content at any time, and remove
                            collaborators' access from the sharing panel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
