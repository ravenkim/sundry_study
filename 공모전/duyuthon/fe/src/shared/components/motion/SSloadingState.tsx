import { Loader2 } from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { MascotImage } from 'src/shared/components/mascort'
import type { MascortEmotionAlias } from 'src/shared/components/mascort/mascortAssets'
import { SSfadeIn } from './SSfadeIn'
import { SSwaveText } from './SSwaveText'

type SSloadingStateProps = {
    text: string
    description?: string
    className?: string
    size?: 'sm' | 'md' | 'lg'
    showSpinner?: boolean
    mascot?: MascortEmotionAlias
    compact?: boolean
}

const sizeStyles = {
    sm: {
        spinner: 'h-5 w-5',
        text: 'text-sm',
        padding: 'py-6',
    },
    md: {
        spinner: 'h-8 w-8',
        text: 'text-sm',
        padding: 'py-10',
    },
    lg: {
        spinner: 'h-12 w-12',
        text: 'text-base',
        padding: 'py-16',
    },
} as const

export function SSloadingState({
    text,
    description,
    className,
    size = 'md',
    showSpinner = true,
    mascot,
    compact = false,
}: SSloadingStateProps) {
    const styles = sizeStyles[size]

    return (
        <SSfadeIn
            className={cn(
                'flex flex-col items-center justify-center gap-4 text-center',
                !compact && styles.padding,
                className,
            )}
        >
            {mascot ? (
                <MotionMascot emotion={mascot} />
            ) : showSpinner ? (
                <Loader2
                    className={cn('text-primary animate-spin', styles.spinner)}
                />
            ) : null}
            <SSwaveText
                text={text}
                className={cn(
                    'text-on-surface-variant font-medium',
                    styles.text,
                )}
            />
            {description ? (
                <p className="text-on-surface-variant max-w-xs text-sm leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            ) : null}
        </SSfadeIn>
    )
}

function MotionMascot({ emotion }: { emotion: MascortEmotionAlias }) {
    return (
        <SSfadeIn y={8} duration={0.5}>
            <div className="animate-[mascot-pop_0.6s_ease-out]">
                <MascotImage emotion={emotion} size="md" decorative />
            </div>
        </SSfadeIn>
    )
}
