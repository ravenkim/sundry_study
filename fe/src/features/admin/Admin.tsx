import { Link } from 'react-router'
import {
    ClipboardCheck,
    TrendingUp,
    AlertCircle,
    Leaf,
    Search,
    Download,
    CheckCircle2,
    X,
    Settings,
    Coins,
    Users,
    User as UserIcon,
    Clock,
    ChevronDown,
    Calendar,
    Lightbulb,
} from 'lucide-react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
} from 'recharts'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { useTranslation } from 'react-i18next'
import { EcoButton, EcoBadge, EcoCard } from 'src/shared/ui/eco'
import { AdminSidebar, AdminHeader } from 'src/shared/layout/EcoLayouts'
import {
    useAdminDashboardState,
    useAdminReportsState,
    useAdminStatsState,
} from 'src/features/admin/useAdminData'
import { ReportLocationCell } from 'src/features/admin/ReportLocationCell'
import {
    formatDateTime,
    formatNumber,
    useAppLocale,
} from 'src/shared/lib/i18n/formatters'
import { useAdminReportStatusLabel } from 'src/shared/lib/i18n/reportStatus'
import type { ReportStatus } from 'src/globals/api/types'
import type { AdminLightWasteRoom } from 'src/globals/api/types'

function LightWasteRoomsTable({
    rooms,
    emptyMessage,
    showLastReported = true,
}: {
    rooms: AdminLightWasteRoom[]
    emptyMessage: string
    showLastReported?: boolean
}) {
    const { t } = useTranslation('admin')
    const locale = useAppLocale()

    if (rooms.length === 0) {
        return (
            <p className="text-on-surface-variant px-6 py-8 text-center text-sm">
                {emptyMessage}
            </p>
        )
    }

    return (
        <table className="w-full text-left">
            <thead>
                <tr className="bg-surface-container-lowest text-on-surface-variant border-outline-variant border-b text-[10px] font-black tracking-widest uppercase">
                    <th className="px-6 py-4">
                        {t('stats.lightWasteRooms.table.rank')}
                    </th>
                    <th className="px-6 py-4">
                        {t('stats.lightWasteRooms.table.location')}
                    </th>
                    <th className="px-6 py-4">
                        {t('stats.lightWasteRooms.table.reportCount')}
                    </th>
                    {showLastReported ? (
                        <th className="px-6 py-4">
                            {t('stats.lightWasteRooms.table.lastReported')}
                        </th>
                    ) : null}
                </tr>
            </thead>
            <tbody className="divide-outline-variant/30 divide-y text-sm font-medium">
                {rooms.map((room) => (
                    <tr
                        key={`${room.locationPath}-${room.rank}`}
                        className="hover:bg-surface-container-low/30 transition-colors"
                    >
                        <td className="text-primary px-6 py-4 font-black">
                            {room.rank}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="text-on-surface font-bold">
                                    {room.roomName}
                                </span>
                                <span className="text-on-surface-variant text-xs">
                                    {room.locationPath || room.buildingName}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <EcoBadge variant="yellow">
                                {t('stats.lightWasteRooms.reportCountValue', {
                                    count: room.reportCount,
                                })}
                            </EcoBadge>
                        </td>
                        {showLastReported ? (
                            <td className="text-on-surface-variant px-6 py-4 text-xs">
                                {room.lastReportedAt
                                    ? formatDateTime(room.lastReportedAt, locale)
                                    : '-'}
                            </td>
                        ) : null}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function ReportStatusBadge({ status }: { status: ReportStatus }) {
    const label = useAdminReportStatusLabel(status)
    const variant =
        status === 'PENDING'
            ? 'yellow'
            : status === 'APPROVED'
              ? 'green'
              : 'gray'

    return <EcoBadge variant={variant}>{label}</EcoBadge>
}
export const AdminDashboard = () => {
    const { t } = useTranslation('admin')
    const locale = useAppLocale()
    const stats = useAdminDashboardState()
    const adminStats = useAdminStatsState()
    const { reports, handleStatusUpdate } = useAdminReportsState()
    const topLightWasteRooms = (adminStats?.topLightWasteRooms ?? []).slice(0, 5)

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title={t('dashboard.headerTitle')} />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="mb-1 text-3xl font-bold">
                                {t('dashboard.title')}
                            </h2>
                            <p className="text-on-surface-variant">
                                {t('dashboard.description')}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <EcoCard className="hover:border-primary-container flex h-32 flex-col justify-between border-b-2 transition-all">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant text-sm font-bold">
                                    {t('dashboard.stats.todayReports')}
                                </span>
                                <div className="bg-primary-container/20 text-primary rounded-full p-1.5">
                                    <ClipboardCheck className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    {stats?.todayReports ?? '—'}
                                </span>
                                <span className="text-secondary flex items-center text-xs font-bold">
                                    <TrendingUp className="mr-1 h-3 w-3" />{' '}
                                    {t('dashboard.stats.todayReportsTrend')}
                                </span>
                            </div>
                        </EcoCard>
                        <EcoCard className="hover:border-error flex h-32 flex-col justify-between border-b-2 transition-all">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant text-sm font-bold">
                                    {t('dashboard.stats.pendingReports')}
                                </span>
                                <div className="bg-error-container text-error rounded-full p-1.5">
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-error text-3xl font-bold">
                                    {stats?.pendingReports ?? '—'}
                                </span>
                                <span className="text-on-surface-variant text-xs">
                                    {t('dashboard.stats.pendingReportsHint')}
                                </span>
                            </div>
                        </EcoCard>
                        <EcoCard className="hover:border-secondary flex h-32 flex-col justify-between border-b-2 transition-all">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant text-sm font-bold">
                                    {t('dashboard.stats.totalCo2Saved')}
                                </span>
                                <div className="bg-secondary-container text-secondary rounded-full p-1.5">
                                    <Leaf className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    {stats?.totalCo2SavedKg != null
                                        ? formatNumber(
                                              stats.totalCo2SavedKg,
                                              locale,
                                          )
                                        : '—'}
                                </span>
                                <span className="text-on-surface-variant text-xs">
                                    {t('dashboard.stats.co2Unit')}
                                </span>
                            </div>
                        </EcoCard>
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <div className="bg-surface-container-low border-outline-variant flex items-center justify-between border-b p-5">
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <Lightbulb className="text-primary h-5 w-5" />
                                    <h3 className="text-lg font-bold">
                                        {t('dashboard.lightWasteRooms.title')}
                                    </h3>
                                </div>
                                <p className="text-on-surface-variant text-xs font-medium">
                                    {t('dashboard.lightWasteRooms.subtitle')}
                                </p>
                            </div>
                            <Link
                                to="/admin/stats"
                                className="text-primary text-xs font-bold hover:underline"
                            >
                                {t('dashboard.lightWasteRooms.viewAll')}
                            </Link>
                        </div>
                        <LightWasteRoomsTable
                            rooms={topLightWasteRooms}
                            emptyMessage={t('dashboard.lightWasteRooms.empty')}
                            showLastReported={false}
                        />
                    </EcoCard>

                    <EcoCard className="overflow-hidden p-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-outline-variant bg-surface text-on-surface-variant border-b text-xs font-bold">
                                    <th className="p-4">
                                        {t('dashboard.table.reportDate')}
                                    </th>
                                    <th className="p-4">
                                        {t('dashboard.table.location')}
                                    </th>
                                    <th className="p-4">
                                        {t('dashboard.table.aiResult')}
                                    </th>
                                    <th className="p-4">
                                        {t('dashboard.table.author')}
                                    </th>
                                    <th className="p-4">
                                        {t('dashboard.table.status')}
                                    </th>
                                    <th className="p-4 text-right">
                                        {t('dashboard.table.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-outline-variant/30 divide-y text-sm font-medium">
                                {reports.map((item) => (
                                    <tr
                                        key={item.reportId}
                                        className="hover:bg-surface-container-low/30 transition-colors"
                                    >
                                        <td className="p-4 text-xs">
                                            {formatDateTime(
                                                item.createdAt,
                                                locale,
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <ReportLocationCell report={item} />
                                        </td>
                                        <td className="p-4">
                                            <EcoBadge variant="gray">
                                                {item.aiResult}
                                            </EcoBadge>
                                        </td>
                                        <td className="p-4">
                                            {item.memberName}
                                        </td>
                                        <td className="p-4">
                                            <ReportStatusBadge
                                                status={item.status}
                                            />
                                        </td>
                                        <td className="p-4 text-right">
                                            {item.status === 'PENDING' ? (
                                                <div className="flex justify-end gap-2">
                                                    <EcoButton
                                                        className="px-3 py-1 text-xs"
                                                        onClick={() =>
                                                            void handleStatusUpdate(
                                                                item.reportId,
                                                                'APPROVED',
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'dashboard.actions.approve',
                                                        )}
                                                    </EcoButton>
                                                    <EcoButton
                                                        variant="outline"
                                                        className="px-3 py-1 text-xs"
                                                        onClick={() =>
                                                            void handleStatusUpdate(
                                                                item.reportId,
                                                                'REJECTED',
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'dashboard.actions.reject',
                                                        )}
                                                    </EcoButton>
                                                </div>
                                            ) : (
                                                <span className="text-secondary font-bold">
                                                    {item.pointAwarded > 0
                                                        ? t(
                                                              'dashboard.pointsAwarded',
                                                              {
                                                                  points:
                                                                      item.pointAwarded,
                                                              },
                                                          )
                                                        : t(
                                                              'dashboard.noPoints',
                                                          )}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </EcoCard>
                </main>
            </div>
        </>
    )
}

export const AdminReports = () => {
    const { t } = useTranslation('admin')
    const locale = useAppLocale()
    const { reports, handleStatusUpdate } = useAdminReportsState()

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title={t('reports.headerTitle')} />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="mb-1 text-3xl font-black tracking-tight">
                                {t('reports.title')}
                            </h2>
                            <p className="text-on-surface-variant text-sm font-medium">
                                {t('reports.description')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <EcoButton
                                variant="outline"
                                className="gap-2 px-4 py-2 text-xs font-bold"
                            >
                                <Download className="h-4 w-4" />{' '}
                                {t('reports.export')}
                            </EcoButton>
                        </div>
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-outline-variant bg-surface-container-lowest text-on-surface-variant border-b text-[10px] font-black tracking-widest uppercase">
                                    <th className="px-6 py-4">
                                        {t('dashboard.table.reportDate')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {t('dashboard.table.location')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {t('dashboard.table.aiResult')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {t('dashboard.table.author')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {t('dashboard.table.status')}
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        {t('dashboard.table.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-outline-variant/30 divide-y text-sm font-medium">
                                {reports.map((item) => (
                                    <tr
                                        key={item.reportId}
                                        className="hover:bg-surface-container-low/30 transition-colors"
                                    >
                                        <td className="text-on-surface-variant px-6 py-4 text-xs font-bold">
                                            {formatDateTime(
                                                item.createdAt,
                                                locale,
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <ReportLocationCell report={item} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <EcoBadge variant="gray">
                                                {item.aiResult}
                                            </EcoBadge>
                                        </td>
                                        <td className="text-on-surface px-6 py-4">
                                            {item.memberName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <ReportStatusBadge
                                                status={item.status}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.status === 'PENDING' ? (
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        className="bg-primary-container text-on-primary-container rounded-lg p-1.5 transition-all hover:brightness-95"
                                                        onClick={() =>
                                                            void handleStatusUpdate(
                                                                item.reportId,
                                                                'APPROVED',
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low rounded-lg border p-1.5 transition-all"
                                                        onClick={() =>
                                                            void handleStatusUpdate(
                                                                item.reportId,
                                                                'REJECTED',
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-secondary font-bold">
                                                    {item.pointAwarded > 0
                                                        ? t(
                                                              'dashboard.pointsAwarded',
                                                              {
                                                                  points:
                                                                      item.pointAwarded,
                                                              },
                                                          )
                                                        : t(
                                                              'dashboard.noPoints',
                                                          )}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </EcoCard>
                </main>
            </div>
        </>
    )
}

const STATS_CHART_COLORS = [
    '#FFC107',
    '#4CAF50',
    '#00DFFC',
    '#FFDDB3',
    '#E5E2E1',
    '#B39DDB',
]

export const AdminStats = () => {
    const { t } = useTranslation('admin')
    const locale = useAppLocale()
    const stats = useAdminStatsState()

    const pieData = (stats?.buildingShares ?? []).map((item, index) => ({
        name: item.name,
        value: item.percentage,
        count: item.count,
        color: STATS_CHART_COLORS[index % STATS_CHART_COLORS.length],
    }))

    const barData = (stats?.wasteByCategory ?? []).map((item) => ({
        name: item.name,
        value: item.count,
    }))

    const monthlyRows = stats?.monthlySummaries ?? []
    const lightWasteRooms = stats?.topLightWasteRooms ?? []

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title={t('stats.headerTitle')} />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 p-8">
                    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h1 className="mb-1 text-3xl font-black tracking-tight">
                                {t('stats.title')}
                            </h1>
                            <p className="text-on-surface-variant text-sm font-medium">
                                {t('stats.description')}
                            </p>
                        </div>
                        <div className="border-outline-variant bg-surface-container-lowest hover:border-primary flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold shadow-sm transition-all">
                            <Calendar className="text-on-surface-variant h-4 w-4" />
                            <span>{t('stats.dateRange')}</span>
                            <ChevronDown className="text-on-surface-variant h-4 w-4" />
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <EcoCard className="flex flex-col items-center p-6">
                            <div className="mb-6 w-full">
                                <h3 className="text-lg font-bold tracking-tight">
                                    {t('stats.buildingShare.title')}
                                </h3>
                                <p className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase">
                                    {t('stats.buildingShare.subtitle')}
                                </p>
                            </div>
                            <div className="relative flex h-56 w-full items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pointer-events-none absolute flex flex-col items-center justify-center">
                                    <span className="text-primary text-3xl font-black">
                                        {formatNumber(
                                            stats?.totalReports ?? 0,
                                            locale,
                                        )}
                                    </span>
                                    <span className="text-on-surface-variant text-[10px] font-bold uppercase">
                                        {t('stats.buildingShare.totalReports')}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 grid w-full grid-cols-2 gap-x-6 gap-y-2">
                                {pieData.map((d) => (
                                    <div
                                        key={d.name}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                            style={{ background: d.color }}
                                        />
                                        <span className="text-on-surface-variant truncate text-xs font-medium">
                                            {d.name}
                                        </span>
                                        <span className="ml-auto text-xs font-bold">
                                            {t('stats.buildingShare.percent', {
                                                value: d.value,
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </EcoCard>

                        <EcoCard className="flex flex-col p-6 lg:col-span-2">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold tracking-tight">
                                    {t('stats.wasteByCategory.title')}
                                </h3>
                                <p className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase">
                                    {t('stats.wasteByCategory.subtitle')}
                                </p>
                            </div>
                            <div className="min-h-[300px] flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={barData}
                                        layout="vertical"
                                        margin={{ left: 20 }}
                                    >
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={100}
                                            axisLine={false}
                                            tickLine={false}
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="#FFC107"
                                            radius={[0, 4, 4, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </EcoCard>
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <div className="bg-surface-container-low border-outline-variant flex items-center justify-between border-b p-5">
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <Lightbulb className="text-primary h-5 w-5" />
                                    <h3 className="text-lg font-bold">
                                        {t('stats.lightWasteRooms.title')}
                                    </h3>
                                </div>
                                <p className="text-on-surface-variant text-xs font-medium">
                                    {t('stats.lightWasteRooms.subtitle')}
                                </p>
                            </div>
                        </div>
                        <LightWasteRoomsTable
                            rooms={lightWasteRooms}
                            emptyMessage={t('stats.lightWasteRooms.empty')}
                        />
                    </EcoCard>

                    <EcoCard className="overflow-hidden p-0">
                        <div className="bg-surface-container-low border-outline-variant flex items-center justify-between border-b p-5">
                            <h3 className="text-lg font-bold">
                                {t('stats.monthly.title')}
                            </h3>
                            <EcoButton
                                variant="outline"
                                className="gap-2 px-4 py-2 text-xs font-bold"
                            >
                                <Download className="h-4 w-4" />{' '}
                                {t('stats.monthly.excelDownload')}
                            </EcoButton>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-surface-container-lowest text-on-surface-variant border-outline-variant border-b text-[10px] font-black tracking-widest uppercase">
                                        <th className="px-6 py-4">
                                            {t('stats.monthly.table.month')}
                                        </th>
                                        <th className="px-6 py-4">
                                            {t('stats.monthly.table.totalReports')}
                                        </th>
                                        <th className="px-6 py-4">
                                            {t('stats.monthly.table.completed')}
                                        </th>
                                        <th className="px-6 py-4">
                                            {t('stats.monthly.table.co2Saved')}
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            {t('stats.monthly.table.pointsAwarded')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-outline-variant/30 divide-y text-sm font-medium">
                                    {monthlyRows.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-on-surface-variant px-6 py-8 text-center"
                                            >
                                                {t('stats.monthly.empty')}
                                            </td>
                                        </tr>
                                    ) : (
                                        monthlyRows.map((row) => (
                                            <tr
                                                key={row.monthLabel}
                                                className="hover:bg-surface-container-low transition-colors"
                                            >
                                                <td className="text-on-surface px-6 py-4 font-bold">
                                                    {row.monthLabel}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formatNumber(
                                                        row.totalReports,
                                                        locale,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <EcoBadge variant="green">
                                                        {t(
                                                            'stats.monthly.table.completedBadge',
                                                            {
                                                                count: row.completedReports,
                                                                percent:
                                                                    row.completedPercent,
                                                            },
                                                        )}
                                                    </EcoBadge>
                                                </td>
                                                <td className="text-secondary px-6 py-4 font-bold">
                                                    {t(
                                                        'stats.monthly.table.co2Value',
                                                        {
                                                            value: formatNumber(
                                                                row.co2SavedKg,
                                                                locale,
                                                            ),
                                                        },
                                                    )}
                                                </td>
                                                <td className="text-primary px-6 py-4 text-right font-bold">
                                                    {t(
                                                        'stats.monthly.table.pointsValue',
                                                        {
                                                            value: formatNumber(
                                                                row.pointsAwarded,
                                                                locale,
                                                            ),
                                                        },
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </EcoCard>
                </main>
            </div>
        </>
    )
}

export const AdminUsers = () => {
    const { t } = useTranslation('admin')

    const userStats = [
        {
            label: t('users.stats.totalUsers'),
            value: '1,450',
            icon: Users,
            color: 'text-primary',
            showTrend: false,
        },
        {
            label: t('users.stats.newUsersWeekly'),
            value: '86',
            icon: UserIcon,
            color: 'text-secondary',
            showTrend: true,
        },
        {
            label: t('users.stats.activeUsersDaily'),
            value: '342',
            icon: Clock,
            color: 'text-tertiary',
            showTrend: false,
        },
        {
            label: t('users.stats.pointsPaid'),
            value: '2.4M',
            icon: Coins,
            color: 'text-primary',
            showTrend: false,
        },
    ]

    const mockUsers = [
        {
            name: '김철수',
            email: 'chulsoo@univ.ac.kr',
            date: '2024.10.15',
            count: 12,
            points: '12,450 P',
            grade: t('users.grade.greenMaster'),
        },
        {
            name: '이영희',
            email: 'younghee@univ.ac.kr',
            date: '2024.10.20',
            count: 5,
            points: '4,200 P',
            grade: t('users.grade.greenRookie'),
        },
        {
            name: '박지민',
            email: 'jimin@univ.ac.kr',
            date: '2024.10.22',
            count: 18,
            points: '24,600 P',
            grade: t('users.grade.ecoHero'),
        },
    ]

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title={t('users.headerTitle')} />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div>
                        <h2 className="mb-1 text-3xl font-black tracking-tight">
                            {t('users.title')}
                        </h2>
                        <p className="text-on-surface-variant text-sm font-medium">
                            {t('users.description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                        {userStats.map((stat, i) => (
                            <EcoCard
                                key={i}
                                className="relative flex flex-col gap-4 overflow-hidden p-5"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            'bg-surface-container flex h-10 w-10 items-center justify-center rounded-full',
                                            stat.color,
                                        )}
                                    >
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-on-surface-variant text-[10px] font-black tracking-widest uppercase">
                                        {stat.label}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-on-surface text-3xl font-black tracking-tight">
                                        {stat.value}
                                    </span>
                                    {stat.showTrend && (
                                        <span className="text-secondary ml-1 text-[10px] font-bold">
                                            {t('users.stats.newUsersTrend')}
                                        </span>
                                    )}
                                </div>
                            </EcoCard>
                        ))}
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <div className="bg-surface-container-low border-outline-variant flex gap-3 border-b p-4">
                            <div className="relative flex-1">
                                <Search className="text-on-surface-variant absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder={t('users.searchPlaceholder')}
                                    className="bg-surface-container-lowest border-outline-variant focus:border-primary-container w-full rounded-lg border py-2 pr-4 pl-10 text-sm font-medium focus:outline-none"
                                />
                            </div>
                            <EcoButton
                                variant="outline"
                                className="px-4 py-2 text-sm font-bold"
                            >
                                {t('users.filter')}
                            </EcoButton>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-surface-container-lowest text-on-surface-variant border-outline-variant border-b text-[10px] font-black tracking-widest uppercase">
                                    <th className="px-6 py-4">
                                        {t('users.table.user')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {t('users.table.email')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {t('users.table.joinDate')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {t('users.table.reportCount')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {t('users.table.points')}
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        {t('users.table.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-outline-variant/30 divide-y text-sm font-medium">
                                {mockUsers.map((user, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-surface-container-low/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-surface-container h-9 w-9 overflow-hidden rounded-full">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                        alt={user.name}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-on-surface font-bold">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-secondary text-[10px] leading-none font-black">
                                                        {user.grade}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-on-surface-variant px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td className="text-on-surface-variant px-6 py-4">
                                            {user.date}
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {t('users.table.reportCountValue', {
                                                count: user.count,
                                            })}
                                        </td>
                                        <td className="text-primary px-6 py-4 font-black">
                                            {user.points}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="border-outline-variant hover:bg-surface-container-low rounded-lg border p-2 transition-all">
                                                <Settings className="text-on-surface-variant h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </EcoCard>
                </main>
            </div>
        </>
    )
}
