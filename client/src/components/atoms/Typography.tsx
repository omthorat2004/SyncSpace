import { ElementType, ReactNode } from 'react'

interface TypographyProps {
    children: ReactNode
    className?: string
    as?: ElementType
}

export const Heading1 = ({ children, className = '', as: Component = 'h1' }: TypographyProps) => (
    <Component className={`section-headline ${className}`}>{children}</Component>
)

export const Heading2 = ({ children, className = '', as: Component = 'h2' }: TypographyProps) => (
    <Component className={`text-3xl font-bold text-foreground ${className}`}>{children}</Component>
)

export const Heading3 = ({ children, className = '', as: Component = 'h3' }: TypographyProps) => (
    <Component className={`text-2xl font-semibold text-foreground ${className}`}>{children}</Component>
)

export const Heading4 = ({ children, className = '', as: Component = 'h4' }: TypographyProps) => (
    <Component className={`text-xl font-semibold text-foreground ${className}`}>{children}</Component>
)

export const Body = ({ children, className = '', as: Component = 'p' }: TypographyProps) => (
    <Component className={`text-base text-foreground leading-relaxed ${className}`}>{children}</Component>
)

export const BodySmall = ({
    children,
    className = '',
    as: Component = 'p',
}: TypographyProps) => (
    <Component className={`text-sm text-foreground ${className}`}>{children}</Component>
)

export const Caption = ({ children, className = '', as: Component = 'span' }: TypographyProps) => (
    <Component className={`text-xs text-muted ${className}`}>{children}</Component>
)

export const Link = ({ children, className = '', as: Component = 'a' }: TypographyProps) => (
    <Component className={`text-link hover:text-link-hover transition-colors ${className}`}>
        {children}
    </Component>
)
