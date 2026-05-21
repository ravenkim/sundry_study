import axios from 'axios'
import { getAccessToken, clearAuth } from 'src/features/auth/authStorage'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_HOST ?? '',
})

client.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

client.interceptors.response.use(
    (response) => response,
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
