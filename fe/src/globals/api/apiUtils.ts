import { ApiResponse } from 'src/globals/api/types'

export function shouldUseMock(): boolean {
    return import.meta.env.VITE_USE_MOCK !== 'false'
}

export function unwrapApiData<T>(data: ApiResponse<T> | T): T {
    if (typeof data === 'object' && data !== null) {
        if ('body' in data && (data as ApiResponse<T>).body !== undefined) {
            return (data as ApiResponse<T>).body as T
        }
        if ('data' in data && (data as ApiResponse<T>).data !== undefined) {
            return (data as ApiResponse<T>).data as T
        }
    }
    return data as T
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function withMockFallback<T>(
    request: () => Promise<T>,
    fallback: () => T | Promise<T>,
): Promise<T> {
    if (shouldUseMock()) {
        return fallback()
    }

    try {
        return await request()
    } catch {
        return fallback()
    }
}
