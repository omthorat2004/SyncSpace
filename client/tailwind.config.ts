import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        card: 'var(--color-card)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-text': 'var(--color-accent-text)',
        secondary: 'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        destructive: 'var(--color-destructive)',
        'destructive-hover': 'var(--color-destructive-hover)',
        border: 'var(--color-border)',
        link: 'var(--color-link)',
        'link-hover': 'var(--color-link-hover)',
        'header-bg': 'var(--color-header-bg)',
        'shadow-card': 'var(--color-shadow-card)',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      spacing: {
        gutter: '24px',
        xl: '64px',
        base: '4px',
        xs: '8px',
        md: '24px',
        sm: '16px',
        lg: '40px',
        margin: '32px',
      },
      fontSize: {
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        display: ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'headline-lg-mobile': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '600' }],
      },
    },
  },
} satisfies Config
