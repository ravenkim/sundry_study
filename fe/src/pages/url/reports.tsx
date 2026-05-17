import { History } from 'lucide-react'
import { UserBottomNav } from 'src/features/eco/EcoLayouts'

const ReportsPage = () => (
    <>
        <div className="p-8 text-center pt-24 pb-24">
            <History className="w-20 h-20 mx-auto text-primary-container mb-6" />
            <h1 className="text-3xl font-black mb-2">제보 이력</h1>
            <p className="font-bold text-on-surface-variant text-sm">사용자의 과거 제보 내역입니다.</p>
        </div>
        <UserBottomNav />
    </>
)

export default ReportsPage
