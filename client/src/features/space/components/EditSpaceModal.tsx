import Modal from '@/components/atoms/Modal'
import type { Space } from '@/features/space/space.type'
import { updateSpace } from '@/features/space/spaceSlice'
import { useAppDispatch } from '@/store/hook'
import { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FiAlertCircle } from 'react-icons/fi'
import { toast } from 'sonner'

interface EditSpaceModalProps {
    space: Space | null
    onClose: () => void
}

const EditSpaceModal = ({ space, onClose }: EditSpaceModalProps) => {
    const dispatch = useAppDispatch()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (space) {
            setName(space.name)
            setDescription(space.description ?? '')
            setError(null)
        }
    }, [space])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!space) return

        if (!name.trim() || name.trim().length < 3) {
            setError('Space name must be at least 3 characters')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await dispatch(
                updateSpace({ spaceId: space.id, data: { name: name.trim(), description: description.trim() } })
            ).unwrap()
            toast.success('Space updated')
            onClose()
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Failed to update space')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={space !== null}
            onClose={onClose}
            title="Rename Space"
            footer={
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted/10 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-space-form"
                        disabled={loading || !name.trim()}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-text hover:bg-accent-hover transition-colors font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading && <AiOutlineLoading3Quarters className="animate-spin" size={16} />}
                        {loading ? 'Saving...' : 'Save changes'}
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

            <form id="edit-space-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="edit-space-name" className="block text-sm font-medium text-foreground mb-2">
                        Space Name *
                    </label>
                    <input
                        id="edit-space-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent-soft"
                    />
                </div>

                <div>
                    <label htmlFor="edit-space-description" className="block text-sm font-medium text-foreground mb-2">
                        Description
                    </label>
                    <textarea
                        id="edit-space-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        rows={4}
                        maxLength={200}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent-soft resize-none"
                    />
                </div>
            </form>
        </Modal>
    )
}

export default EditSpaceModal
