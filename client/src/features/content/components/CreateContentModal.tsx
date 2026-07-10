import Modal from "@/components/atoms/Modal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiAlertCircle } from "react-icons/fi";
import { type Content, type ContentType } from "../content.type";
import { createContent, updateContent } from "../contentSlice";

interface CreateContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    spaceId: number;
    onSuccess?: () => void;
    /** When provided, the modal edits this content instead of creating a new one. */
    editingContent?: Content | null;
}

export const CreateContentModal = ({
    isOpen,
    onClose,
    spaceId,
    onSuccess,
    editingContent = null,
}: CreateContentModalProps) => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.content);
    const isEditMode = editingContent !== null;

    const [formData, setFormData] = useState({
        title: "",
        type: "note" as ContentType,
        content: "",
        url: "",
    });
    const [tagsInput, setTagsInput] = useState("");

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Reset the form whenever the modal transitions to open (or switches which
    // content it's editing) — adjusted during render per React's guidance
    // (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
    // rather than in an effect, so it applies before the first paint instead
    // of causing an extra render.
    const formKey = !isOpen ? null : editingContent ? `edit-${editingContent.id}` : "create";
    const [loadedFormKey, setLoadedFormKey] = useState<string | null>(null);
    if (formKey !== loadedFormKey) {
        setLoadedFormKey(formKey);
        if (formKey !== null) {
            if (editingContent) {
                setFormData({
                    title: editingContent.title,
                    type: editingContent.type,
                    content: editingContent.content,
                    url: editingContent.url ?? "",
                });
                setTagsInput((editingContent.tags ?? []).join(", "));
            } else {
                setFormData({ title: "", type: "note", content: "", url: "" });
                setTagsInput("");
            }
            setFormErrors({});
            setTouched({});
        }
    }

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case "title":
                if (!value.trim()) return "Title is required";
                if (value.trim().length < 1) return "Title must be at least 1 character";
                if (value.trim().length > 255) return "Title must be less than 255 characters";
                return undefined;

            case "content":
                if (!value.trim()) return "Content is required";
                if (value.length > 50000) return "Content must be less than 50,000 characters";
                return undefined;

            case "url":
                if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
                    return "URL must start with http:// or https://";
                }
                return undefined;

            default:
                return undefined;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        const fieldsToValidate = ["title", "content"];
        if (formData.type === "link") {
            fieldsToValidate.push("url");
        }

        fieldsToValidate.forEach((field) => {
            const error = validateField(field, formData[field as keyof typeof formData]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (touched[name]) {
            const error = validateField(name, value);
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                if (error) {
                    newErrors[name] = error;
                } else {
                    delete newErrors[name];
                }
                return newErrors;
            });
        }
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const error = validateField(name, value);
        setFormErrors((prev) => {
            const newErrors = { ...prev };
            if (error) {
                newErrors[name] = error;
            } else {
                delete newErrors[name];
            }
            return newErrors;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const tags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        try {
            if (isEditMode && editingContent) {
                await dispatch(
                    updateContent({
                        spaceId,
                        contentId: editingContent.id,
                        title: formData.title,
                        content: formData.content,
                        url: formData.type === "link" ? formData.url || undefined : undefined,
                        tags,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createContent({
                        spaceId,
                        title: formData.title,
                        type: formData.type,
                        content: formData.content,
                        url: formData.url || undefined,
                        tags,
                    })
                ).unwrap();
            }

            setFormData({ title: "", type: "note", content: "", url: "" });
            setTagsInput("");
            setFormErrors({});
            setTouched({});
            onClose();
            onSuccess?.();
        } catch (err) {
            console.error(`Failed to ${isEditMode ? "update" : "create"} content:`, err);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Content" : "Create Content"}
            description={isEditMode ? "Update this item" : "Add a new note, link, or code snippet"}
            footer={
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="content-form"
                        disabled={loading || !formData.title.trim() || !formData.content.trim()}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-text hover:bg-accent-hover transition-colors font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <AiOutlineLoading3Quarters className="animate-spin" size={16} />}
                        {loading
                            ? isEditMode ? "Saving..." : "Creating..."
                            : isEditMode ? "Save changes" : "Create Content"}
                    </button>
                </div>
            }
        >
            {error && (
                <div className="mb-5 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3 items-start">
                    <FiAlertCircle className="text-destructive shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <form id="content-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                        Title *
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter content title"
                        disabled={loading}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-soft ${formErrors.title && touched.title
                            ? "border-destructive bg-destructive/5"
                            : "border-border bg-background hover:border-accent/50"
                            }`}
                    />
                    {formErrors.title && touched.title && (
                        <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                            <span>•</span>
                            {formErrors.title}
                        </p>
                    )}
                    <p className="text-xs text-muted mt-1.5">{formData.title.length} / 255 characters</p>
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
                        Type *
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={loading || isEditMode}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-soft"
                    >
                        <option value="note">Note</option>
                        <option value="link">Link</option>
                        <option value="code">Code</option>
                    </select>
                    {isEditMode && (
                        <p className="text-xs text-muted mt-1.5">Content type can't be changed after creation.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
                        Content *
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter your content here"
                        disabled={loading}
                        rows={4}
                        maxLength={50000}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-soft resize-none ${formErrors.content && touched.content
                            ? "border-destructive bg-destructive/5"
                            : "border-border bg-background hover:border-accent/50"
                            }`}
                    />
                    {formErrors.content && touched.content && (
                        <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                            <span>•</span>
                            {formErrors.content}
                        </p>
                    )}
                    <p className="text-xs text-muted mt-1.5">{formData.content.length} / 50,000 characters</p>
                </div>

                {formData.type === "link" && (
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
                            URL *
                        </label>
                        <input
                            id="url"
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="https://example.com"
                            disabled={loading}
                            className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-soft ${formErrors.url && touched.url
                                ? "border-destructive bg-destructive/5"
                                : "border-border bg-background hover:border-accent/50"
                                }`}
                        />
                        {formErrors.url && touched.url && (
                            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                                <span>•</span>
                                {formErrors.url}
                            </p>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor="content-tags" className="block text-sm font-medium text-foreground mb-2">
                        Tags
                    </label>
                    <input
                        id="content-tags"
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="work, reference, urgent"
                        disabled={loading}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-soft"
                    />
                    <p className="text-xs text-muted mt-1.5">Comma-separated</p>
                </div>
            </form>
        </Modal>
    );
};
