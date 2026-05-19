import { UserReportSuccess } from 'src/features/user'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ReportSuccessPage = () => (
    <UserAppLayout title="제보 완료" showPoints={false}>
        <UserReportSuccess />
    </UserAppLayout>
)

export default ReportSuccessPage
