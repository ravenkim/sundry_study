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

export function useAdminGifticonExchangesState() {
    const [filter, setFilter] = useState<
        import('src/globals/api/types').GifticonExchangeStatus | 'ALL'
    >('ALL')
    const [exchanges, setExchanges] = useState<
        Awaited<
            ReturnType<
                typeof import('src/globals/api/adminApi').getAdminGifticonExchanges
            >
        >
    >([])
    const [stats, setStats] = useState<Awaited<
        ReturnType<
            typeof import('src/globals/api/adminApi').getAdminGifticonExchangeStats
        >
    > | null>(null)

    useEffect(() => {
        void import('src/globals/api/adminApi')
            .then(({ getAdminGifticonExchanges, getAdminGifticonExchangeStats }) =>
                Promise.all([
                    getAdminGifticonExchanges(filter),
                    getAdminGifticonExchangeStats(),
                ]),
            )
            .then(([nextExchanges, nextStats]) => {
                setExchanges(nextExchanges)
                setStats(nextStats)
            })
    }, [filter])

    const handleStatusUpdate = async (
        exchangeId: number,
        status: 'SENT' | 'REJECTED',
    ) => {
        const {
            updateGifticonExchangeStatus,
            getAdminGifticonExchangeStats,
            getAdminGifticonExchanges,
        } = await import('src/globals/api/adminApi')
        await updateGifticonExchangeStatus(exchangeId, status)
        const [nextExchanges, nextStats] = await Promise.all([
            getAdminGifticonExchanges(filter),
            getAdminGifticonExchangeStats(),
        ])
        setExchanges(nextExchanges)
        setStats(nextStats)
        toast.success(
            status === 'SENT'
                ? '기프티콘 발송 처리되었습니다.'
                : '반려되었습니다. 포인트가 환불됩니다.',
        )
    }

    return { filter, setFilter, exchanges, stats, handleStatusUpdate }
}
