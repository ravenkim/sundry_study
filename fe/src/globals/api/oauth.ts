export type OAuthProvider = 'kakao' | 'google'

export function getOAuthAuthorizationUrl(provider: OAuthProvider): string {
    const base = (import.meta.env.VITE_API_HOST ?? '').replace(/\/$/, '')
    if (!base) {
        throw new Error('VITE_API_HOST가 설정되지 않았습니다.')
    }
    return `${base}/oauth2/authorization/${provider}`
}
