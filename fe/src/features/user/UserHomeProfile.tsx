import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
    Leaf,
    ChevronRight,
    Coins,
    ClipboardCheck,
    Bell,
    FileText,
    Edit2,
    LogOut,
} from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoButton, EcoBadge, EcoCard } from 'src/shared/ui/eco'
import { ParticipatedBuildingSavingsCard } from './ParticipatedBuildingSavings'
import { usePoints } from 'src/features/points/PointsContext'
import { useAuth } from 'src/features/auth/AuthContext'
import { getMyReports } from 'src/globals/api/reportApi'
import type { ReportSummary, ReportStatus } from 'src/globals/api/types'
import { formatKwh, PARTICIPATED_BUILDING_SAVINGS, sumParticipatedKwh } from './userSavingsData'

const STATUS_LABEL: Record<ReportStatus, string> = {
    APPROVED: '승인됨',
    PENDING: '검토중',
    REJECTED: '반려',
    UNDETECTABLE: '판별불가',
}

function statusVariant(status: ReportStatus): 'green' | 'gray' | 'yellow' {
    if (status === 'APPROVED') return 'green'
    if (status === 'PENDING') return 'yellow'
    return 'gray'
}

export const UserHome = () => {
    const { points, loading: pointsLoading } = usePoints()
    const [recentReports, setRecentReports] = useState<ReportSummary[]>([])
    const [reportsLoading, setReportsLoading] = useState(true)

    useEffect(() => {
        void getMyReports(0, 3)
            .then((res) => setRecentReports(res.content))
            .finally(() => setReportsLoading(false))
    }, [])

    return (
        <div className="flex flex-col gap-8 p-5 pb-8">
            <div className="grid grid-cols-1 gap-4">
                <EcoCard className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-on-surface-variant">내 포인트</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-primary">
                            {pointsLoading ? '—' : points.currentBalance.toLocaleString()}
                        </span>
                        <span className="text-2xl font-bold text-primary">P</span>
                    </div>
                    <span className="text-xs font-medium text-secondary">
                        이번 달 +{points.thisMonthEarned} P
                    </span>
                </EcoCard>
                <ParticipatedBuildingSavingsCard />
            </div>

            <Link to="/report-form">
                <EcoButton className="w-full py-4 text-lg shadow-md">📷 낭비 제보하기</EcoButton>
            </Link>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">최근 제보 내역</h2>
                    <Link to="/reports" className="text-xs font-bold text-primary">
                        전체 보기
                    </Link>
                </div>
                <div className="flex flex-col gap-1 overflow-hidden rounded-xl border border-outline-variant bg-outline-variant">
                    {reportsLoading ? (
                        <div className="bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">
                            불러오는 중...
                        </div>
                    ) : recentReports.length === 0 ? (
                        <div className="bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">
                            아직 제보 내역이 없습니다.
                        </div>
                    ) : (
                        recentReports.map((item) => (
                            <Link
                                key={item.reportId}
                                to={`/reports/${item.reportId}`}
                                className="flex items-center justify-between bg-surface-container-lowest p-4 transition-colors hover:bg-surface-container-low"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold">{item.roomName}</span>
                                    <div className="flex gap-2">
                                        {item.detectionLabel && (
                                            <EcoBadge>{item.detectionLabel}</EcoBadge>
                                        )}
                                        <EcoBadge variant={statusVariant(item.status)}>
                                            {STATUS_LABEL[item.status]}
                                        </EcoBadge>
                                    </div>
                                </div>
                                <span
                                    className={cn(
                                        'font-bold',
                                        item.pointAwarded > 0
                                            ? 'text-secondary'
                                            : 'text-on-surface-variant',
                                    )}
                                >
                                    {item.pointAwarded > 0 ? `+${item.pointAwarded}P` : '-'}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-center pb-4">
                <Link
                    to="/admin"
                    className="rounded-full border border-outline-variant bg-on-surface/10 px-4 py-1.5 text-[10px] font-black text-on-surface-variant opacity-40 transition-all hover:opacity-100"
                >
                    🛡️ Admin 대시보드 →
                </Link>
            </div>
        </div>
    )
}

export const UserProfile = () => {
    const { points, loading } = usePoints()
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [reportCount, setReportCount] = useState(0)
    const displayName = user?.userName ?? '김에코'

    useEffect(() => {
        void getMyReports(0, 1).then((res) => setReportCount(res.totalElements))
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="flex flex-col gap-8 p-5 pb-8">
            <section className="flex items-center gap-5">
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary-container p-1 shadow-sm">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                        alt="User"
                        className="h-full w-full rounded-full bg-surface-container object-cover"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-on-surface">{displayName}</h2>
                    <EcoBadge
                        variant="green"
                        className="flex w-max items-center gap-1.5 px-3 py-1 text-xs font-bold"
                    >
                        <Leaf className="h-3.5 w-3.5 fill-current" /> 그린 마스터
                    </EcoBadge>
                </div>
            </section>

            <Link to="/shop">
                <EcoCard className="relative cursor-pointer overflow-hidden p-6 hover:bg-surface-container-low">
                    <div className="absolute bottom-[-10px] right-[-10px] opacity-[0.05]">
                        <Coins className="h-32 w-32" />
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            보유 포인트
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-primary">
                            내역 보기 <ChevronRight className="h-3 w-3" />
                        </span>
                    </div>
                    <div className="relative z-10 flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tight text-primary">
                            {loading ? '—' : points.currentBalance.toLocaleString()}
                        </span>
                        <span className="text-xl font-bold text-primary">P</span>
                    </div>
                </EcoCard>
            </Link>

            <section className="grid grid-cols-2 gap-4">
                <EcoCard className="flex flex-col gap-3 p-4">
                    <div className="flex items-center gap-2 text-primary">
                        <ClipboardCheck className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">총 제보</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{reportCount}</span>
                        <span className="text-[10px] font-bold text-on-surface-variant">건</span>
                    </div>
                </EcoCard>
                <EcoCard className="flex flex-col gap-3 border-l-4 border-l-secondary p-4">
                    <div className="flex items-center gap-2 text-secondary">
                        <Leaf className="h-4 w-4 fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">절약 전기</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">
                            {formatKwh(sumParticipatedKwh(PARTICIPATED_BUILDING_SAVINGS, 'total'))}
                        </span>
                        <span className="text-[10px] font-bold text-on-surface-variant">kWh</span>
                    </div>
                </EcoCard>
            </section>

            <ParticipatedBuildingSavingsCard compact />

            <section className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
                {[
                    { icon: Edit2, label: '프로필 수정' },
                    { icon: Bell, label: '알림 설정' },
                    { icon: FileText, label: '서비스 이용약관' },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="group flex cursor-pointer items-center justify-between border-b border-surface-container p-4 transition-colors last:border-0 hover:bg-surface-container-low"
                    >
                        <div className="flex items-center gap-4">
                            <item.icon className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                            <span className="text-sm font-semibold">{item.label}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-30 transition-opacity group-hover:opacity-100" />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="group flex w-full cursor-pointer items-center justify-between p-4 text-error transition-colors hover:bg-surface-container-low"
                >
                    <div className="flex items-center gap-4">
                        <LogOut className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                        <span className="text-sm font-semibold">로그아웃</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-30 transition-opacity group-hover:opacity-100" />
                </button>
            </section>
        </div>
    )
}
