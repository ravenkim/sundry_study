import { History } from 'lucide-react'
import { UserAppLayout } from 'src/shared/layout/EcoLayouts'

const ReportsPage = () => (
    <UserAppLayout title="제보 이력">
        <div className="p-8 text-center">
            <History className="w-20 h-20 mx-auto text-primary-container mb-6" />
            <h2 className="text-2xl font-black mb-2">제보 이력</h2>
            <p className="font-bold text-on-surface-variant text-sm">사용자의 과거 제보 내역입니다.</p>
        </div>
    </UserAppLayout>
)

export default ReportsPage
