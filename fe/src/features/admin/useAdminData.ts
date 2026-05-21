import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export function useAdminReportsState() {
    const [reports, setReports] = useState<
        Awaited<
            ReturnType<
                typeof import('src/globals/api/adminApi').getAdminReports
            >
        >
    >([])

    useEffect(() => {
        void import('src/globals/api/adminApi')
            .then(({ getAdminReports }) => getAdminReports())
            .then(setReports)
    }, [])

    const handleStatusUpdate = async (
        reportId: number,
        status: 'APPROVED' | 'REJECTED',
    ) => {
        const { updateReportStatus } = await import('src/globals/api/adminApi')
        await updateReportStatus(reportId, status)
        setReports((prev) =>
            prev.map((r) => (r.reportId === reportId ? { ...r, status } : r)),
        )
        toast.success(
            status === 'APPROVED' ? '승인되었습니다.' : '반려되었습니다.',
        )
    }

    return { reports, handleStatusUpdate }
}

export function useAdminDashboardState() {
    const [stats, setStats] = useState<Awaited<
        ReturnType<typeof import('src/globals/api/adminApi').getAdminDashboard>
    > | null>(null)

    useEffect(() => {
        void import('src/globals/api/adminApi')
            .then(({ getAdminDashboard }) => getAdminDashboard())
            .then(setStats)
    }, [])

    return stats
}
