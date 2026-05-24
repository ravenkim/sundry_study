import client from 'src/globals/api/client'
import { unwrapApiData, withMockFallback } from 'src/globals/api/apiUtils'
import {
    getMockGifticonExchangeStats,
    getMockGifticonExchanges,
    MOCK_ADMIN_DASHBOARD,
    MOCK_ADMIN_REPORTS,
    updateMockGifticonExchangeStatus,
} from 'src/globals/api/mock/data'
import type {
    AdminDashboardStats,
    AdminReportRow,
    ApiResponse,
    GifticonExchangeRow,
    GifticonExchangeStatus,
    ReportStatus,
} from 'src/globals/api/types'

export async function getAdminReports(): Promise<AdminReportRow[]> {
    return withMockFallback(
        async () => {
            const { data } =
                await client.get<ApiResponse<AdminReportRow[]>>(
                    '/api/admin/reports',
                )
            return unwrapApiData(data)
        },
        () => MOCK_ADMIN_REPORTS,
    )
}

export async function getAdminDashboard(
    buildingId?: number,
    year?: number,
    month?: number,
): Promise<AdminDashboardStats> {
    return withMockFallback(
        async () => {
            const { data } = await client.get<ApiResponse<AdminDashboardStats>>(
                '/api/admin/dashboard',
                { params: { buildingId, year, month } },
            )
            return unwrapApiData(data)
        },
        () => MOCK_ADMIN_DASHBOARD,
    )
}

export async function updateReportStatus(
    reportId: number,
    status: ReportStatus,
): Promise<void> {
    return withMockFallback(
        async () => {
            await client.patch(`/api/admin/reports/${reportId}`, { status })
        },
        () => undefined,
    )
}

export async function getAdminGifticonExchanges(
    status?: GifticonExchangeStatus | 'ALL',
): Promise<GifticonExchangeRow[]> {
    return withMockFallback(
        async () => {
            const { data } = await client.get<
                ApiResponse<GifticonExchangeRow[]>
            >('/api/admin/gifticon-exchanges', { params: { status } })
            return unwrapApiData(data)
        },
        () => getMockGifticonExchanges(status),
    )
}

export async function getAdminGifticonExchangeStats(): Promise<{
    pendingCount: number
    sentCount: number
    rejectedCount: number
    pendingPoints: number
}> {
    return withMockFallback(
        async () => {
            const { data } = await client.get<
                ApiResponse<{
                    pendingCount: number
                    sentCount: number
                    rejectedCount: number
                    pendingPoints: number
                }>
            >('/api/admin/gifticon-exchanges/stats')
            return unwrapApiData(data)
        },
        () => getMockGifticonExchangeStats(),
    )
}

export async function updateGifticonExchangeStatus(
    exchangeId: number,
    status: 'SENT' | 'REJECTED',
): Promise<void> {
    return withMockFallback(
        async () => {
            await client.patch(
                `/api/admin/gifticon-exchanges/${exchangeId}`,
                { status },
            )
        },
        () => {
            updateMockGifticonExchangeStatus(exchangeId, status)
        },
    )
}
