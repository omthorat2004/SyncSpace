// types/index.ts
export interface SharedUser {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    permission: 'view' | 'edit';
    shared_at: string;
    status: 'active' | 'pending';
}

export interface SharedWithYouProps {
    spaceId: number;
    spaceName?: string;
    onShareSpace?: (userEmail: string, permission: string) => Promise<any>;
    onRefresh?: () => Promise<any>;
}

export interface Stats {
    total: number;
    editors: number;
    viewers: number;
    pending: number;
}