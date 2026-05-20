export interface ApiResponse<T = unknown> {
    code: number
    body?: T
}

export interface ApiErrorResponse {
    code: number
    message: string
}

export const ResponseCode = {
    OK: 10000,
    LOGIN_SUCCESS: 10001,
    REGISTER_SUCCESS: 10002,
} as const

export function isApiError(data: unknown): data is ApiErrorResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as ApiErrorResponse).message === 'string'
    )
}
