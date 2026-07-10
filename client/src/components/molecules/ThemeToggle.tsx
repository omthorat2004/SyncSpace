import { MdDarkMode, MdSunny } from 'react-icons/md'

interface ThemeToggleProps {
    isDarkMode: boolean
    onToggle: () => void
}

const ThemeToggle = ({ isDarkMode, onToggle }: ThemeToggleProps) => {
    return (
        <button
            onClick={onToggle}
            aria-label="Toggle theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-surface-container transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDarkMode ? <MdSunny size={18} /> : <MdDarkMode size={18} />}
        </button>
    )
}

export default ThemeToggle
