import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react'
import {
    clearAuth,
    getStoredUser,
    isAuthenticated as checkAuth,
    setDemoSession,
    type StoredUser,
} from 'src/features/auth/authStorage'
import { login as loginApi, register as registerApi } from 'src/globals/api/authApi'
import type { LoginRequest, RegisterRequest } from 'src/globals/api/authApi'

interface AuthContextValue {
    user: StoredUser | null
    isAuthenticated: boolean
    login: (request: LoginRequest) => Promise<void>
    register: (request: RegisterRequest) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())
    const [authenticated, setAuthenticated] = useState(() => checkAuth())

    const login = useCallback(async (request: LoginRequest) => {
        await loginApi(request)
        setDemoSession(request.userName)
        setUser(getStoredUser())
        setAuthenticated(true)
    }, [])

    const register = useCallback(async (request: RegisterRequest) => {
        await registerApi(request)
    }, [])

    const logout = useCallback(() => {
        clearAuth()
        setUser(null)
        setAuthenticated(false)
    }, [])

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: authenticated,
            login,
            register,
            logout,
        }),
        [user, authenticated, login, register, logout],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
