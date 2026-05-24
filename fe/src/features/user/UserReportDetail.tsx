import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { EcoBadge, EcoCard } from 'src/shared/ui/eco'
import { getReportDetail } from 'src/globals/api/reportApi'
import type { ReportDetail, ReportStatus } from 'src/globals/api/types'

const STATUS_LABEL: Record<ReportStatus, string> = {
    APPROVED: '승인됨',
    PENDING: '처리중',
    REJECTED: '반려',
    UNDETECTABLE: '판별불가',
}

export const UserReportDetail = () => {
    const { reportId } = useParams<{ reportId: string }>()
    const [report, setReport] = useState<ReportDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!reportId) return
        void getReportDetail(Number(reportId))
            .then(setReport)
            .finally(() => setLoading(false))
    }, [reportId])

    if (loading) {
        return (
            <p className="text-on-surface-variant p-8 text-center text-sm">
                불러오는 중...
            </p>
        )
    }

    if (!report) {
        return (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
                <p className="text-on-surface-variant">
                    제보를 찾을 수 없습니다.
                </p>
                <Link to="/reports" className="text-primary text-sm font-bold">
                    목록으로
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-5 pb-8">
            <Link
                to="/reports"
                className="text-on-surface-variant flex items-center gap-2 text-sm font-bold"
            >
                <ArrowLeft className="h-4 w-4" /> 제보 이력
            </Link>

            {report.thumbnailUrl && (
                <img
                    src={report.thumbnailUrl}
                    alt="제보 사진"
                    className="h-48 w-full rounded-xl object-cover"
                />
            )}

            <EcoCard className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">{report.roomName}</h2>
                    <EcoBadge>{STATUS_LABEL[report.status]}</EcoBadge>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">
                            제보 일시
                        </span>
                        <span className="font-medium">
                            {new Date(report.createdAt).toLocaleString('ko-KR')}
                        </span>
                    </div>
                    {report.detectionLabel && (
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">
                                AI 판별
                            </span>
                            <span className="font-medium">
                                {report.detectionLabel}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">
                            {report.status === 'APPROVED'
                                ? '적립 포인트'
                                : '예상 포인트'}
                        </span>
                        <span className="text-primary font-bold">
                            {report.pointAwarded > 0
                                ? `+${report.pointAwarded}P`
                                : report.estimatedPoint && report.estimatedPoint > 0
                                  ? `약 +${report.estimatedPoint}P`
                                  : '-'}
                        </span>
                    </div>
                    {report.offTimeMinutes != null && report.offTimeMinutes > 0 && (
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">
                                예상 방치 시간
                            </span>
                            <span className="font-medium">
                                {Math.floor(report.offTimeMinutes / 60)}시간{' '}
                                {report.offTimeMinutes % 60}분
                            </span>
                        </div>
                    )}
                </div>
                {report.aiResult?.message && (
                    <p className="bg-surface-container-low text-on-surface-variant rounded-lg p-3 text-sm">
                        {report.aiResult.message}
                    </p>
                )}
            </EcoCard>
        </div>
    )
}
