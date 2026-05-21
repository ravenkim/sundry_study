import { Navigate, useLocation } from 'react-router'
import { useAuth } from 'src/features/auth/AuthContext'
import type { ReactNode } from 'react'

const PUBLIC_PATHS = ['/login', '/signup', '/oauth/callback']

export function RequireAuth({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    if (!isAuthenticated && !PUBLIC_PATHS.includes(location.pathname)) {
        return (
            <Navigate to="/login" replace state={{ from: location.pathname }} />
        )
    }

    return children
}
