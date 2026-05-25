import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Home,
    ClipboardCheck,
    ShoppingBag,
    User as UserIcon,
    Camera,
    type LucideIcon,
} from 'lucide-react'

export type UserNavItem = {
    name: string
    path: string
    icon: LucideIcon
    highlight?: boolean
}

export function useUserNavItems(): UserNavItem[] {
    const { t } = useTranslation('nav')

    return useMemo(
        () => [
            { name: t('menu.home'), path: '/', icon: Home },
            {
                name: t('menu.report'),
                path: '/report-form',
                icon: Camera,
                highlight: true,
            },
            { name: t('menu.reports'), path: '/reports', icon: ClipboardCheck },
            { name: t('menu.shop'), path: '/shop', icon: ShoppingBag },
            { name: t('menu.profile'), path: '/profile', icon: UserIcon },
        ],
        [t],
    )
}
