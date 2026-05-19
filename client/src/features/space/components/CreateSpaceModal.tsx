import type { CreateSpaceFormData } from '@/features/space/space.type'
import {
    clearError,
    closeCreateModal,
    createSpace,
    selectIsCreateModalOpen,
    selectSpaceError,
    selectSpaceLoading,
} from '@/features/space/spaceSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FiAlertCircle, FiX } from 'react-icons/fi'

/**
 * CreateSpaceModal Component
 * Modal for creating a new workspace space
 * Follows industry standards with proper validation and error handling
 */
export const CreateSpaceModal = () => {
    const dispatch = useAppDispatch()
    const isOpen = useAppSelector(selectIsCreateModalOpen)
    const loading = useAppSelector(selectSpaceLoading)
    const error = useAppSelector(selectSpaceError)

    const [formData, setFormData] = useState<CreateSpaceFormData>({
        name: '',
        description: '',
    })

    const [formErrors, setFormErrors] = useState<Partial<CreateSpaceFormData>>({})
    const [touched, setTouched] = useState<Partial<Record<keyof CreateSpaceFormData, boolean>>>({})

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: '', description: '' })
            setFormErrors({})
            setTouched({})
        }
    }, [isOpen])

    // Clear error when user starts editing
    useEffect(() => {
        if (error) {
            dispatch(clearError())
        }
    }, [formData, dispatch, error])

    /**
     * Validate individual field
     */
    const validateField = (name: keyof CreateSpaceFormData, value: string): string | undefined => {
        switch (name) {
            case 'name':
                if (!value.trim()) {
                    return 'Space name is required'
                }
                if (value.trim().length < 3) {
                    return 'Space name must be at least 3 characters'
                }
                if (value.trim().length > 50) {
                    return 'Space name must be less than 50 characters'
                }
                return undefined

            case 'description':
                if (value.length > 200) {
                    return 'Description must be less than 200 characters'
                }
                return undefined

            default:
                return undefined
        }
    }

    /**
     * Validate entire form
     */
    const validateForm = (): boolean => {
        const newErrors: Partial<CreateSpaceFormData> = {}

        Object.keys(formData).forEach((key) => {
            const fieldError = validateField(key as keyof CreateSpaceFormData, formData[key as keyof CreateSpaceFormData])
            if (fieldError) {
                newErrors[key as keyof CreateSpaceFormData] = fieldError
            }
        })

        setFormErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    /**
     * Handle input change
     */
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        const field = name as keyof CreateSpaceFormData

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Validate on change if field has been touched
        if (touched[field]) {
            const fieldError = validateField(field, value)
            setFormErrors((prev) => ({
                ...prev,
                [field]: fieldError,
            }))
        }
    }

    /**
     * Handle field blur
     */
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        const field = name as keyof CreateSpaceFormData

        setTouched((prev) => ({
            ...prev,
            [field]: true,
        }))

        const fieldError = validateField(field, value)
        setFormErrors((prev) => ({
            ...prev,
            [field]: fieldError,
        }))
    }

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await dispatch(createSpace(formData)).unwrap()
            // Modal will close automatically via Redux state
        } catch (err) {
            // Error is already handled in Redux state
            console.error('Create space failed:', err)
        }
    }

    /**
     * Handle modal close
     */
    const handleClose = () => {
        dispatch(closeCreateModal())
    }

    if (!isOpen) {
        return null
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 bg-opacity-50 z-40 transition-opacity duration-200"
                onClick={handleClose}
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
                            <h2 className="text-xl font-bold text-foreground">Create New Space</h2>
                            <p className="text-sm text-muted mt-1">
                                Start organizing your ideas in a new workspace
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
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
                        {/* Space Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                Space Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="e.g., Project Alpha, Learning Notes"
                                disabled={loading}
                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${formErrors.name && touched.name
                                    ? 'border-destructive bg-destructive/5'
                                    : 'border-border bg-background hover:border-accent/50'
                                    }`}
                            />
                            {formErrors.name && touched.name && (
                                <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                                    <span>•</span>
                                    {formErrors.name}
                                </p>
                            )}
                            <p className="text-xs text-muted mt-1.5">{formData.name.length} / 50 characters</p>
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="What is this space about? (optional)"
                                disabled={loading}
                                rows={4}
                                maxLength={200}
                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-slate-900 resize-none ${formErrors.description && touched.description
                                    ? 'border-destructive bg-destructive/5'
                                    : 'border-border bg-background hover:border-accent/50'
                                    }`}
                            />
                            {formErrors.description && touched.description && (
                                <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                                    <span>•</span>
                                    {formErrors.description}
                                </p>
                            )}
                            <p className="text-xs text-muted mt-1.5">{formData.description.length} / 200 characters</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.name.trim()}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-text hover:bg-accent-hover transition-colors font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && <AiOutlineLoading3Quarters className="animate-spin" size={16} />}
                                {loading ? 'Creating...' : 'Create Space'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateSpaceModal
