import { updateUserProfile } from "@/features/auth/authenticationSlice";
import { protectedApi } from "@/services/api.service";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { extractErrorMessage } from "@/utils/errors";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Settings = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [savingProfile, setSavingProfile] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            toast.error("Name and email are required");
            return;
        }

        try {
            setSavingProfile(true);
            const response = await protectedApi.updateProfile({ name: name.trim(), email: email.trim() });
            dispatch(updateUserProfile(response.data.user));
            toast.success("Profile updated");
        } catch (err) {
            toast.error(extractErrorMessage(err, "Failed to update profile"));
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        try {
            setSavingPassword(true);
            await protectedApi.changePassword(oldPassword, newPassword);
            toast.success("Password changed");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            toast.error(extractErrorMessage(err, "Failed to change password"));
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="min-h-full bg-background text-foreground">
            <div className="site-nav-inner py-8 sm:py-10 max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted hover:bg-surface-container-high transition-colors"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">Account</p>
                        <h1 className="text-2xl sm:text-3xl font-bold mt-2">Settings</h1>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 mb-6">
                    <h2 className="text-lg font-semibold mb-1">Profile</h2>
                    <p className="text-sm text-muted mb-6">Update your name and email address.</p>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="settings-name" className="block text-sm font-medium text-foreground mb-2">
                                Name
                            </label>
                            <input
                                id="settings-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={savingProfile}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        <div>
                            <label htmlFor="settings-email" className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <input
                                id="settings-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={savingProfile}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="px-5 py-2.5 rounded-lg bg-accent text-accent-text hover:bg-accent-hover transition-colors font-medium inline-flex items-center gap-2 disabled:opacity-50"
                        >
                            {savingProfile && <AiOutlineLoading3Quarters className="animate-spin" size={16} />}
                            {savingProfile ? "Saving..." : "Save profile"}
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
                    <h2 className="text-lg font-semibold mb-1">Password</h2>
                    <p className="text-sm text-muted mb-6">Change the password used to sign in.</p>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="settings-old-password" className="block text-sm font-medium text-foreground mb-2">
                                Current password
                            </label>
                            <input
                                id="settings-old-password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                disabled={savingPassword}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        <div>
                            <label htmlFor="settings-new-password" className="block text-sm font-medium text-foreground mb-2">
                                New password
                            </label>
                            <input
                                id="settings-new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={savingPassword}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        <div>
                            <label htmlFor="settings-confirm-password" className="block text-sm font-medium text-foreground mb-2">
                                Confirm new password
                            </label>
                            <input
                                id="settings-confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={savingPassword}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={savingPassword || !oldPassword || !newPassword}
                            className="px-5 py-2.5 rounded-lg bg-accent text-accent-text hover:bg-accent-hover transition-colors font-medium inline-flex items-center gap-2 disabled:opacity-50"
                        >
                            {savingPassword && <AiOutlineLoading3Quarters className="animate-spin" size={16} />}
                            {savingPassword ? "Saving..." : "Change password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
