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
    const confirmed = window.confirm(
      "Are you sure you want to delete this content?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await dispatch(
        deleteContent({
          spaceId,
          contentId: content.id,
        })
      ).unwrap();

      onDelete?.();
    } catch (error) {
      console.error("Failed to delete content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      const text =
        content.type === "link"
          ? content.url
          : content.content;

      if (!text) return;

      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const badgeClassMap = {
    note: "chip-note",
    link: "chip-link",
    code: "chip-code",
  };

  const badgeClass =
    badgeClassMap[content.type as keyof typeof badgeClassMap] ??
    "chip-tag";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <article
      className="
        card
        hover-lift
        group
        relative
        overflow-hidden
      "
    >
      {/* Glow Border */}
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-500 pointer-events-none
          bg-gradient-to-r from-accent/10 via-secondary/10 to-accent/10
        "
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className="
                text-lg font-semibold text-foreground
                truncate
              "
            >
              {content.title}
            </h3>

            <span
              className={`
                chip inline-block mt-2 capitalize
                ${badgeClass}
              `}
            >
              {content.type}
            </span>
          </div>

          <div className="text-xs text-muted whitespace-nowrap">
            {formatDate(content.created_at)}
          </div>
        </div>

        {/* Content */}
        <p
          className="
            text-muted text-sm mb-4
            line-clamp-3 break-words
          "
        >
          {content.content}
        </p>

        {/* URL */}
        {content.url && (
          <div className="mb-4">
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-link hover:text-link-hover
                text-sm truncate block
                transition-colors
                hover:no-underline!
              "
            >
              Open Link →
            </a>
          </div>
        )}

        {/* Actions */}
        <div
          className="
            flex gap-2 justify-end pt-3
            border-t border-border
          "
        >
          <button
            onClick={handleCopy}
            className="
              px-3 py-1.5 text-xs font-medium
              bg-border text-foreground
              rounded-md
              hover:bg-muted/20
              transition-all duration-200
            "
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(content)}
              className="
                px-3 py-1.5 text-xs font-medium
                bg-accent text-accent-text
                rounded-md
                hover:bg-accent-hover
                transition-all duration-200
              "
            >
              Edit
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="
              px-3 py-1.5 text-xs font-medium
              bg-destructive text-white
              rounded-md
              hover:bg-destructive-hover
              transition-all duration-200
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
};