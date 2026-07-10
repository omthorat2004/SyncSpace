import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

const Input = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}: InputProps) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="form-label">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`form-field ${error ? 'border-destructive' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            {helperText && <p className="text-xs text-muted mt-1">{helperText}</p>}
        </div>
    )
}

export default Input
