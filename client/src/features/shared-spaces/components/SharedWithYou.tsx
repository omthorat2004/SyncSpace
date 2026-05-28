import { 
    FiUsers, 
    FiEdit2, 
    FiEye, 
    FiMoreVertical, 
    FiMail,
    FiUserPlus,
    FiSettings,
    FiTrash2,
    FiCheck,
    FiX,
    FiClock
} from 'react-icons/fi';
import { useState } from 'react';

interface SharedUser {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    permission: 'view' | 'edit';
    shared_at: string;
    status: 'active' | 'pending';
}

interface SharedWithYouProps {
    spaceId: number;
    spaceName?: string;
}

// Sample data - replace with actual API data
const sampleSharedUsers: SharedUser[] = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        permission: 'edit',
        shared_at: '2024-01-15T10:30:00Z',
        status: 'active',
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        permission: 'view',
        shared_at: '2024-01-10T14:20:00Z',
        status: 'active',
    },
    {
        id: 3,
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        permission: 'edit',
        shared_at: '2024-01-05T09:15:00Z',
        status: 'pending',
    },
    {
        id: 4,
        name: 'David Kumar',
        email: 'david.kumar@example.com',
        permission: 'view',
        shared_at: '2023-12-28T16:45:00Z',
        status: 'active',
    },
];

