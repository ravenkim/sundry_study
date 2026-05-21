import React from 'react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'

export const EcoButton = ({
    children,
    className,
    variant = 'primary',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error'
}) => {
    const variants = {
        primary:
            'bg-primary-container text-on-primary-container hover:brightness-95',
        secondary:
            'bg-secondary text-secondary-foreground hover:brightness-110',
        outline:
            'border border-outline-variant text-on-surface hover:bg-surface-container-low',
        ghost: 'text-on-surface-variant hover:bg-surface-container-low',
        error: 'bg-error text-destructive-foreground hover:brightness-110',
    }
    return (
        <button
            className={cn(
                'flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all active:scale-95',
                variants[variant],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export const EcoCard = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => (
    <div
        className={cn(
            'bg-surface-container-lowest border-outline-variant rounded-xl border p-4 shadow-sm',
            className,
        )}
    >
        {children}
    </div>
)

export const EcoBadge = ({
    children,
    variant = 'gray',
    className,
}: {
    children: React.ReactNode
    variant?: 'gray' | 'yellow' | 'green' | 'red'
    className?: string
}) => {
    const variants = {
        gray: 'bg-surface-container text-on-surface-variant',
        yellow: 'bg-primary-container/20 text-primary border border-primary-container',
        green: 'bg-secondary-container text-on-secondary-container',
        red: 'bg-error-container text-on-error-container',
    }
    return (
        <span
            className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                variants[variant],
                className,
            )}
        >
            {children}
        </span>
    )
}
