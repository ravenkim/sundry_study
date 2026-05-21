import client from 'src/globals/api/client'
import { unwrapApiData, withMockFallback } from 'src/globals/api/apiUtils'
import {
    MOCK_ADMIN_DASHBOARD,
    MOCK_ADMIN_REPORTS,
} from 'src/globals/api/mock/data'
import type {
    AdminDashboardStats,
    AdminReportRow,
    ApiResponse,
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
