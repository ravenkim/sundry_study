import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
    Leaf,
    ChevronRight,
    Coins,
    ClipboardCheck,
    FileText,
    Edit2,
    Languages,
    LogOut,
} from 'lucide-react'
import { LanguageSwitcher } from 'src/shared/components/i18n/LanguageSwitcher'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoButton, EcoBadge, EcoCard } from 'src/shared/ui/eco'
import { MascotImage } from 'src/shared/components/mascort'
import { ParticipatedBuildingSavingsCard } from './ParticipatedBuildingSavings'
import { usePoints } from 'src/features/points/PointsContext'
import { useAuth } from 'src/features/auth/AuthContext'
import { getMyReports } from 'src/globals/api/reportApi'
import type { ReportSummary, ReportStatus } from 'src/globals/api/types'
import {
    formatKwh,
    sumParticipatedKwh,
} from './userSavingsData'
import { useMyBuildingSavings } from './useMyBuildingSavings'
import { useReportStatusLabel } from 'src/shared/lib/i18n/reportStatus'
import { useAppLocale, formatNumber } from 'src/shared/lib/i18n/formatters'

function statusVariant(status: ReportStatus): 'green' | 'gray' | 'yellow' {
    if (status === 'APPROVED') return 'green'
    if (status === 'PENDING') return 'yellow'
    return 'gray'
}

function ProfileReportStatusBadge({ status }: { status: ReportStatus }) {
    const label = useReportStatusLabel(status)
    return (
        <EcoBadge variant={statusVariant(status)}>{label}</EcoBadge>
    )
}

