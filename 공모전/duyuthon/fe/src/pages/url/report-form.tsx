import { useTranslation } from 'react-i18next'
import { UserReportForm } from 'src/features/user'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ReportFormPage = () => {
    const { t } = useTranslation('nav')
    return (
        <UserAppLayout title={t('pages.reportForm')}>
            <UserReportForm />
        </UserAppLayout>
    )
}

export default ReportFormPage
