import { MascotImage } from 'src/shared/components/mascort'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import type { AiReportResult, ReportStatus } from 'src/globals/api/types'
import { getReportMascotEmotion } from './reportMascot'

type ReportMascotThumbnailProps = {
    status: ReportStatus
    pointAwarded?: number
    aiResult?: AiReportResult
    variant?: 'list' | 'detail'
    className?: string
}

export const ReportMascotThumbnail = ({
    status,
    pointAwarded,
    aiResult,
    variant = 'list',
    className,
}: ReportMascotThumbnailProps) => {
    const emotion = getReportMascotEmotion({ status, pointAwarded, aiResult })

    if (variant === 'detail') {
        return (
            <div
                className={cn(
                    'bg-surface-container-low flex h-48 w-full items-center justify-center rounded-xl',
                    className,
                )}
            >
                <MascotImage emotion={emotion} size="lg" decorative />
            </div>
        )
    }

    return (
        <div
            className={cn(
                'bg-surface-container flex h-16 w-16 shrink-0 items-center justify-center rounded-lg',
                className,
            )}
        >
            <MascotImage
                emotion={emotion}
                size="sm"
                decorative
                className="h-14 w-14"
            />
        </div>
    )
}
