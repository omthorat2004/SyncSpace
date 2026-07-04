// components/ErrorAlert.tsx
import { FiX } from 'react-icons/fi';

interface ErrorAlertProps {
    error: string | null;
    onDismiss: () => void;
}

export const ErrorAlert = ({ error, onDismiss }: ErrorAlertProps) => {
    if (!error) return null;

    return (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs sm:text-sm flex items-start justify-between">
            <span className="flex-1">{error}</span>
            <button
                onClick={onDismiss}
                className="text-destructive hover:text-destructive/80 ml-3 shrink-0"
                aria-label="Dismiss error"
            >
                <FiX size={16} />
            </button>
        </div>
    );
};