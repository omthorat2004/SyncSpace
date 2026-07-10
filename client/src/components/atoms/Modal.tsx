import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: ReactNode
    footer?: ReactNode
    maxWidth?: 'sm' | 'md' | 'lg'
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
}

const Modal = ({ isOpen, onClose, title, description, children, footer, maxWidth = 'md' }: ModalProps) => {
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <>
            <div
                className="fixed inset-0 bg-black/55 backdrop-blur-[2px] z-40 transition-opacity duration-200"
                onClick={onClose}
                role="presentation"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:py-8">
                <div
                    className={`w-full ${maxWidthClasses[maxWidth]} max-h-[85vh] flex flex-col bg-card border border-border rounded-2xl shadow-lg animate-in fade-in zoom-in-95 duration-200`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 border-b border-border shrink-0">
                        <div className="min-w-0">
                            <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-foreground truncate">
                                {title}
                            </h2>
                            {description && (
                                <p className="text-sm text-muted mt-1">{description}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="shrink-0 p-1.5 text-muted hover:text-foreground hover:bg-surface-container rounded-lg transition-colors"
                            aria-label="Close modal"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="px-5 sm:px-6 py-5 overflow-y-auto custom-scrollbar">
                        {children}
                    </div>

                    {footer && (
                        <div className="px-5 sm:px-6 py-4 border-t border-border shrink-0">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Modal
