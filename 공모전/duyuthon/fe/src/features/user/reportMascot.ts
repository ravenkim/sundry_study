import type { AiReportResult, ReportStatus } from 'src/globals/api/types'
import type { MascortEmotion } from 'src/shared/components/mascort/mascortAssets'

type ReportMascotInput = {
    status: ReportStatus
    pointAwarded?: number
    aiResult?: AiReportResult
}

export function getReportMascotEmotion({
    status,
    pointAwarded = 0,
    aiResult,
}: ReportMascotInput): MascortEmotion {
    if (aiResult?.result === 'ERROR') return 'question'
    if (aiResult?.result === 'PASS') return 'nomal'

    switch (status) {
        case 'PENDING':
            return 'sleepy'
        case 'REJECTED':
            return 'sad'
        case 'UNDETECTABLE':
            return 'question'
        case 'APPROVED':
            return pointAwarded > 0 ? 'smile' : 'nomal'
        default:
            return 'nomal'
    }
}
