import { useTranslation } from 'react-i18next'
import { UserReportResult } from 'src/features/user'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ReportSuccessPage = () => {
    const { t } = useTranslation('nav')
    return (
        <UserAppLayout title={t('pages.reportSuccess')} showPoints={false}>
            <UserReportResult />
        </UserAppLayout>
    )
}

export default ReportSuccessPage
