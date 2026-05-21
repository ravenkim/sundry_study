import { UserReportsList } from 'src/features/user'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ReportsPage = () => (
    <UserAppLayout title="제보 이력">
        <UserReportsList />
    </UserAppLayout>
)

export default ReportsPage
