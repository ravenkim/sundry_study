import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CalendarDays, ExternalLink } from 'lucide-react'
import { AdminSidebar, AdminHeader } from 'src/shared/layout/EcoLayouts'
import { EcoBadge } from 'src/shared/ui/eco'
import {
    ScheduleMatrixFilters,
    ScheduleMatrixTable,
} from 'src/features/admin/schedules/ScheduleMatrixTable'
import { ScheduleEditSheet } from 'src/features/admin/schedules/ScheduleEditSheet'
import { useScheduleMatrix } from 'src/features/admin/schedules/useScheduleMatrix'

export function AdminSchedulesPage() {
    const { t } = useTranslation('adminSchedules')
    const {
        affiliation,
        loading,
        submitting,
        allRows,
        filteredRows,
        buildingFilter,
        setBuildingFilter,
        middleFilter,
        setMiddleFilter,
        buildingOptions,
        middleOptions,
        searchQuery,
        setSearchQuery,
        editTarget,
        setEditTarget,
        openEdit,
        saveSchedules,
    } = useScheduleMatrix()

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title={t('pageTitle')} />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-3">
                                <CalendarDays className="text-primary h-8 w-8" />
                                <h2 className="text-3xl font-bold">
                                    {t('pageTitle')}
                                </h2>
                                {affiliation && (
                                    <EcoBadge variant="yellow">
                                        {affiliation.name}
                                    </EcoBadge>
                                )}
                            </div>
                            <p className="text-on-surface-variant max-w-2xl text-sm">
                                {t('pageDescription')}
                            </p>
                            {!affiliation && (
                                <p className="text-error mt-2 text-sm">
                                    {t('affiliationMissing')}
                                </p>
                            )}
                        </div>
                        <Link
                            to="/admin/buildings"
                            className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap"
                        >
                            {t('linkToBuildings')}
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    </div>

                    <ScheduleMatrixFilters
                        rows={filteredRows}
                        allRows={allRows}
                        buildingFilter={buildingFilter}
                        middleFilter={middleFilter}
                        buildingOptions={buildingOptions}
                        middleOptions={middleOptions}
                        searchQuery={searchQuery}
                        onBuildingFilterChange={setBuildingFilter}
                        onMiddleFilterChange={setMiddleFilter}
                        onSearchQueryChange={setSearchQuery}
                    />

                    <ScheduleMatrixTable
                        rows={filteredRows}
                        loading={loading}
                        onEdit={openEdit}
                    />
                </main>
            </div>

            <ScheduleEditSheet
                target={editTarget}
                submitting={submitting}
                onClose={() => setEditTarget(null)}
                onSave={saveSchedules}
            />
        </>
    )
}

export default AdminSchedulesPage
