// index.tsx - Main SharedWithYou Component
import { useAppSelector } from '@/store/hook';
import { useState } from 'react';
import { toast } from 'sonner';

import { StatsCards } from './StatsCards';
import { UserTable } from './UserTable';
import { EmptyState } from './EmptyState';

import { InviteModal } from './InviteModal';
import { ErrorAlert } from './ErrorAlert';
import { useSharedUsers } from '../hooks/useSharedUsers';
import {type SharedWithYouProps } from '../types';
import { LoadingState } from './LoadingState';
import { SharedHeader } from './SharedHeader';


const SharedWithYou = ({ spaceId, spaceName, onShareSpace, onRefresh }: SharedWithYouProps) => {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const user = useAppSelector((state) => state.auth.user);
    
    const {
        sharedUsers,
        loading,
        error,
        isSubmitting,
        fetchSharedUsers,
        updatePermission,
        removeUser,
        resendInvite,
        setError,
    } = useSharedUsers(spaceId);

    const stats = {
        total: sharedUsers.length,
        editors: sharedUsers.filter(u => u.permission === 'edit').length,
        viewers: sharedUsers.filter(u => u.permission === 'view').length,
        pending: sharedUsers.filter(u => u.status === 'pending').length,
    };

    const handleInviteSubmit = async (email: string, permission: 'view' | 'edit') => {
        if (!onShareSpace) {
            toast.error('Share function is not available');
            return;
        }

        try {
            await onShareSpace(email, permission);
            toast.success(`Invitation sent to ${email}`);
            
            if (onRefresh) {
                await onRefresh();
            }
            await fetchSharedUsers();
        } catch (err) {
            console.error('Failed to share space:', err);
            toast.error('Failed to send invitation');
            throw err;
        }
    };

    return (
        <div className="mt-8 sm:mt-12">
            <ErrorAlert error={error} onDismiss={() => setError(null)} />

            <SharedHeader
                spaceName={spaceName}
                onInviteClick={() => setShowInviteModal(true)}
            />

            <StatsCards stats={stats} />

            {loading ? (
                <LoadingState />
            ) : sharedUsers.length > 0 ? (
                <UserTable
                    users={sharedUsers}
                    isSubmitting={isSubmitting}
                    onPermissionChange={updatePermission}
                    onRemove={removeUser}
                    onResend={resendInvite}
                />
            ) : (
                <EmptyState onInviteClick={() => setShowInviteModal(true)} />
            )}

            <InviteModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                onSubmit={handleInviteSubmit}
                currentUserEmail={user?.email}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default SharedWithYou;