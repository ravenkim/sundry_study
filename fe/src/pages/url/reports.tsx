import { useTranslation } from 'react-i18next'
import { UserReportsList } from 'src/features/user'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ReportsPage = () => {
    const { t } = useTranslation('nav')
    return (
        <UserAppLayout title={t('pages.reports')}>
            <UserReportsList />
        </UserAppLayout>
    )
}

export default ReportsPage
