import { ContentCard } from "@/features/content/components/ContentCard";
import { CreateContentModal } from "@/features/content/components/CreateContentModal";
import { type ContentType } from "@/features/content/content.type";
import { fetchContents } from "@/features/content/contentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const SpaceDetail = () => {
    const { spaceId } = useParams<{ spaceId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { contents, loading, error } = useAppSelector((state) => state.content);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<ContentType | "all">("all");
    const [spaceName, setSpaceName] = useState("Space");

    const spaceIdNum = spaceId ? parseInt(spaceId, 10) : 0;

    useEffect(() => {
        if (spaceIdNum > 0) {
            dispatch(fetchContents({ spaceId: spaceIdNum }));
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
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                            Space Details
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-bold mt-2">{spaceName}</h1>
                    </div>
                </div>

                {/* Stats */}
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
                    <div className="flex flex-col md:flex-row md:justify-between gap-5 items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold">Contents</h2>
                            <p className="text-sm text-muted mt-1">
                                Manage all your content in this space
                            </p>
                        </div>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-text hover:bg-accent-hover"
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
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedType === type
                                        ? "bg-accent text-accent-text"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                            <button
                                onClick={handleRefresh}
                                className="ml-2 underline hover:no-underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
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
                                className="px-4 py-2 bg-accent text-accent-text rounded-lg hover:bg-accent-hover"
                            >
                                Create Content
                            </button>
                        </div>
                    )}

                    {/* Content Grid */}
                    {!loading && filteredContents.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredContents.map((content) => (
                                <ContentCard
                                    key={content.id}
                                    content={content}
                                    spaceId={spaceIdNum}
                                    onDelete={handleRefresh}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

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
