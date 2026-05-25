import client from 'src/globals/api/client'
import i18n from 'src/assets/locales/i18n'
import { compressImageForUpload } from 'src/shared/lib/compressImage'
import { shouldUseMock, withMockFallback } from 'src/globals/api/apiUtils'
import {
    getMockReportDetail,
    getMockReports,
    simulateAiAnalysis,
} from 'src/globals/api/mock'
import type {
    ApiErrorResponse,
    ApiResponse,
    CreateReportPayload,
    CreateReportResponse,
    PaginatedReports,
    ReportDetail,
    ReportStatus,
} from 'src/globals/api/types'
import { isApiError, ResponseCode } from 'src/globals/api/types'

export async function createReport(
    payload: CreateReportPayload,
): Promise<
    CreateReportResponse & {
        aiResult?: Awaited<ReturnType<typeof simulateAiAnalysis>>
    }
> {
    if (shouldUseMock()) {
        const aiResult = await simulateAiAnalysis(payload)
        return {
            reportId: Date.now(),
            status: 'APPROVED',
            aiResult,
        }
    }

    const image = await compressImageForUpload(payload.image)

    const formData = new FormData()
    formData.append('image', image)
    if (payload.buildingId)
        formData.append('buildingId', String(payload.buildingId))
    if (payload.locationId)
        formData.append('locationId', String(payload.locationId))
    if (payload.buildingName)
        formData.append('buildingName', payload.buildingName)
    if (payload.roomName) formData.append('roomName', payload.roomName)
    formData.append('isLightWasting', 'false')
    formData.append('isAcWasting', 'false')
    formData.append('isHeaterWasting', 'false')
    formData.append('isOtherWasting', 'false')

    const { data } = await client.post<
        ApiResponse<CreateReportResponse> | ApiErrorResponse
    >('/api/reports', formData)

    if (isApiError(data)) {
        throw new Error(data.message || i18n.t('errors:reportSubmitFailed'))
    }

    if (data.code !== ResponseCode.REPORT_CREATED || !data.body) {
        throw new Error(i18n.t('errors:reportSubmitFailed'))
    }

    const result = data.body

    return {
        ...result,
        reportId: result.reportSeq ?? result.reportId,
        aiResult: result.aiResult ?? {
            result: 'WASTE_DETECTED',
            message:
                result.message ??
                i18n.t('errors:reportSubmittedPending'),
            pointAwarded: 0,
        },
    }
}

export async function getMyReports(
    page = 0,
    size = 20,
    status?: ReportStatus | 'ALL',
): Promise<PaginatedReports> {
    return withMockFallback(
        async () => {
            const params: Record<string, string | number> = { page, size }
            if (status && status !== 'ALL') params.status = status
            const { data } = await client.get<ApiResponse<PaginatedReports>>(
                '/api/reports/me',
                {
                    params,
                },
            )
            return data.body!
        },
        () => getMockReports(page, size, status),
    )
}

export async function getReportDetail(
    reportId: number,
): Promise<ReportDetail | null> {
    return withMockFallback(
        async () => {
            const { data } = await client.get<ApiResponse<ReportDetail>>(
                `/api/reports/${reportId}`,
            )
            return data.body ?? null
        },
        () => getMockReportDetail(reportId) ?? null,
    )
}
