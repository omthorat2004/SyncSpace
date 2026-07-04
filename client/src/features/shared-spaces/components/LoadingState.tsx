// components/LoadingState.tsx
export const LoadingState = () => {
    return (
        <div className="rounded-xl border border-border bg-card p-8 sm:p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
            <p className="mt-4 text-sm text-muted">Loading collaborators...</p>
        </div>
    );
};