import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { type ContentType } from "../content.type";
import { createContent } from "../contentSlice";

interface CreateContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    spaceId: number;
    onSuccess?: () => void;
}

export const CreateContentModal = ({
    isOpen,
    onClose,
    spaceId,
    onSuccess,
}: CreateContentModalProps) => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.content);

    const [formData, setFormData] = useState({
        title: "",
        type: "note" as ContentType,
        content: "",
        url: "",
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

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

        try {
            await dispatch(
                createContent({
                    spaceId,
                    title: formData.title,
                    type: formData.type,
                    content: formData.content,
                    url: formData.url || undefined,
                })
            ).unwrap();

            setFormData({ title: "", type: "note", content: "", url: "" });
            setFormErrors({});
            setTouched({});
            onClose();
            onSuccess?.();
        } catch (err: any) {
            console.error("Failed to create content:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 bg-opacity-50 z-40 transition-opacity duration-200"
                onClick={onClose}
                role="presentation"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
                <div
                    className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Create Content</h2>
                            <p className="text-sm text-muted mt-1">
                                Add a new note, link, or code snippet
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="p-1 text-muted hover:text-foreground hover:bg-muted/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Close modal"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mx-6 mt-5 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3 items-start">
                            <FiAlertCircle className="text-destructive shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Title Field */}
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
                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${formErrors.title && touched.title
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

                        {/* Type Field */}
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
                                disabled={loading}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                            >
                                <option value="note">Note</option>
                                <option value="link">Link</option>
                                <option value="code">Code</option>
                            </select>
                        </div>

                        {/* Content Field */}
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
                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-slate-900 resize-none ${formErrors.content && touched.content
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

                        {/* URL Field (only for links) */}
                        {formData.type === "link" && (
                            <div>
                                <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
                                    URL {formData.type === "link" ? "*" : ""}
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
                                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${formErrors.url && touched.url
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

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
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
                                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-text hover:bg-accent-hover transition-colors font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && <AiOutlineLoading3Quarters className="animate-spin" size={16} />}
                                {loading ? "Creating..." : "Create Content"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
