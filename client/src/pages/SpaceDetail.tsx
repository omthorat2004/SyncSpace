import { ContentCardSkeleton } from "@/components/skeleton/ContentCardSkeleton";
import { ContentCard } from "@/features/content/components/ContentCard";
import { CreateContentModal } from "@/features/content/components/CreateContentModal";
import { type ContentType } from "@/features/content/content.type";
import { fetchContents } from "@/features/content/contentSlice";
import SharedWithYou from "@/features/shared-spaces/components/SharedWithYou";
import { getSharedUsers, shareSpace } from "@/features/shared-spaces/sharedSpaceSlice";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const SpaceDetail = () => {
    const { spaceId } = useParams<{ spaceId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentSpace } = useAppSelector((state) => state.space)
    const { contents, loading, error } = useAppSelector((state) => state.content);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<ContentType | "all">("all");
    const [spaceName] = useState(currentSpace?.name);

    console.log(currentSpace)
    const spaceIdNum = spaceId ? parseInt(spaceId, 10) : 0;

    useEffect(() => {
        if (spaceIdNum > 0) {
            dispatch(fetchContents({ spaceId: spaceIdNum }));
            dispatch(getSharedUsers(spaceIdNum));
        }
    }, [spaceIdNum, dispatch]);

    const filteredContents =
        selectedType === "all"
            ? contents
            : contents.filter((c) => c.type === selectedType);

    const contentStats = {
        total: contents.length,
        notes: contents.filter((c) => c.type === "note").length,
        links: contents.filter((c) => c.type === "link").length,
        code: contents.filter((c) => c.type === "code").length,
    };

    const handleRefresh = () => {
        if (spaceIdNum > 0) {
            dispatch(fetchContents({ spaceId: spaceIdNum }));
        }
    };

    return (
        <div className="min-h-full bg-background text-foreground">
            <div className="site-nav-inner py-8 sm:py-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted hover:bg-surface-container-high transition-colors"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                            Space Details
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-bold mt-2">{spaceName}</h1>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted">Total Items</p>
                        <p className="text-2xl font-bold mt-1">{contentStats.total}</p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted">Notes</p>
                        <p className="text-2xl font-bold mt-1">{contentStats.notes}</p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted">Links</p>
                        <p className="text-2xl font-bold mt-1">{contentStats.links}</p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted">Code</p>
                        <p className="text-2xl font-bold mt-1">{contentStats.code}</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 mb-8">
                    <div className="flex flex-col md:flex-row md:justify-between gap-5 items-start md:items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold">Contents</h2>
                            <p className="text-sm text-muted mt-1">
                                Manage all your content in this space
                            </p>
                        </div>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background hover:bg-secondary transition-colors font-medium"
                        >
                            <FiPlus size={16} />
                            Add Content
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {(["all", "note", "link", "code"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-full transition-colors ${selectedType === type
                                        ? "bg-foreground text-background"
                                        : "bg-surface-container text-muted hover:bg-surface-container-high"
                                    }`}
                            >
                                {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="mb-4 p-4 rounded-xl border border-border bg-destructive/10 text-destructive">
                            <span>{error}</span>
                            <button
                                onClick={handleRefresh}
                                className="ml-3 underline hover:no-underline font-medium"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredContents.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted mb-4">
                                {selectedType === "all"
                                    ? "No content yet. Create your first item!"
                                    : `No ${selectedType}s yet.`}
                            </p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background hover:bg-secondary transition-colors font-medium"
                            >
                                Create Content
                            </button>
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <ContentCardSkeleton key={index} />
                            ))
                        ) : filteredContents.length > 0 ? (
                            filteredContents.map((content) => (
                                <ContentCard
                                    key={content.id}
                                    content={content}
                                    spaceId={spaceIdNum}
                                    onDelete={handleRefresh}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-muted py-10">
                                No content found
                            </div>
                        )}
                    </div>
                </div>

                {/* Shared With You Section */}
                <SharedWithYou
                    spaceId={spaceIdNum}
                    spaceName={spaceName}
                    onShareSpace={(userEmail: string,permission:string) => dispatch(shareSpace({ spaceId: spaceIdNum, userEmail ,permission}))}
                    onRefresh={() => dispatch(getSharedUsers(spaceIdNum))}
                />
            </div>

            {/* Create Content Modal */}
            <CreateContentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                spaceId={spaceIdNum}
                onSuccess={handleRefresh}
            />
        </div>
    );
};

export default SpaceDetail;