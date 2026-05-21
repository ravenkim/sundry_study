import client from 'src/globals/api/client'
import {
    ApiErrorResponse,
    ApiResponse,
    isApiError,
    ResponseCode,
} from 'src/globals/api/types'

export interface LoginRequest {
    userName: string
    password: string
}

export interface RegisterRequest {
    userName: string
    password: string
    email: string
}

export interface LoginResponse {
    accessToken: string
    userName: string
    email?: string
}

export interface EmailCheckResponse {
    email: string
    available: boolean
}

async function postAuth<T>(
    path: string,
    body: unknown,
    successCode: number,
): Promise<ApiResponse<T>> {
    const { data } = await client.post<ApiResponse<T> | ApiErrorResponse>(
        path,
        body,
    )

    if (isApiError(data)) {
        throw new Error(data.message || '요청 처리 중 오류가 발생했습니다.')
    }

    if (data.code !== successCode) {
        throw new Error('요청 처리 중 오류가 발생했습니다.')
    }

    return data
}

export function login(request: LoginRequest) {
    return postAuth<LoginResponse>(
        '/login',
        request,
        ResponseCode.LOGIN_SUCCESS,
    )
}

export async function checkEmailAvailability(
    email: string,
): Promise<EmailCheckResponse> {
    const { data } = await client.get<
        ApiResponse<EmailCheckResponse> | ApiErrorResponse
    >('/register/check-email', { params: { email: email.trim() } })

    if (isApiError(data)) {
        throw new Error(data.message || '이메일 확인에 실패했습니다.')
    }

    if (data.code !== ResponseCode.OK || !data.body) {
        throw new Error('이메일 확인에 실패했습니다.')
    }

    return data.body
}

export function register(request: RegisterRequest) {
    return postAuth<void>('/register', request, ResponseCode.REGISTER_SUCCESS)
}

export function ping() {
    return client.get<ApiResponse<string>>('/ping')
}
