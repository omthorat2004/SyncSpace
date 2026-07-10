// components/InviteModal.tsx
import Modal from '@/components/atoms/Modal';
import { useEffect, useState } from 'react';
import { FiEdit2, FiEye, FiUserPlus } from 'react-icons/fi';
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

    useEffect(() => {
        if (isOpen) {
            setEmail('');
            setPermission('view');
        }
    }, [isOpen]);

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Invite to Space"
            description="Invite people to collaborate"
            footer={
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
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
                        form="invite-form"
                        className="w-full sm:flex-1 px-4 py-2.5 rounded-full bg-accent text-accent-text hover:bg-accent-hover transition-colors font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent-text border-t-transparent" />
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
            }
        >
            <form id="invite-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-soft text-sm sm:text-base"
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
                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs sm:text-sm ${permission === 'view'
                                ? 'bg-accent text-accent-text'
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
                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs sm:text-sm ${permission === 'edit'
                                ? 'bg-accent text-accent-text'
                                : 'bg-surface-container text-muted hover:bg-surface-container-high'
                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            <FiEdit2 size={14} />
                            Can edit
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
