import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AlertCircle, CheckCircle2, RefreshCw, XCircle } from 'lucide-react'
import { EcoButton, EcoBadge, EcoCard } from 'src/shared/ui/eco'
import type { AiReportResult } from 'src/globals/api/types'
import { usePoints } from 'src/features/points/PointsContext'

interface ReportResultState {
    aiResult?: AiReportResult
    buildingName?: string
    roomName?: string
}

function getDetectionLabel(result: AiReportResult): string {
    if (result.result === 'PASS') return '정상 상태'
    if (result.result === 'ERROR') return '판별 불가'
    const parts: string[] = []
    if (result.light_status === 'ON') parts.push('조명 켜짐')
    if (result.ac_status === 'ON') parts.push('에어컨 가동')
    return parts.length > 0 ? parts.join(' / ') : '낭비 감지'
}

export const UserReportResult = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { points, refresh } = usePoints()
    const state = (location.state as ReportResultState | null) ?? {}

    useEffect(() => {
        void refresh()
    }, [refresh])

    const aiResult: AiReportResult = state.aiResult ?? {
        result: 'WASTE_DETECTED',
        message: '빈 강의실에서 에너지 낭비가 발견되었습니다!',
        light_status: 'ON',
        pointAwarded: 100,
        currentBalance: points.currentBalance,
    }

    const buildingName = state.buildingName ?? '공학관 A동'
    const roomName = state.roomName ?? '303호'

    if (aiResult.result === 'ERROR') {
        return (
            <div className="bg-surface flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-8 p-5 py-10 text-center">
                <div className="bg-error-container/20 rounded-full p-8">
                    <XCircle className="text-error h-24 w-24" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-black">판별할 수 없습니다</h1>
                    <p className="text-on-surface-variant">
                        {aiResult.message}
                    </p>
                </div>
                <EcoCard className="text-on-surface-variant w-full max-w-sm text-left text-sm">
                    <p>• 의자와 책상이 보이도록 다시 촬영해 주세요.</p>
                    <p>• 조명·에어컨 상태가 잘 보이는 각도로 촬영해 주세요.</p>
                </EcoCard>
                <div className="flex w-full max-w-sm flex-col gap-3">
                    <EcoButton
                        className="w-full py-3"
                        onClick={() => navigate('/report-form')}
                    >
                        <RefreshCw className="h-4 w-4" /> 다시 촬영하기
                    </EcoButton>
                    <Link to="/">
                        <EcoButton variant="outline" className="w-full py-3">
                            홈으로 이동
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
                    <h1 className="text-2xl font-black">정상 상태입니다</h1>
                    <p className="text-on-surface-variant">
                        {aiResult.message}
                    </p>
                </div>
                <div className="flex w-full max-w-sm flex-col gap-3">
                    <Link to="/">
                        <EcoButton className="w-full py-3">
                            홈으로 이동
                        </EcoButton>
                    </Link>
                    <Link to="/report-form">
                        <EcoButton variant="outline" className="w-full py-3">
                            또 제보하기
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
                <h1 className="text-2xl font-black">낭비 확인됨!</h1>
                <p className="text-on-surface-variant">
                    {getDetectionLabel(aiResult)}
                </p>
            </div>

            <EcoCard className="flex w-full max-w-sm flex-col gap-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">적립 포인트</span>
                    <EcoBadge variant="yellow">리워드</EcoBadge>
                </div>
                <div className="text-right">
                    <span className="text-primary text-4xl font-bold">
                        +{pointAwarded}P
                    </span>
                </div>
                <div className="border-surface-container border-t pt-3 text-sm">
                    <span className="text-on-surface-variant">누적 </span>
                    <span className="text-primary font-bold">
                        {balance.toLocaleString()}P
                    </span>
                </div>
            </EcoCard>

            <EcoCard className="flex w-full max-w-sm flex-col gap-3 px-6 py-4 text-left">
                <h3 className="text-sm font-bold">제보 요약</h3>
                <div className="border-surface-container flex justify-between border-b pb-2">
                    <span className="text-on-surface-variant text-sm">
                        건물명
                    </span>
                    <span className="text-sm font-bold">{buildingName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-on-surface-variant text-sm">
                        강의실
                    </span>
                    <span className="text-sm font-bold">{roomName}</span>
                </div>
            </EcoCard>

            <div className="flex w-full max-w-sm flex-col gap-3">
                <Link to="/">
                    <EcoButton className="w-full py-3">홈으로 이동</EcoButton>
                </Link>
                <Link to="/report-form">
                    <EcoButton variant="outline" className="w-full py-3">
                        또 제보하기
                    </EcoButton>
                </Link>
            </div>
        </div>
    )
}

/** @deprecated Use UserReportResult */
export const UserReportSuccess = UserReportResult
