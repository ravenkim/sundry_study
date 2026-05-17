import { Link, useLocation } from 'react-router'
import {
    Home,
    ClipboardCheck,
    ShoppingBag,
    User as UserIcon,
    Leaf,
    Search,
    Bell,
    Settings,
    HelpCircle,
    LogOut,
    Database,
    BarChart3,
    Users,
} from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'

export const UserBottomNav = () => {
    const location = useLocation()
    const navItems = [
        { name: '홈', path: '/', icon: Home },
        { name: '제보이력', path: '/reports', icon: ClipboardCheck },
        { name: '포인트샵', path: '/shop', icon: ShoppingBag },
        { name: '마이페이지', path: '/profile', icon: UserIcon },
    ]
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant px-4 py-2 flex justify-around items-center z-50 rounded-t-xl shadow-lg md:hidden">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            'flex flex-col items-center gap-1 p-2 rounded-xl transition-all',
                            isActive
                                ? 'bg-primary-container text-on-primary-container'
                                : 'text-on-surface-variant',
                        )}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] font-bold">{item.name}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

export const AdminSidebar = () => {
    const location = useLocation()
    const navItems = [
        { name: '제보 현황', path: '/admin', icon: Database },
        { name: '포인트 관리', path: '/admin/points', icon: ShoppingBag },
        { name: '에너지 통계', path: '/admin/stats', icon: BarChart3 },
        { name: '사용자 관리', path: '/admin/users', icon: Users },
    ]
    return (
        <aside className="w-64 border-r border-outline-variant h-screen fixed left-0 top-0 bg-surface-container-low p-4 flex flex-col gap-2 z-50">
            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-on-primary-container" />
                </div>
                <div>
                    <h1 className="font-bold text-primary text-sm leading-tight">EcoReport Admin</h1>
                    <p className="text-[10px] text-on-surface-variant">Management Console</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all',
                                isActive
                                    ? 'bg-primary-container text-on-primary-container'
                                    : 'text-on-surface-variant hover:bg-surface-variant/50',
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </div>
            <div className="pt-4 border-t border-outline-variant">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span>사용자 모드</span>
                </Link>
            </div>
        </aside>
    )
}

export const AdminHeader = ({ title }: { title: string }) => (
    <header className="h-16 border-b border-outline-variant sticky top-0 bg-surface px-8 flex items-center justify-between z-40">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                    type="text"
                    placeholder="검색..."
                    className="bg-surface-container-lowest border border-outline-variant rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-primary-container"
                />
            </div>
            <Bell className="w-5 h-5 text-on-surface-variant cursor-pointer" />
            <Settings className="w-5 h-5 text-on-surface-variant cursor-pointer" />
            <HelpCircle className="w-5 h-5 text-on-surface-variant cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
            </div>
        </div>
    </header>
)
