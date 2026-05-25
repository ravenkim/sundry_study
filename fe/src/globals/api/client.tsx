import axios from 'axios'
import { getAccessToken, clearAuth } from 'src/features/auth/authStorage'
import { isApiError } from 'src/globals/api/types'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_HOST ?? '',
    timeout: 30000,
})

function isPublicAuthRequest(url?: string): boolean {
    if (!url) return false
    return (
        url.startsWith('/api/auth/login') ||
        url.startsWith('/login') ||
        url.startsWith('/register')
    )
}

const PUBLIC_APP_PATHS = [
    '/login',
    '/signup',
    '/find-account',
    '/oauth/callback',
]

function isPublicAppPath(pathname: string): boolean {
    return PUBLIC_APP_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
}

client.interceptors.request.use((config) => {
    if (isPublicAuthRequest(config.url)) {
        return config
    }
    const token = getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

client.interceptors.response.use(
    (response) => {
        if (isApiError(response.data)) {
            return Promise.reject(new Error(response.data.message))
        }
        return response
    },
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            clearAuth()
            const pathname = window.location.pathname
            if (pathname !== '/login' && !isPublicAppPath(pathname)) {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    },
)

export const stream = axios.create({
    baseURL: import.meta.env.VITE_API_HOST ?? '',
    responseType: 'stream',
})

export default client
