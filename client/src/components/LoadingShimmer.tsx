/**
 * LoadingShimmer Component
 * Displays a full-screen shimmer loading state while session is refreshing
 */

export const LoadingShimmer = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                {/* Header Skeleton */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 relative overflow-hidden mb-8">
                    <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-accent/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-secondary/20 blur-3xl" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div className="flex-1">
                            <div className="shimmer-line w-24 h-3 rounded mb-3" />
                            <div className="shimmer-line w-40 h-8 rounded mb-3" />
                            <div className="shimmer-line w-full h-4 rounded mb-2" />
                            <div className="shimmer-line w-2/3 h-4 rounded" />
                        </div>

                        <div className="shimmer-pill" />
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-xl border border-border bg-card p-4">
                            <div className="shimmer-line w-24 h-3 rounded mb-3" />
                            <div className="shimmer-line w-16 h-8 rounded" />
                        </div>
                    ))}
                </div>

                {/* Content Skeleton */}
                <div>
                    <div className="shimmer-line w-32 h-6 rounded mb-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <article
                                key={index}
                                className="rounded-xl border border-border bg-card p-5"
                            >
                                <div className="shimmer-line w-2/5 h-5 rounded" />
                                <div className="shimmer-line mt-4 w-full h-4 rounded" />
                                <div className="shimmer-line mt-2 w-5/6 h-4 rounded" />
                                <div className="flex gap-2 mt-5">
                                    <div className="shimmer-pill" />
                                    <div className="shimmer-pill" />
                                    <div className="shimmer-pill" />
                                </div>
                                <div className="shimmer-line mt-6 w-1/2 h-4 rounded" />
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingShimmer
