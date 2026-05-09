import axios from 'axios'

/** 로그인 구현 후 `setStoredAccessToken`으로 저장되는 JWT */
export const ACCESS_TOKEN_STORAGE_KEY = 'bartender_access_token'

export function getStoredAccessToken(): string | null {
    try {
        return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    } catch {
        return null
    }
}

export function setStoredAccessToken(token: string | null) {
    try {
        if (token == null || token === '')
            localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
        else localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
    } catch {
        /* ignore */
    }
}

function apiOrigin(): string {
    const raw = import.meta.env.VITE_API_HOST
    return typeof raw === 'string' ? raw.replace(/\/$/, '') : ''
}

/** 백엔드 JSON API용 (예: http://localhost:8000) */
export const client = axios.create({
    baseURL: apiOrigin() || undefined,
})

client.interceptors.request.use((config) => {
    const token = getStoredAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/** 스트리밍 등 별도 base URL이 필요하면 동일 원본 사용 */
export const stream = axios.create({
    baseURL: apiOrigin() || undefined,
    responseType: 'stream',
})