const SharedWithYou = ({ spaceId, spaceName }: SharedWithYouProps) => {
    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>(sampleSharedUsers);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<SharedUser | null>(null);
    const [showMenuFor, setShowMenuFor] = useState<number | null>(null);
    const [inviteEmail, setInviteEmail] = useState('');
    const [invitePermission, setInvitePermission] = useState<'view' | 'edit'>('view');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handlePermissionChange = (userId: number, newPermission: 'view' | 'edit') => {
        setSharedUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, permission: newPermission } : user
        ));
        setShowMenuFor(null);
        // API call to update permission would go here
    };

    const handleRemoveUser = (userId: number) => {
        setSharedUsers(prev => prev.filter(user => user.id !== userId));
        setShowMenuFor(null);
        // API call to remove user would go here
    };

    const handleResendInvite = (userId: number) => {
        // API call to resend invitation would go here
        setShowMenuFor(null);
    };

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        const newUser: SharedUser = {
            id: Date.now(),
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            permission: invitePermission,
            shared_at: new Date().toISOString(),
            status: 'pending',
        };

        setSharedUsers(prev => [newUser, ...prev]);
        setInviteEmail('');
        setShowInviteModal(false);
        // API call to send invitation would go here
    };

    const stats = {
        total: sharedUsers.length,
        editors: sharedUsers.filter(u => u.permission === 'edit').length,
        viewers: sharedUsers.filter(u => u.permission === 'view').length,
        pending: sharedUsers.filter(u => u.status === 'pending').length,
    };

    return (
        <div className="mt-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <FiUsers className="text-muted" size={20} />
                        <h2 className="text-xl font-semibold text-foreground">Shared with others</h2>
                    </div>
                    <p className="text-sm text-muted">
                        Manage who has access to "{spaceName || 'this space'}"
                    </p>
                </div>

                <button
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background hover:bg-secondary transition-colors font-medium"
                >
                    <FiUserPlus size={16} />
                    Invite People
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="rounded-xl border border-border bg-card p-3">
                    <p className="text-xs text-muted">Total collaborators</p>
                    <p className="text-xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                    <p className="text-xs text-muted">Can edit</p>
                    <p className="text-xl font-bold mt-1 text-accent">{stats.editors}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                    <p className="text-xs text-muted">Can view</p>
                    <p className="text-xl font-bold mt-1 text-muted">{stats.viewers}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                    <p className="text-xs text-muted">Pending invites</p>
                    <p className="text-xl font-bold mt-1 text-warning">{stats.pending}</p>
                </div>
            </div>

            {/* Users List */}
            {sharedUsers.length > 0 ? (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-container border-b border-border">
                                <tr>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">User</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Permission</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Shared</th>

                                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sharedUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-border hover:bg-surface-container/50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center">
                                                    {user.avatar ? (
                                                        <img 
                                                            src={user.avatar} 
                                                            alt={user.name}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-muted">
                                                            {getInitials(user.name)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                                                    <div className="flex items-center gap-1 text-xs text-muted">
                                                        <FiMail size={10} />
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    user.permission === 'edit'
                                                        ? 'bg-accent/10 text-accent'
                                                        : 'bg-muted/10 text-muted'
                                                }`}>
                                                    {user.permission === 'edit' ? (
                                                        <FiEdit2 size={11} />
                                                    ) : (
                                                        <FiEye size={11} />
                                                    )}
                                                    {user.permission === 'edit' ? 'Can edit' : 'Can view'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1.5 text-xs text-muted">
                                                <FiClock size={11} />
                                                <span>{formatDate(user.shared_at)}</span>
                                            </div>
                                        </td>
                                        
                                        <td className="px-5 py-3 text-right relative">
                                            <button
                                                onClick={() => setShowMenuFor(showMenuFor === user.id ? null : user.id)}
                                                className="p-1.5 rounded-lg hover:bg-surface-container transition-colors"
                                            >
                                                <FiMoreVertical size={16} className="text-muted" />
                                            </button>
                                            
                                            {/* Dropdown Menu */}
                                            {showMenuFor === user.id && (
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-40"
                                                        onClick={() => setShowMenuFor(null)}
                                                    />
                                                    <div className="absolute right-5 top-12 z-50 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                                                        <div className="py-1">
                                                            <div className="px-3 py-2 text-xs font-semibold text-muted border-b border-border">
                                                                Change permission
                                                            </div>
                                                            <button
                                                                onClick={() => handlePermissionChange(user.id, 'edit')}
                                                                className={`w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-surface-container transition-colors ${
                                                                    user.permission === 'edit' ? 'text-accent' : 'text-foreground'
                                                                }`}
                                                            >
                                                                <FiEdit2 size={14} />
                                                                Can edit
                                                                {user.permission === 'edit' && <FiCheck size={14} className="ml-auto" />}
                                                            </button>
                                                            <button
                                                                onClick={() => handlePermissionChange(user.id, 'view')}
                                                                className={`w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-surface-container transition-colors ${
                                                                    user.permission === 'view' ? 'text-accent' : 'text-foreground'
                                                                }`}
                                                            >
                                                                <FiEye size={14} />
                                                                Can view
                                                                {user.permission === 'view' && <FiCheck size={14} className="ml-auto" />}
                                                            </button>
                                                            <div className="border-t border-border my-1"></div>
                                                            {user.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleResendInvite(user.id)}
                                                                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-surface-container transition-colors text-foreground"
                                                                >
                                                                    <FiMail size={14} />
                                                                    Resend invite
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleRemoveUser(user.id)}
                                                                className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-destructive/10 transition-colors text-destructive"
                                                            >
                                                                <FiTrash2 size={14} />
                                                                Remove access
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="card rounded-xl p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center">
                            <FiUsers size={32} className="text-muted" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">No collaborators yet</h3>
                            <p className="text-sm text-muted max-w-md">
                                Invite people to collaborate on this space. 
                                They can view or edit content based on the permissions you set.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="mt-2 primary-button py-2 px-5"
                        >
                            Invite People
                        </button>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/70 z-[100] transition-opacity duration-200"
                        onClick={() => setShowInviteModal(false)}
                    />
                    <div className="fixed inset-0 z-[101] flex items-center justify-center px-4 py-8">
                        <div 
                            className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-6 py-5 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Invite to Space</h3>
                                        <p className="text-sm text-muted mt-1">Invite people to collaborate</p>
                                    </div>
                                    <button
                                        onClick={() => setShowInviteModal(false)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted hover:bg-surface-container transition-colors"
                                    >
                                        <FiX size={16} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleInviteSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="colleague@example.com"
                                        required
                                        className="form-field"
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Permission</label>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setInvitePermission('view')}
                                            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                                                invitePermission === 'view'
                                                    ? 'bg-foreground text-background'
                                                    : 'bg-surface-container text-muted hover:bg-surface-container-high'
                                            }`}
                                        >
                                            <FiEye size={14} />
                                            Can view
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInvitePermission('edit')}
                                            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                                                invitePermission === 'edit'
                                                    ? 'bg-foreground text-background'
                                                    : 'bg-surface-container text-muted hover:bg-surface-container-high'
                                            }`}
                                        >
                                            <FiEdit2 size={14} />
                                            Can edit
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowInviteModal(false)}
                                        className="flex-1 px-4 py-2.5 rounded-full border border-border text-foreground hover:bg-surface-container transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 primary-button py-2.5 px-4 inline-flex items-center justify-center gap-2"
                                    >
                                        <FiUserPlus size={16} />
                                        Send Invite
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SharedWithYou;