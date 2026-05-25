import { useTranslation } from 'react-i18next'
import { UserReportDetail } from 'src/features/user'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ReportDetailPage = () => {
    const { t } = useTranslation('nav')
    return (
        <UserAppLayout title={t('pages.reportDetail')}>
            <UserReportDetail />
        </UserAppLayout>
    )
}

export default ReportDetailPage