export const UserHome = () => {
    const { t: tUser } = useTranslation('user')
    const { t: tReport } = useTranslation('report')
    const locale = useAppLocale()
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
            <Link to="/report-form">
                <EcoButton className="w-full py-4 text-lg shadow-md">
                    {tUser('home.reportCta')}
                </EcoButton>
            </Link>

            <div className="grid grid-cols-1 gap-4">
                <EcoCard className="flex flex-col gap-2">
                    <span className="text-on-surface-variant text-sm font-medium">
                        {tUser('home.myPoints')}
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-primary text-4xl font-bold">
                            {pointsLoading
                                ? '—'
                                : formatNumber(points.currentBalance, locale)}
                        </span>
                        <span className="text-primary text-2xl font-bold">
                            P
                        </span>
                    </div>
                    <span className="text-secondary text-xs font-medium">
                        {tUser('home.thisMonthEarned', {
                            points: points.thisMonthEarned,
                        })}
                    </span>
                </EcoCard>
                <ParticipatedBuildingSavingsCard />
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        {tReport('homeRecent.sectionTitle')}
                    </h2>
                    <Link
                        to="/reports"
                        className="text-primary text-xs font-bold"
                    >
                        {tReport('homeRecent.viewAll')}
                    </Link>
                </div>
                <div className="border-outline-variant bg-outline-variant flex flex-col gap-1 overflow-hidden rounded-xl border">
                    {reportsLoading ? (
                        <div className="bg-surface-container-lowest text-on-surface-variant p-8 text-center text-sm">
                            {tReport('homeRecent.loading')}
                        </div>
                    ) : recentReports.length === 0 ? (
                        <div className="bg-surface-container-lowest flex flex-col items-center gap-3 p-8 text-center">
                            <MascotImage
                                emotion="question"
                                size="md"
                                decorative
                            />
                            <p className="text-on-surface-variant text-sm">
                                {tReport('homeRecent.empty')}
                            </p>
                        </div>
                    ) : (
                        recentReports.map((item) => (
                            <div
                                key={item.reportId}
                                className="bg-surface-container-lowest flex items-center justify-between p-4"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold">
                                        {item.roomName}
                                    </span>
                                    <div className="flex gap-2">
                                        {item.detectionLabel && (
                                            <EcoBadge>
                                                {item.detectionLabel}
                                            </EcoBadge>
                                        )}
                                        <ProfileReportStatusBadge
                                            status={item.status}
                                        />
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
                                    {item.pointAwarded > 0
                                        ? `+${item.pointAwarded}P`
                                        : '-'}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export const UserProfile = () => {
    const { t } = useTranslation('user')
    const { t: tCommon } = useTranslation('common')
    const locale = useAppLocale()
    const { points, loading } = usePoints()
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [reportCount, setReportCount] = useState(0)
    const displayName =
        user?.nickname ?? user?.userName ?? t('profile.fallbackName')
    const { buildings: myBuildingSavings, loading: savingsLoading } =
        useMyBuildingSavings()

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
                <div className="border-primary-container h-20 w-20 overflow-hidden rounded-full border-2 p-1 shadow-sm">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                        alt={t('profile.avatarAlt')}
                        className="bg-surface-container h-full w-full rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <h2 className="text-on-surface text-2xl font-bold tracking-tight">
                        {displayName}
                    </h2>
                    <EcoBadge
                        variant="green"
                        className="flex w-max items-center gap-1.5 px-3 py-1 text-xs font-bold"
                    >
                        <Leaf className="h-3.5 w-3.5 fill-current" />{' '}
                        {user?.affiliationName ??
                            user?.buildingName ??
                            t('profile.fallbackBadge')}
                    </EcoBadge>
                </div>
            </section>

            <Link to="/shop">
                <EcoCard className="hover:bg-surface-container-low relative cursor-pointer overflow-hidden p-6">
                    <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05]">
                        <Coins className="h-32 w-32" />
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">
                            {t('profile.heldPoints')}
                        </span>
                        <span className="text-primary flex items-center gap-0.5 text-[10px] font-bold">
                            {t('profile.viewHistory')}{' '}
                            <ChevronRight className="h-3 w-3" />
                        </span>
                    </div>
                    <div className="relative z-10 flex items-baseline gap-1">
                        <span className="text-primary text-4xl font-black tracking-tight">
                            {loading
                                ? '—'
                                : formatNumber(points.currentBalance, locale)}
                        </span>
                        <span className="text-primary text-xl font-bold">
                            P
                        </span>
                    </div>
                </EcoCard>
            </Link>

            <section className="grid grid-cols-2 gap-4">
                <EcoCard className="flex flex-col gap-3 p-4">
                    <div className="text-primary flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">
                            {t('profile.totalReports')}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">
                            {reportCount}
                        </span>
                        <span className="text-on-surface-variant text-[10px] font-bold">
                            {t('profile.reportCountUnit')}
                        </span>
                    </div>
                </EcoCard>
                <EcoCard className="border-l-secondary flex flex-col gap-3 border-l-4 p-4">
                    <div className="text-secondary flex items-center gap-2">
                        <Leaf className="h-4 w-4 fill-current" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">
                            {t('profile.savedElectricity')}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">
                            {savingsLoading
                                ? '—'
                                : formatKwh(
                                      sumParticipatedKwh(
                                          myBuildingSavings,
                                          'total',
                                      ),
                                  )}
                        </span>
                        <span className="text-on-surface-variant text-[10px] font-bold">
                            {t('profile.kwhUnit')}
                        </span>
                    </div>
                </EcoCard>
            </section>

            <ParticipatedBuildingSavingsCard compact />

            <section className="border-outline-variant bg-surface-container-lowest overflow-hidden rounded-2xl border shadow-sm">
                <Link
                    to="/profile/edit"
                    className="group border-surface-container hover:bg-surface-container-low flex cursor-pointer items-center justify-between border-b p-4 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <Edit2 className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                        <span className="text-sm font-semibold">
                            {t('profile.editProfile')}
                        </span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-30 transition-opacity group-hover:opacity-100" />
                </Link>
                <Link
                    to="/profile/terms"
                    className="group border-surface-container hover:bg-surface-container-low flex cursor-pointer items-center justify-between border-b p-4 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                        <span className="text-sm font-semibold">
                            {t('profile.serviceTerms')}
                        </span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-30 transition-opacity group-hover:opacity-100" />
                </Link>
                <div className="border-surface-container flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-4">
                        <Languages className="h-5 w-5 opacity-70" />
                        <span className="text-sm font-semibold">
                            {tCommon('language.label')}
                        </span>
                    </div>
                    <LanguageSwitcher />
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="group text-error hover:bg-surface-container-low flex w-full cursor-pointer items-center justify-between p-4 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <LogOut className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                        <span className="text-sm font-semibold">
                            {t('profile.logout')}
                        </span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-30 transition-opacity group-hover:opacity-100" />
                </button>
            </section>
        </div>
    )
}
