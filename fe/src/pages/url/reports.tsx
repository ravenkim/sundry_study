import { Link } from 'react-router'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'
import { MascotEmptyState } from 'src/shared/components/mascort'
import { EcoButton } from 'src/shared/ui/eco'

const ReportsPage = () => (
    <UserAppLayout title="제보 이력">
        <MascotEmptyState
            emotion="question"
            title="아직 제보가 없어요"
            description="캠퍼스 낭비를 발견하면 제보하고 포인트를 받아보세요."
        >
            <Link to="/report-form" className="mt-2">
                <EcoButton className="px-8">낭비 제보하기</EcoButton>
            </Link>
        </MascotEmptyState>
    </UserAppLayout>
)

export default ReportsPage
