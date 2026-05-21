export type OAuthProvider = 'kakao' | 'google'

export function getOAuthAuthorizationUrl(provider: OAuthProvider): string {
    const base = (import.meta.env.VITE_API_HOST ?? '').replace(/\/$/, '')
    return base
        ? `${base}/oauth2/authorization/${provider}`
        : `/oauth2/authorization/${provider}`
}
