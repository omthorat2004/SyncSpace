// components/UserRow.tsx
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import { useState, useRef, useEffect } from 'react';
import { FiMail, FiEdit2, FiEye, FiClock, FiMoreVertical } from 'react-icons/fi';
import {type SharedUser } from '../types';
import { formatDate } from '@/utils/format';
import { DropdownMenu } from './DropdownMenu';


interface UserRowProps {
    user: SharedUser;
    isSubmitting: boolean;
    onPermissionChange: (userId: number, permission: 'view' | 'edit') => void;
    onRemove: (userId: number) => void;
    onResend: (userId: number) => void;
}

export const UserRow = ({ 
    user, 
    isSubmitting, 
    onPermissionChange, 
    onRemove, 
    onResend 
}: UserRowProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isEdit = user.permission === 'edit';
    const permissionIcon = isEdit ? <FiEdit2 size={11} /> : <FiEye size={11} />;
    const permissionLabel = isEdit ? 'Can edit' : 'Can view';

    return (
        <tr className="border-b border-border hover:bg-surface-container/50 transition-colors">
            <td className="px-3 sm:px-5 py-3">
                <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                            {user.name}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted">
                            <FiMail size={8} className="sm:size-[10px] shrink-0" />
                            <span className="truncate max-w-[80px] sm:max-w-none">{user.email}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-3 sm:px-5 py-3">
                <Badge variant={isEdit ? 'accent' : 'neutral'} icon={permissionIcon} className="text-[10px] sm:text-xs">
                    <span className="hidden xs:inline">{permissionLabel}</span>
                    <span className="xs:hidden">{isEdit ? 'Edit' : 'View'}</span>
                </Badge>
            </td>
            <td className="hidden sm:table-cell px-3 sm:px-5 py-3">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted">
                    <FiClock size={8} className="sm:size-[11px]" />
                    <span>{formatDate(user.shared_at)}</span>
                </div>
            </td>
            <td className="px-3 sm:px-5 py-3 text-right relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 sm:p-1.5 rounded-lg hover:bg-surface-container transition-colors"
                    aria-label="More options"
                    disabled={isSubmitting}
                >
                    <FiMoreVertical size={16} className="sm:size-[18px] text-muted" />
                </button>
                {showMenu && (
                    <div ref={menuRef} className="absolute right-0 top-full mt-1 z-50">
                        <DropdownMenu
                            user={user}
                            isSubmitting={isSubmitting}
                            onPermissionChange={onPermissionChange}
                            onRemove={onRemove}
                            onResend={onResend}
                            onClose={() => setShowMenu(false)}
                        />
                    </div>
                )}
            </td>
        </tr>
    );
};