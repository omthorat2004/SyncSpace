import Modal from '@/components/atoms/Modal'
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
import { FiAlertCircle } from 'react-icons/fi'

/**
 * CreateSpaceModal Component
 * Modal for creating a new workspace space
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

    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: '', description: '' })
            setFormErrors({})
            setTouched({})
        }
    }, [isOpen])

    useEffect(() => {
        if (error) {
            dispatch(clearError())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData])

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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        const field = name as keyof CreateSpaceFormData

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        if (touched[field]) {
            const fieldError = validateField(field, value)
            setFormErrors((prev) => ({
                ...prev,
                [field]: fieldError,
            }))
        }
    }

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

    const handleClose = () => {
        dispatch(closeCreateModal())
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create New Space"
            description="Start organizing your ideas in a new workspace"
            footer={
                <div className="flex gap-3">
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
                        form="create-space-form"
                        disabled={loading || !formData.name.trim()}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-text hover:bg-accent-hover transition-colors font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <AiOutlineLoading3Quarters className="animate-spin" size={16} />}
                        {loading ? 'Creating...' : 'Create Space'}
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

            <form id="create-space-form" onSubmit={handleSubmit} className="space-y-5">
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
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-soft ${formErrors.name && touched.name
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
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors placeholder:text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-soft resize-none ${formErrors.description && touched.description
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
            </form>
        </Modal>
    )
}

export default CreateSpaceModal
