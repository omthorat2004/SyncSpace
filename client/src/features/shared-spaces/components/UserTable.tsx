// components/UserTable.tsx
import {type SharedUser } from '../types';
import { UserRow } from './UserRow';

interface UserTableProps {
    users: SharedUser[];
    isSubmitting: boolean;
    onPermissionChange: (userId: number, permission: 'view' | 'edit') => void;
    onRemove: (userId: number) => void;
    onResend: (userId: number) => void;
}

export const UserTable = ({
    users,
    isSubmitting,
    onPermissionChange,
    onRemove,
    onResend,
}: UserTableProps) => {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                    <thead className="bg-surface-container border-b border-border">
                        <tr>
                            <th className="text-left px-3 sm:px-5 py-3 text-[10px] sm:text-xs font-semibold text-muted uppercase tracking-wider">
                                User
                            </th>
                            <th className="text-left px-3 sm:px-5 py-3 text-[10px] sm:text-xs font-semibold text-muted uppercase tracking-wider">
                                Permission
                            </th>
                            <th className="hidden sm:table-cell text-left px-3 sm:px-5 py-3 text-[10px] sm:text-xs font-semibold text-muted uppercase tracking-wider">
                                Shared
                            </th>
                            <th className="text-right px-3 sm:px-5 py-3 text-[10px] sm:text-xs font-semibold text-muted uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                isSubmitting={isSubmitting}
                                onPermissionChange={onPermissionChange}
                                onRemove={onRemove}
                                onResend={onResend}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};