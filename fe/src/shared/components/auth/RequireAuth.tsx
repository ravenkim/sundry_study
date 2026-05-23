import { Navigate, useLocation } from 'react-router'
import { useAuth } from 'src/features/auth/AuthContext'
import { getAppHomePath, isAdminUser } from 'src/features/auth/authStorage'
import type { ReactNode } from 'react'

const PUBLIC_PATHS = [
    '/login',
    '/signup',
    '/signup/affiliation',
    '/signup/school',
    '/signup/admin',
    '/find-account',
    '/oauth/callback',
]

function isAdminRoute(pathname: string): boolean {
    return pathname === '/admin' || pathname.startsWith('/admin/')
}

export function RequireAuth({ children }: { children: ReactNode }) {
    const { isAuthenticated, user } = useAuth()
    const location = useLocation()
    const pathname = location.pathname
    const isPublic = PUBLIC_PATHS.includes(pathname)

    if (!isAuthenticated && !isPublic) {
        return (
            <Navigate to="/login" replace state={{ from: pathname }} />
        )
    }

    if (isAuthenticated && !isPublic) {
        const admin = isAdminUser(user)

        if (isAdminRoute(pathname) && !admin) {
            return <Navigate to="/" replace />
        }

        if (!isAdminRoute(pathname) && admin) {
            return <Navigate to={getAppHomePath(user)} replace />
        }
    }

    return children
}
