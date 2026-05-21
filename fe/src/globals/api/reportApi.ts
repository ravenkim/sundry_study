import client from 'src/globals/api/client'
import { unwrapApiData, withMockFallback } from 'src/globals/api/apiUtils'
import {
    getMockReportDetail,
    getMockReports,
    simulateAiAnalysis,
} from 'src/globals/api/mock'
import type {
    ApiResponse,
    CreateReportPayload,
    CreateReportResponse,
    PaginatedReports,
    ReportDetail,
    ReportStatus,
} from 'src/globals/api/types'

export async function createReport(
    payload: CreateReportPayload,
): Promise<
    CreateReportResponse & {
        aiResult?: Awaited<ReturnType<typeof simulateAiAnalysis>>
    }
> {
    const formData = new FormData()
    formData.append('image', payload.image)
    if (payload.buildingId)
        formData.append('buildingId', String(payload.buildingId))
    if (payload.locationId)
        formData.append('locationId', String(payload.locationId))
    if (payload.buildingName)
        formData.append('buildingName', payload.buildingName)
    if (payload.roomName) formData.append('roomName', payload.roomName)

    const backendCall = async () => {
        const { data } = await client.post<ApiResponse<CreateReportResponse>>(
            '/api/reports',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        )
        const result = unwrapApiData(data) as CreateReportResponse

        if (result.status === 'PENDING' || !result.aiResult) {
            const aiResult = await simulateAiAnalysis(payload)
            return {
                ...result,
                reportId: result.reportSeq ?? result.reportId,
                aiResult,
            }
        }

        return result
    }

    return withMockFallback(backendCall, async () => {
        const aiResult = await simulateAiAnalysis(payload)
        return {
            reportId: Date.now(),
            status: 'APPROVED' as const,
            aiResult,
        }
    })
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
            return unwrapApiData(data)
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
            return unwrapApiData(data)
        },
        () => getMockReportDetail(reportId) ?? null,
    )
}
