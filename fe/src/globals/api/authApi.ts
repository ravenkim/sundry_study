import client from 'src/globals/api/client'
import i18n from 'src/assets/locales/i18n'
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
    nickname: string
    password: string
    email: string
    phoneNumber: string
    affiliation: number
    buildingId?: number
}

export interface LoginResponse {
    accessToken: string
    userName: string
    email?: string
    buildingId?: number
    buildingName?: string
    userType?: 'USER' | 'ADMIN'
}

export interface EmailCheckResponse {
    email: string
    available: boolean
}

export interface UserNameCheckResponse {
    userName: string
    available: boolean
}

export interface PhoneCheckResponse {
    phoneNumber: string
    available: boolean
}

export interface NicknameCheckResponse {
    nickname: string
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
        throw new Error(data.message || i18n.t('errors:requestFailed'))
    }

    if (data.code !== successCode) {
        throw new Error(i18n.t('errors:requestFailed'))
    }

    return data
}

export function login(request: LoginRequest) {
    return postAuth<LoginResponse>(
        '/api/auth/login',
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
        throw new Error(data.message || i18n.t('errors:emailCheckFailed'))
    }

    if (data.code !== ResponseCode.OK || !data.body) {
        throw new Error(i18n.t('errors:emailCheckFailed'))
    }

    return data.body
}

export async function checkUserNameAvailability(
    userName: string,
): Promise<UserNameCheckResponse> {
    const { data } = await client.get<
        ApiResponse<UserNameCheckResponse> | ApiErrorResponse
    >('/register/check-username', { params: { userName: userName.trim() } })

    if (isApiError(data)) {
        throw new Error(data.message || i18n.t('errors:usernameCheckFailed'))
    }

    if (data.code !== ResponseCode.OK || !data.body) {
        throw new Error(i18n.t('errors:usernameCheckFailed'))
    }

    return data.body
}

export async function checkPhoneAvailability(
    phone: string,
): Promise<PhoneCheckResponse> {
    const { data } = await client.get<
        ApiResponse<PhoneCheckResponse> | ApiErrorResponse
    >('/register/check-phone', { params: { phone: phone.trim() } })

    if (isApiError(data)) {
        throw new Error(data.message || i18n.t('errors:phoneCheckFailed'))
    }

    if (data.code !== ResponseCode.OK || !data.body) {
        throw new Error(i18n.t('errors:phoneCheckFailed'))
    }

    return data.body
}

export async function checkNicknameAvailability(
    nickname: string,
): Promise<NicknameCheckResponse> {
    const { data } = await client.get<
        ApiResponse<NicknameCheckResponse> | ApiErrorResponse
    >('/register/check-nickname', { params: { nickname: nickname.trim() } })

    if (isApiError(data)) {
        throw new Error(data.message || i18n.t('errors:nicknameCheckFailed'))
    }

    if (data.code !== ResponseCode.OK || !data.body) {
        throw new Error(i18n.t('errors:nicknameCheckFailed'))
    }

    return data.body
}

export function register(request: RegisterRequest) {
    return postAuth<void>('/register', request, ResponseCode.REGISTER_SUCCESS)
}

export function ping() {
    return client.get<ApiResponse<string>>('/ping')
}
