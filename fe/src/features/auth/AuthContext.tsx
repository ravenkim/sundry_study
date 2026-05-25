import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react'
import {
    clearAuth,
    getAccessToken,
    getStoredUser,
    isAuthenticated as checkAuth,
    setAuthSession,
    setStoredUser,
    type StoredUser,
} from 'src/features/auth/authStorage'
import {
    login as loginApi,
    register as registerApi,
} from 'src/globals/api/authApi'
import { getMyProfile } from 'src/globals/api/memberProfileApi'
import type { LoginRequest, RegisterRequest } from 'src/globals/api/authApi'

interface AuthContextValue {
    user: StoredUser | null
    isAuthenticated: boolean
    isProfileReady: boolean
    login: (request: LoginRequest) => Promise<void>
    register: (request: RegisterRequest) => Promise<void>
    completeOAuthLogin: (
        accessToken: string,
        userName: string,
        email?: string,
        buildingId?: number,
        buildingName?: string,
        userType?: 'USER' | 'ADMIN',
    ) => void
    refreshUser: (partial: Partial<StoredUser>) => void
    markProfileReady: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function profileToStoredUserPartial(
    profile: Awaited<ReturnType<typeof getMyProfile>>,
): Partial<StoredUser> {
    return {
        affiliationId: profile.affiliationId,
        affiliationName: profile.affiliationName,
        userType: profile.userType,
        email: profile.email,
        buildingId: profile.buildingId,
        buildingName: profile.buildingName,
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())
    const [authenticated, setAuthenticated] = useState(() => checkAuth())
    const [profileReady, setProfileReady] = useState(() => !checkAuth())

    const refreshUser = useCallback((partial: Partial<StoredUser>) => {
        const current = getStoredUser()
        if (!current) return
        const next = { ...current, ...partial }
        setStoredUser(next)
        setUser(next)
        setProfileReady(true)
    }, [])

    const markProfileReady = useCallback(() => {
        setProfileReady(true)
    }, [])

    useEffect(() => {
        if (!getAccessToken()) {
            setProfileReady(true)
            return
        }

        void getMyProfile()
            .then((profile) => {
                refreshUser(profileToStoredUserPartial(profile))
            })
            .catch(() => {})
            .finally(() => {
                setProfileReady(true)
            })
    }, [refreshUser])

    const login = useCallback(async (request: LoginRequest) => {
        const { body } = await loginApi(request)
        if (!body?.accessToken || !body.userName) {
            throw new Error('로그인 응답이 올바르지 않습니다.')
        }
        setAuthSession(body.accessToken, {
            userName: body.userName,
            email: body.email,
            buildingId: body.buildingId,
            buildingName: body.buildingName,
            userType: body.userType,
        })
        setUser(getStoredUser())
        setAuthenticated(true)

        try {
            const profile = await getMyProfile()
            refreshUser(profileToStoredUserPartial(profile))
        } catch {
            // 프로필 동기화 실패 시에도 로그인은 유지
        } finally {
            setProfileReady(true)
        }
    }, [refreshUser])

    const register = useCallback(async (request: RegisterRequest) => {
        await registerApi(request)
    }, [])

    const completeOAuthLogin = useCallback(
        (
            accessToken: string,
            userName: string,
            email?: string,
            buildingId?: number,
            buildingName?: string,
            userType?: 'USER' | 'ADMIN',
        ) => {
            setAuthSession(accessToken, {
                userName,
                email,
                buildingId,
                buildingName,
                userType,
            })
            setUser(getStoredUser())
            setAuthenticated(true)
            setProfileReady(false)
        },
        [],
    )

    const logout = useCallback(() => {
        clearAuth()
        setUser(null)
        setAuthenticated(false)
        setProfileReady(true)
    }, [])

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: authenticated,
            isProfileReady: profileReady,
            login,
            register,
            completeOAuthLogin,
            refreshUser,
            markProfileReady,
            logout,
        }),
        [
            user,
            authenticated,
            profileReady,
            login,
            register,
            completeOAuthLogin,
            refreshUser,
            markProfileReady,
            logout,
        ],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
