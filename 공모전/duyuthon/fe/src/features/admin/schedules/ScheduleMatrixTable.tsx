import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil } from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoButton } from 'src/shared/ui/eco'
import { SSloadingState } from 'src/shared/components/motion'
import { getDepthLabel } from 'src/features/admin/buildings/locationTreeUtils'
import { getDayLabel } from 'src/features/admin/buildings/operatingScheduleUtils'
import {
    formatScheduleCell,
    getJavaDayOfWeek,
    WEEKDAY_ORDER,
    type ScheduleMatrixRow,
} from 'src/features/admin/schedules/scheduleMatrixUtils'

export function ScheduleMatrixTable({
    rows,
    loading,
    onEdit,
}: {
    rows: ScheduleMatrixRow[]
    loading: boolean
    onEdit: (row: ScheduleMatrixRow) => void
}) {
    const { t } = useTranslation('adminSchedules')
    const today = getJavaDayOfWeek()

    if (loading) {
        return (
            <SSloadingState
                text={t('matrix.loading')}
                className="border-outline-variant rounded-xl border"
            />
        )
    }

    if (rows.length === 0) {
        return (
            <div className="border-outline-variant text-on-surface-variant rounded-xl border p-12 text-center text-sm">
                {t('matrix.empty')}
            </div>
        )
    }

    return (
        <div className="border-outline-variant overflow-hidden rounded-xl border shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] border-collapse text-sm">
                    <thead>
                        <tr className="bg-surface-container-low border-outline-variant border-b">
                            <th className="text-on-surface-variant sticky left-0 z-10 min-w-[220px] bg-surface-container-low px-4 py-3 text-left text-xs font-bold tracking-wide uppercase">
                                {t('matrix.location')}
                            </th>
                            {WEEKDAY_ORDER.map((day) => (
                                <th
                                    key={day}
                                    className={cn(
                                        'text-on-surface-variant min-w-[88px] px-2 py-3 text-center text-xs font-bold',
                                        day === today &&
                                            'bg-primary-container/40 text-on-primary-container',
                                    )}
                                >
                                    {getDayLabel(day)}
                                    {day === today && (
                                        <span className="text-primary mt-0.5 block text-[10px] font-semibold">
                                            {t('matrix.today')}
                                        </span>
                                    )}
                                </th>
                            ))}
                            <th className="text-on-surface-variant w-16 px-2 py-3 text-center text-xs font-bold">
                                {t('matrix.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <ScheduleMatrixRowView
                                key={row.leafId}
                                row={row}
                                today={today}
                                striped={index % 2 === 1}
                                onEdit={() => onEdit(row)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function ScheduleMatrixRowView({
    row,
    today,
    striped,
    onEdit,
}: {
    row: ScheduleMatrixRow
    today: number
    striped: boolean
    onEdit: () => void
}) {
    const { t } = useTranslation('adminSchedules')
    const scheduleByDay = useMemo(
        () => new Map(row.schedules.map((s) => [s.dayOfWeek, s])),
        [row.schedules],
    )

    return (
        <tr
            className={cn(
                'border-outline-variant/60 border-b last:border-b-0',
                striped ? 'bg-surface-container-lowest/60' : 'bg-surface',
            )}
        >
            <td
                className={cn(
                    'sticky left-0 z-10 px-4 py-3',
                    striped
                        ? 'bg-surface-container-lowest/95'
                        : 'bg-surface/95',
                )}
            >
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{row.leafName}</span>
                    <span className="text-on-surface-variant text-xs">
                        {row.path.length > 1
                            ? row.path.slice(0, -1).join(' › ')
                            : row.buildingName}
                    </span>
                </div>
            </td>
            {WEEKDAY_ORDER.map((day) => {
                const schedule = scheduleByDay.get(day)
                const cell = schedule
                    ? formatScheduleCell(schedule)
                    : { label: '—', variant: 'closed' as const }

                return (
                    <td
                        key={day}
                        className={cn(
                            'px-2 py-3 text-center',
                            day === today && 'bg-primary-container/15',
                        )}
                    >
                        <span
                            className={cn(
                                'inline-block rounded-md px-1.5 py-1 text-xs font-medium whitespace-nowrap',
                                cell.variant === 'closed'
                                    ? 'text-on-surface-variant/70'
                                    : 'text-on-surface',
                            )}
                            title={
                                cell.variant === 'closed'
                                    ? t('matrix.closedHint')
                                    : cell.label
                            }
                        >
                            {cell.label}
                        </span>
                    </td>
                )
            })}
            <td className="px-2 py-3 text-center">
                <EcoButton
                    type="button"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={onEdit}
                    aria-label={t('matrix.editAria', { name: row.leafName })}
                >
                    <Pencil className="h-4 w-4" />
                </EcoButton>
            </td>
        </tr>
    )
}

export function ScheduleMatrixFilters({
    rows,
    allRows,
    buildingFilter,
    middleFilter,
    buildingOptions,
    middleOptions,
    searchQuery,
    onBuildingFilterChange,
    onMiddleFilterChange,
    onSearchQueryChange,
}: {
    rows: ScheduleMatrixRow[]
    allRows: ScheduleMatrixRow[]
    buildingFilter: number | 'all'
    middleFilter: number | 'all'
    buildingOptions: { id: number; name: string }[]
    middleOptions: { id: number; name: string }[]
    searchQuery: string
    onBuildingFilterChange: (value: number | 'all') => void
    onMiddleFilterChange: (value: number | 'all') => void
    onSearchQueryChange: (value: string) => void
}) {
    const { t } = useTranslation('adminSchedules')
    const depth1Label = getDepthLabel(1)
    const depth2Label = getDepthLabel(2)

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <label className="flex flex-col gap-1">
                    <span className="text-on-surface-variant text-xs font-semibold">
                        {depth1Label}
                    </span>
                    <select
                        value={buildingFilter === 'all' ? 'all' : String(buildingFilter)}
                        onChange={(e) => {
                            const value = e.target.value
                            onBuildingFilterChange(
                                value === 'all' ? 'all' : Number(value),
                            )
                        }}
                        className="border-outline-variant bg-surface h-10 min-w-[180px] rounded-lg border px-3 text-sm"
                    >
                        <option value="all">
                            {t('filters.allDepth', { depth: depth1Label })}
                        </option>
                        {buildingOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-on-surface-variant text-xs font-semibold">
                        {depth2Label}
                    </span>
                    <select
                        value={middleFilter === 'all' ? 'all' : String(middleFilter)}
                        disabled={buildingFilter === 'all'}
                        onChange={(e) => {
                            const value = e.target.value
                            onMiddleFilterChange(
                                value === 'all' ? 'all' : Number(value),
                            )
                        }}
                        className="border-outline-variant bg-surface h-10 min-w-[180px] rounded-lg border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="all">
                            {t('filters.allDepth', { depth: depth2Label })}
                        </option>
                        {middleOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col gap-1 sm:min-w-[240px] sm:flex-1">
                    <span className="text-on-surface-variant text-xs font-semibold">
                        {t('filters.search')}
                    </span>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                        placeholder={t('filters.searchPlaceholder')}
                        className="border-outline-variant bg-surface h-10 rounded-lg border px-3 text-sm"
                    />
                </label>
            </div>
            <p className="text-on-surface-variant text-sm">
                {t('filters.resultCount', {
                    shown: rows.length,
                    total: allRows.length,
                })}
            </p>
        </div>
    )
}
