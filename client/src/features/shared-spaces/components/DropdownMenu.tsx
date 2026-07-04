// components/DropdownMenu.tsx
import { FiEdit2, FiEye, FiMail, FiTrash2, FiCheck } from 'react-icons/fi';
import {type SharedUser } from '../types';

interface DropdownMenuProps {
    user: SharedUser;
    isSubmitting: boolean;
    onPermissionChange: (userId: number, permission: 'view' | 'edit') => void;
    onRemove: (userId: number) => void;
    onResend: (userId: number) => void;
    onClose: () => void;
}

export const DropdownMenu = ({
    user,
    isSubmitting,
    onPermissionChange,
    onRemove,
    onResend,
    onClose,
}: DropdownMenuProps) => {
    const handleAction = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <div className="w-48 sm:w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            <div className="py-1">
                <div className="px-3 py-2 text-[10px] sm:text-xs font-semibold text-muted border-b border-border">
                    Change permission
                </div>
                <button
                    onClick={() => handleAction(() => onPermissionChange(user.id, 'edit'))}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-xs sm:text-sm flex items-center gap-2 hover:bg-surface-container transition-colors ${
                        user.permission === 'edit' ? 'text-accent' : 'text-foreground'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FiEdit2 size={14} />
                    Can edit
                    {user.permission === 'edit' && <FiCheck size={14} className="ml-auto" />}
                </button>
                <button
                    onClick={() => handleAction(() => onPermissionChange(user.id, 'view'))}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-xs sm:text-sm flex items-center gap-2 hover:bg-surface-container transition-colors ${
                        user.permission === 'view' ? 'text-accent' : 'text-foreground'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FiEye size={14} />
                    Can view
                    {user.permission === 'view' && <FiCheck size={14} className="ml-auto" />}
                </button>
                <div className="border-t border-border my-1"></div>
                {user.status === 'pending' && (
                    <button
                        onClick={() => handleAction(() => onResend(user.id))}
                        disabled={isSubmitting}
                        className={`w-full px-3 py-2 text-xs sm:text-sm flex items-center gap-2 hover:bg-surface-container transition-colors text-foreground ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <FiMail size={14} />
                        Resend invite
                    </button>
                )}
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to remove this user\'s access?')) {
                            handleAction(() => onRemove(user.id));
                        }
                    }}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-xs sm:text-sm flex items-center gap-2 hover:bg-destructive/10 transition-colors text-destructive ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <FiTrash2 size={14} />
                    Remove access
                </button>
            </div>
        </div>
    );
};