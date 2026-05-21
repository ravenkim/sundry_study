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
    setAuthSession,
    type StoredUser,
} from 'src/features/auth/authStorage'
import { login as loginApi, register as registerApi } from 'src/globals/api/authApi'
import type { LoginRequest, RegisterRequest } from 'src/globals/api/authApi'

interface AuthContextValue {
    user: StoredUser | null
    isAuthenticated: boolean
    login: (request: LoginRequest) => Promise<void>
    register: (request: RegisterRequest) => Promise<void>
    completeOAuthLogin: (
        accessToken: string,
        userName: string,
        email?: string,
    ) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())
    const [authenticated, setAuthenticated] = useState(() => checkAuth())

    const login = useCallback(async (request: LoginRequest) => {
        const { body } = await loginApi(request)
        if (!body?.accessToken || !body.userName) {
            throw new Error('로그인 응답이 올바르지 않습니다.')
        }
        setAuthSession(body.accessToken, {
            userName: body.userName,
            email: body.email,
        })
        setUser(getStoredUser())
        setAuthenticated(true)
    }, [])

    const register = useCallback(async (request: RegisterRequest) => {
        await registerApi(request)
    }, [])

    const completeOAuthLogin = useCallback(
        (accessToken: string, userName: string, email?: string) => {
            setAuthSession(accessToken, { userName, email })
            setUser(getStoredUser())
            setAuthenticated(true)
        },
        [],
    )

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
            completeOAuthLogin,
            logout,
        }),
        [user, authenticated, login, register, completeOAuthLogin, logout],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
