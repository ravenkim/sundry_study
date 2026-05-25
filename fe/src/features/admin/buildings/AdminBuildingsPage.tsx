import { useTranslation } from 'react-i18next'
import { AdminSidebar, AdminHeader } from 'src/shared/layout/EcoLayouts'
import { EcoBadge } from 'src/shared/ui/eco'
import { LocationExplorer } from 'src/features/admin/buildings/LocationExplorer'
import { useLocationTree } from 'src/features/admin/buildings/useLocationTree'

export const AdminBuildingsPage = () => {
    const { t } = useTranslation('adminBuildings')
    const locationTree = useLocationTree()
    const { affiliation } = locationTree

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title={t('pageTitle')} />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                            <h2 className="text-3xl font-bold">
                                {t('pageTitle')}
                            </h2>
                            {affiliation && (
                                <EcoBadge variant="yellow">
                                    {affiliation.name}
                                </EcoBadge>
                            )}
                        </div>
                        <p className="text-on-surface-variant text-sm">
                            {t('pageDescription')}
                        </p>
                        {!affiliation && (
                            <p className="text-error mt-2 text-sm">
                                {t('affiliationMissing')}
                            </p>
                        )}
                    </div>

                    <LocationExplorer {...locationTree} />
                </main>
            </div>
        </>
    )
}

export default AdminBuildingsPage
