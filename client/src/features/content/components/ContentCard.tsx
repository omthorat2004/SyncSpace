import { useAppDispatch } from "@/store/hook";
import { useState } from "react";
import { type Content } from "../content.type";
import { deleteContent } from "../contentSlice";

interface ContentCardProps {
    content: Content;
    spaceId: number;
    onEdit?: (content: Content) => void;
    onDelete?: () => void;
}

export const ContentCard = ({
    content,
    spaceId,
    onEdit,
    onDelete,
}: ContentCardProps) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this content?")) {
            return;
        }

        setLoading(true);
        try {
            await dispatch(
                deleteContent({
                    spaceId,
                    contentId: content.id,
                })
            ).unwrap();
            onDelete?.();
        } catch (err) {
            console.error("Failed to delete content:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getTypeColor = () => {
        switch (content.type) {
            case "note":
                return "chip-note";
            case "link":
                return "chip-link";
            case "code":
                return "chip-code";
            default:
                return "chip-tag";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="card hover-lift">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{content.title}</h3>
                    <span className={`chip chip-tag inline-block mt-2 capitalize ${getTypeColor()}`}>
                        {content.type}
                    </span>
                </div>
                <div className="text-xs text-muted whitespace-nowrap ml-2">{formatDate(content.created_at)}</div>
            </div>

            <p className="text-muted text-sm mb-4 line-clamp-2">{content.content}</p>

            {content.url && (
                <div className="mb-4">
                    <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link hover:text-link-hover text-sm truncate transition-colors"
                    >
                        {content.url}
                    </a>
                </div>
            )}

            <div className="flex gap-2 justify-end pt-2 border-t border-border">
                <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-xs font-medium bg-border text-foreground rounded-md hover:bg-muted transition-colors duration-200"
                    title="Copy content to clipboard"
                >
                    {copied ? "✓ Copied!" : "Copy"}
                </button>
                {onEdit && (
                    <button
                        onClick={() => onEdit(content)}
                        className="px-3 py-1.5 text-xs font-medium bg-accent text-accent-text rounded-md hover:bg-accent-hover transition-colors duration-200"
                        title="Edit this content"
                    >
                        Edit
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs font-medium bg-destructive text-white rounded-md hover:bg-destructive-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete this content"
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
};
