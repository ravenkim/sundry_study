import axios from 'axios'
import { getAccessToken, clearAuth } from 'src/features/auth/authStorage'
import { isApiError } from 'src/globals/api/types'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_HOST ?? '',
    timeout: 15000,
})

function isPublicAuthRequest(url?: string): boolean {
    if (!url) return false
    return (
        url.startsWith('/api/auth/login') ||
        url.startsWith('/login') ||
        url.startsWith('/register')
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
            if (window.location.pathname !== '/login') {
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
