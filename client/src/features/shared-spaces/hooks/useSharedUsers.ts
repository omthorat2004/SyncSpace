// hooks/useSharedUsers.ts
import { useState, useEffect, useCallback } from 'react';
import { protectedApi } from '@/services/api.service';
import {type SharedUser } from '../types';
import { toast } from 'sonner';

export const useSharedUsers = (spaceId: number) => {
    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchSharedUsers = useCallback(async () => {
        if (!spaceId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await protectedApi.getSharedUsers(spaceId);
            setSharedUsers(response.data || []);
        } catch (err) {
            console.error('Failed to fetch shared users:', err);
            setError('Failed to fetch shared users');
            toast.error('Failed to load collaborators');
        } finally {
            setLoading(false);
        }
    }, [spaceId]);

    const updatePermission = async (userId: number, newPermission: 'view' | 'edit') => {
        try {
            setIsSubmitting(true);
            await protectedApi.updateSharePermission(spaceId, userId, newPermission);
            setSharedUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, permission: newPermission } : user
            ));
            toast.success(`Permission updated to ${newPermission}`);
        } catch (err) {
            console.error('Failed to update permission:', err);
            toast.error('Failed to update permission');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeUser = async (userId: number) => {
        try {
            setIsSubmitting(true);
            await protectedApi.removeSharedUser(spaceId, userId);
            setSharedUsers(prev => prev.filter(user => user.id !== userId));
            toast.success('User removed successfully');
        } catch (err) {
            console.error('Failed to remove user:', err);
            toast.error('Failed to remove user');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const resendInvite = async (userId: number) => {
        try {
            setIsSubmitting(true);
            await protectedApi.resendShareInvite(spaceId, userId);
            toast.success('Invitation resent successfully');
        } catch (err) {
            console.error('Failed to resend invite:', err);
            toast.error('Failed to resend invitation');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (spaceId) {
            fetchSharedUsers();
        }
    }, [spaceId, fetchSharedUsers]);

    return {
        sharedUsers,
        loading,
        error,
        isSubmitting,
        fetchSharedUsers,
        updatePermission,
        removeUser,
        resendInvite,
        setError,
    };
};