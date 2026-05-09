import axios from 'axios'

import { client } from 'src/globals/api/client.tsx'

export type AuthUser = {
    id: number
    email: string
    nickname: string
}

export type LoginResponse = {
    access_token: string
    token_type?: string
    user: AuthUser
}

export async function loginRequest(
    email: string,
    password: string,
): Promise<LoginResponse> {
    const { data } = await client.post<LoginResponse>('/api/auth/login', {
        email: email.trim(),
        password,
    })
    return data
}

export async function signupRequest(payload: {
    email: string
    password: string
    name?: string
}): Promise<AuthUser> {
    const { data } = await client.post<AuthUser>('/api/auth/signup', {
        email: payload.email.trim(),
        password: payload.password,
        name: payload.name?.trim() || undefined,
    })
    return data
}

export function axiosApiMessage(error: unknown, fallback: string): string {
    if (!axios.isAxiosError(error)) return fallback
    const raw = error.response?.data
    if (raw && typeof raw === 'object' && 'detail' in raw) {
        const detail = (raw as { detail: unknown }).detail
        if (typeof detail === 'string') return detail
        if (Array.isArray(detail)) {
            const msgs = detail
                .map((x) =>
                    x &&
                    typeof x === 'object' &&
                    'msg' in x &&
                    typeof (x as { msg: unknown }).msg === 'string'
                        ? (x as { msg: string }).msg
                        : '',
                )
                .filter(Boolean)
            if (msgs.length > 0) return msgs.join(' ')
        }
    }
    const status = error.response?.status
    if (status === 401)
        return '이메일 또는 비밀번호를 확인해 주세요.'
    if (status === 409) return '이미 가입된 이메일입니다.'
    return fallback
}
