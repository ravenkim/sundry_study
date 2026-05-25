import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { SSfadeIn } from 'src/shared/components/motion'
import {
    MASCORT_SRC,
    resolveMascortEmotion,
    type MascortEmotion,
    type MascortEmotionAlias,
} from './mascortAssets'

export type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'hero'

const SIZE_CLASS: Record<MascotSize, string> = {
    xs: 'h-8 w-8',
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-28 w-28',
    hero: 'h-36 w-36 sm:h-40 sm:w-40',
}

type MascotImageProps = {
    emotion: MascortEmotionAlias
    size?: MascotSize
    className?: string
    imgClassName?: string
    decorative?: boolean
}

export const MascotImage = ({
    emotion,
    size = 'md',
    className,
    imgClassName,
    decorative = false,
}: MascotImageProps) => {
    const { t } = useTranslation('common')
    const key = resolveMascortEmotion(emotion)
    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center justify-center',
                SIZE_CLASS[size],
                className,
            )}
            aria-hidden={decorative ? true : undefined}
        >
            <img
                src={MASCORT_SRC[key]}
                alt={decorative ? '' : t(`mascort.${key}`)}
                className={cn(
                    'h-full w-full object-contain drop-shadow-sm',
                    imgClassName,
                )}
                draggable={false}
            />
        </span>
    )
}

type MascotHeroProps = {
    emotion?: MascortEmotion
    title: string
    subtitle?: string
    className?: string
}

export const MascotHero = ({
    emotion = 'smile',
    title,
    subtitle,
    className,
}: MascotHeroProps) => (
    <section
        className={cn(
            'border-outline-variant bg-primary-container/15 flex items-center gap-4 rounded-2xl border px-4 py-4',
            className,
        )}
    >
        <MascotImage emotion={emotion} size="hero" decorative />
        <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-primary text-lg leading-tight font-black">
                {title}
            </h2>
            {subtitle ? (
                <p className="text-on-surface-variant text-sm font-medium">
                    {subtitle}
                </p>
            ) : null}
        </div>
    </section>
)

type MascotBubbleProps = {
    emotion: MascortEmotionAlias
    children: ReactNode
    size?: MascotSize
    className?: string
}

export const MascotBubble = ({
    emotion,
    children,
    size = 'sm',
    className,
}: MascotBubbleProps) => (
    <div className={cn('flex items-start gap-3', className)}>
        <MascotImage emotion={emotion} size={size} decorative />
        <p className="bg-primary-container/25 text-on-surface flex-1 rounded-2xl rounded-tl-sm px-3 py-2 text-sm font-semibold">
            {children}
        </p>
    </div>
)

type MascotEmptyStateProps = {
    emotion?: MascortEmotion
    title: string
    description?: string
    children?: ReactNode
    className?: string
}

export const MascotEmptyState = ({
    emotion = 'question',
    title,
    description,
    children,
    className,
}: MascotEmptyStateProps) => (
    <SSfadeIn
        className={cn(
            'flex flex-col items-center gap-4 py-10 text-center',
            className,
        )}
    >
        <div className="animate-[mascot-pop_0.6s_ease-out]">
            <MascotImage emotion={emotion} size="lg" />
        </div>
        <div className="flex flex-col gap-2">
            <h2 className="text-on-surface text-xl font-black">{title}</h2>
            {description ? (
                <p className="text-on-surface-variant text-sm font-medium">
                    {description}
                </p>
            ) : null}
        </div>
        {children}
    </SSfadeIn>
)

export const MascotWatermark = ({
    emotion = 'smile',
    className,
}: {
    emotion?: MascortEmotion
    className?: string
}) => (
    <MascotImage
        emotion={emotion}
        size="xs"
        decorative
        className={cn('pointer-events-none absolute opacity-[0.12]', className)}
    />
)
