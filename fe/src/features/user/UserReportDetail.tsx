import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { EcoBadge, EcoCard } from 'src/shared/ui/eco'
import { getReportDetail } from 'src/globals/api/reportApi'
import type { ReportDetail } from 'src/globals/api/types'
import { useReportStatusLabel } from 'src/shared/lib/i18n/reportStatus'
import { useAppLocale, formatDateTime } from 'src/shared/lib/i18n/formatters'
import { ReportMascotThumbnail } from './ReportMascotThumbnail'

export const UserReportDetail = () => {
    const { t } = useTranslation('report')
    const locale = useAppLocale()
    const { reportId } = useParams<{ reportId: string }>()
    const [report, setReport] = useState<ReportDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!reportId) return
        void getReportDetail(Number(reportId))
            .then(setReport)
            .finally(() => setLoading(false))
    }, [reportId])

    const statusLabel = useReportStatusLabel(report?.status ?? '')

    if (loading) {
        return (
            <p className="text-on-surface-variant p-8 text-center text-sm">
                {t('detail.loading')}
            </p>
        )
    }

    if (!report) {
        return (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
                <p className="text-on-surface-variant">
                    {t('detail.notFound')}
                </p>
                <Link to="/reports" className="text-primary text-sm font-bold">
                    {t('detail.backToList')}
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
                <ArrowLeft className="h-4 w-4" /> {t('detail.historyLink')}
            </Link>

            <ReportMascotThumbnail
                variant="detail"
                status={report.status}
                pointAwarded={report.pointAwarded}
                aiResult={report.aiResult}
            />

            <EcoCard className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">{report.roomName}</h2>
                    <EcoBadge>{statusLabel}</EcoBadge>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">
                            {t('detail.reportedAt')}
                        </span>
                        <span className="font-medium">
                            {formatDateTime(report.createdAt, locale)}
                        </span>
                    </div>
                    {report.detectionLabel && (
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">
                                {t('detail.aiDetection')}
                            </span>
                            <span className="font-medium">
                                {report.detectionLabel}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">
                            {report.status === 'APPROVED'
                                ? t('detail.earnedPoints')
                                : t('detail.estimatedPoints')}
                        </span>
                        <span className="text-primary font-bold">
                            {report.pointAwarded > 0
                                ? `+${report.pointAwarded}P`
                                : report.estimatedPoint && report.estimatedPoint > 0
                                  ? t('detail.estimatedPointsValue', {
                                        points: report.estimatedPoint,
                                    })
                                  : t('detail.noPoints')}
                        </span>
                    </div>
                    {report.offTimeMinutes != null && report.offTimeMinutes > 0 && (
                        <div className="flex justify-between">
                            <span className="text-on-surface-variant">
                                {t('detail.estimatedIdleTime')}
                            </span>
                            <span className="font-medium">
                                {t('detail.idleTimeValue', {
                                    hours: Math.floor(report.offTimeMinutes / 60),
                                    minutes: report.offTimeMinutes % 60,
                                })}
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
