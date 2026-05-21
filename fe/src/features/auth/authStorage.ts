const TOKEN_KEY = 'ecoreport_access_token'
const USER_KEY = 'ecoreport_user'

export interface StoredUser {
    userName: string
    email?: string
}

export function getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

export function getStoredUser(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
        return JSON.parse(raw) as StoredUser
    } catch {
        return null
    }
}

export function setStoredUser(user: StoredUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
    return Boolean(getAccessToken())
}

export function setAuthSession(accessToken: string, user: StoredUser): void {
    setAccessToken(accessToken)
    setStoredUser(user)
}
