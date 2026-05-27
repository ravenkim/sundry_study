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
import {
    isApiError,
    REPORT_SUBMIT_TIMEOUT_MS,
    ResponseCode,
} from 'src/globals/api/types'

export class ReportSubmitError extends Error {
    readonly code?: number

    constructor(message: string, code?: number) {
        super(message)
        this.name = 'ReportSubmitError'
        this.code = code
    }
}

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
    >('/api/reports', formData, {
        timeout: REPORT_SUBMIT_TIMEOUT_MS,
    })

    if (isApiError(data)) {
        throw new ReportSubmitError(
            data.message || i18n.t('errors:reportSubmitFailed'),
            typeof data.code === 'number' ? data.code : Number(data.code),
        )
    }

    if (data.code !== ResponseCode.REPORT_CREATED || !data.body) {
        throw new ReportSubmitError(i18n.t('errors:reportSubmitFailed'))
    }

    const result = data.body

    return {
        ...result,
        reportId: result.reportSeq ?? result.reportId,
        aiResult: result.aiResult,
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
