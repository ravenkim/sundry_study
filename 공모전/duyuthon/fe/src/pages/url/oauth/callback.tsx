import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuth } from 'src/features/auth/AuthContext'
import { getMyProfile } from 'src/globals/api/memberProfileApi'
import { getAppHomePath, getStoredUser } from 'src/features/auth/authStorage'

export default function OAuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { completeOAuthLogin, refreshUser, markProfileReady } = useAuth()
    const { t: tAuth } = useTranslation('auth')
    const { t: tErrors } = useTranslation('errors')
    const processedRef = useRef(false)

    const token = searchParams.get('token')
    const userName = searchParams.get('userName')
    const email = searchParams.get('email') ?? undefined

    useEffect(() => {
        if (processedRef.current) return
        processedRef.current = true

        if (!token || !userName) {
            toast.error(tErrors('oauthFailed'))
            navigate('/login', { replace: true })
            return
        }

        void (async () => {
            try {
                completeOAuthLogin(token, userName, email)
                const profile = await getMyProfile()

                if (!profile.affiliationId) {
                    markProfileReady()
                    toast.success(tAuth('login.success'))
                    navigate('/signup/affiliation?intent=oauth-complete', {
                        replace: true,
                    })
                    return
                }

                refreshUser({
                    nickname: profile.nickname,
                    affiliationId: profile.affiliationId,
                    affiliationName: profile.affiliationName,
                    userType: profile.userType,
                    buildingId: profile.buildingId,
                    buildingName: profile.buildingName,
                })
                toast.success(tAuth('login.success'))
                navigate(getAppHomePath(getStoredUser()), { replace: true })
            } catch {
                toast.error(tErrors('oauthLoginProcessFailed'))
                navigate('/login', { replace: true })
            }
        })()
    }, [
        token,
        userName,
        email,
        completeOAuthLogin,
        refreshUser,
        markProfileReady,
        navigate,
        tAuth,
        tErrors,
    ])

    return (
        <div className="bg-background text-on-surface-variant flex min-h-screen items-center justify-center text-sm">
            {tAuth('oauth.processing')}
        </div>
    )
}
