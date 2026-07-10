const Terms = () => {
    return (
        <div className="min-h-full bg-background text-foreground">
            <div className="page-container py-12 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Legal</p>
                <h1 className="text-3xl font-bold mt-2 mb-6">Terms of Service</h1>

                <div className="space-y-6 text-sm leading-7 text-muted">
                    <p>
                        By creating an account and using SyncSpace, you agree to use the service to store and
                        organize your own notes, links, and code snippets, and to only share spaces with people
                        you intend to collaborate with.
                    </p>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">Your content</h2>
                        <p>
                            You retain ownership of everything you create in SyncSpace. You are responsible for
                            the content you add and for managing who you share your spaces with.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">Account responsibility</h2>
                        <p>
                            You're responsible for keeping your account credentials secure and for all activity
                            that happens under your account.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">Changes</h2>
                        <p>
                            These terms may be updated from time to time as the product evolves.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
