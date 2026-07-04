// components/InviteModal.tsx
import { useState, useRef, useEffect } from 'react';
import { FiX, FiEye, FiEdit2, FiUserPlus } from 'react-icons/fi';
import { toast } from 'sonner';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string, permission: 'view' | 'edit') => Promise<void>;
    currentUserEmail?: string;
    isSubmitting: boolean;
}

export const InviteModal = ({
    isOpen,
    onClose,
    onSubmit,
    currentUserEmail,
    isSubmitting,
}: InviteModalProps) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<'view' | 'edit'>('view');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setEmail('');
            setPermission('view');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            toast.warning('Please enter an email address');
            return;
        }

        if (currentUserEmail && currentUserEmail.toLowerCase() === email.toLowerCase()) {
            toast.warning("You can't invite yourself!");
            return;
        }

        await onSubmit(email, permission);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div
                className="fixed inset-0 bg-black/70 transition-opacity duration-200"
                onClick={onClose}
            />
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-xl mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-foreground">
                                Invite to Space
                            </h3>
                            <p className="text-xs sm:text-sm text-muted mt-1">
                                Invite people to collaborate
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted hover:bg-surface-container transition-colors"
                            aria-label="Close modal"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                            Email address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="colleague@example.com"
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm sm:text-base"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                            Permission
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => setPermission('view')}
                                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs sm:text-sm ${
                                    permission === 'view'
                                        ? 'bg-foreground text-background'
                                        : 'bg-surface-container text-muted hover:bg-surface-container-high'
                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                <FiEye size={14} />
                                Can view
                            </button>
                            <button
                                type="button"
                                onClick={() => setPermission('edit')}
                                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs sm:text-sm ${
                                    permission === 'edit'
                                        ? 'bg-foreground text-background'
                                        : 'bg-surface-container text-muted hover:bg-surface-container-high'
                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                <FiEdit2 size={14} />
                                Can edit
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:flex-1 px-4 py-2.5 rounded-full border border-border text-foreground hover:bg-surface-container transition-colors font-medium text-sm"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:flex-1 px-4 py-2.5 rounded-full bg-foreground text-background hover:bg-secondary transition-colors font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <FiUserPlus size={16} />
                                    Send Invite
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};