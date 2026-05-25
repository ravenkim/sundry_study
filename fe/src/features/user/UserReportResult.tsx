import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AlertCircle, CheckCircle2, RefreshCw, XCircle } from 'lucide-react'
import { EcoButton, EcoBadge, EcoCard } from 'src/shared/ui/eco'
import type { AiReportResult } from 'src/globals/api/types'
import { usePoints } from 'src/features/points/PointsContext'
import { useAppLocale, formatNumber } from 'src/shared/lib/i18n/formatters'

interface ReportResultState {
    aiResult?: AiReportResult
    buildingName?: string
    roomName?: string
    status?: string
}

export const UserReportResult = () => {
    const { t } = useTranslation('report')
    const locale = useAppLocale()
    const location = useLocation()
    const navigate = useNavigate()
    const { points, refresh } = usePoints()
    const state = (location.state as ReportResultState | null) ?? {}

    const getDetectionLabel = (result: AiReportResult): string => {
        if (result.result === 'PASS') return t('result.detection.normal')
        if (result.result === 'ERROR') return t('result.detection.undetectable')
        const parts: string[] = []
        if (result.light_status === 'ON') parts.push(t('result.detection.lightOn'))
        if (result.ac_status === 'ON') parts.push(t('result.detection.acOn'))
        return parts.length > 0
            ? parts.join(t('result.detection.joinSeparator'))
            : t('result.detection.wasteDetected')
    }

    useEffect(() => {
        void refresh()
    }, [refresh])

    if (!state.aiResult) {
        return (
            <div className="bg-surface flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-8 p-5 py-10 text-center">
                <p className="text-on-surface-variant">
                    {t('result.loadFailed')}
                </p>
                <Link to="/report-form">
                    <EcoButton className="w-full py-3">
                        {t('result.reportAgain')}
                    </EcoButton>
                </Link>
            </div>
        )
    }

    const aiResult = state.aiResult
    const buildingName =
        state.buildingName ?? t('result.fallbackBuilding')
    const roomName = state.roomName ?? t('result.fallbackRoom')
    const isPendingReview =
        state.status === 'PENDING' || (aiResult.pointAwarded ?? 0) === 0

    if (aiResult.result === 'ERROR') {
        return (
            <div className="bg-surface flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-8 p-5 py-10 text-center">
                <div className="bg-error-container/20 rounded-full p-8">
                    <XCircle className="text-error h-24 w-24" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-black">
                        {t('result.cannotDetectTitle')}
                    </h1>
                    <p className="text-on-surface-variant">
                        {aiResult.message}
                    </p>
                </div>
                <EcoCard className="text-on-surface-variant w-full max-w-sm text-left text-sm">
                    <p>{t('result.tipChairDesk')}</p>
                    <p>{t('result.tipLightingAc')}</p>
                </EcoCard>
                <div className="flex w-full max-w-sm flex-col gap-3">
                    <EcoButton
                        className="w-full py-3"
                        onClick={() => navigate('/report-form')}
                    >
                        <RefreshCw className="h-4 w-4" />{' '}
                        {t('result.retakePhoto')}
                    </EcoButton>
                    <Link to="/">
                        <EcoButton variant="outline" className="w-full py-3">
                            {t('result.goHome')}
                        </EcoButton>
                    </Link>
                </div>
            </div>
        )
    }

    if (aiResult.result === 'PASS') {
        return (
            <div className="bg-surface flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-8 p-5 py-10 text-center">
                <div className="bg-surface-container-high rounded-full p-8">
                    <AlertCircle className="text-on-surface-variant h-24 w-24" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-black">
                        {t('result.normalTitle')}
                    </h1>
                    <p className="text-on-surface-variant">
                        {aiResult.message}
                    </p>
                </div>
                <div className="flex w-full max-w-sm flex-col gap-3">
                    <Link to="/">
                        <EcoButton className="w-full py-3">
                            {t('result.goHome')}
                        </EcoButton>
                    </Link>
                    <Link to="/report-form">
                        <EcoButton variant="outline" className="w-full py-3">
                            {t('result.reportAgainAlt')}
                        </EcoButton>
                    </Link>
                </div>
            </div>
        )
    }

    const pointAwarded = aiResult.pointAwarded ?? 0
    const balance = aiResult.currentBalance ?? points.currentBalance

    return (
        <div className="bg-surface flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-8 p-5 py-10 text-center">
            <div className="bg-secondary-container/20 rounded-full p-8">
                <CheckCircle2 className="text-secondary h-24 w-24" />
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black">
                    {isPendingReview
                        ? t('result.submittedTitle')
                        : t('result.wasteConfirmedTitle')}
                </h1>
                <p className="text-on-surface-variant">
                    {isPendingReview
                        ? aiResult.message
                        : getDetectionLabel(aiResult)}
                </p>
            </div>

            {!isPendingReview && (
                <EcoCard className="flex w-full max-w-sm flex-col gap-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-on-surface-variant">
                            {t('result.earnedPoints')}
                        </span>
                        <EcoBadge variant="yellow">
                            {t('result.rewardBadge')}
                        </EcoBadge>
                    </div>
                    <div className="text-right">
                        <span className="text-primary text-4xl font-bold">
                            +{pointAwarded}P
                        </span>
                    </div>
                    <div className="border-surface-container border-t pt-3 text-sm">
                        <span className="text-on-surface-variant">
                            {t('result.accumulated')}{' '}
                        </span>
                        <span className="text-primary font-bold">
                            {formatNumber(balance, locale)}P
                        </span>
                    </div>
                </EcoCard>
            )}

            <EcoCard className="flex w-full max-w-sm flex-col gap-3 px-6 py-4 text-left">
                <h3 className="text-sm font-bold">{t('result.summaryTitle')}</h3>
                <div className="border-surface-container flex justify-between border-b pb-2">
                    <span className="text-on-surface-variant text-sm">
                        {t('result.buildingName')}
                    </span>
                    <span className="text-sm font-bold">{buildingName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-on-surface-variant text-sm">
                        {t('result.roomName')}
                    </span>
                    <span className="text-sm font-bold">{roomName}</span>
                </div>
            </EcoCard>

            <div className="flex w-full max-w-sm flex-col gap-3">
                <Link to="/">
                    <EcoButton className="w-full py-3">
                        {t('result.goHome')}
                    </EcoButton>
                </Link>
                <Link to="/report-form">
                    <EcoButton variant="outline" className="w-full py-3">
                        {t('result.reportAgainAlt')}
                    </EcoButton>
                </Link>
            </div>
        </div>
    )
}

/** @deprecated Use UserReportResult */
export const UserReportSuccess = UserReportResult
