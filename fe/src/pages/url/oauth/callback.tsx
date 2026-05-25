import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import { useAuth } from 'src/features/auth/AuthContext'
import { getMyProfile } from 'src/globals/api/memberProfileApi'
import { getAppHomePath, getStoredUser } from 'src/features/auth/authStorage'

export default function OAuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { completeOAuthLogin, refreshUser, markProfileReady } = useAuth()
    const processedRef = useRef(false)

    const token = searchParams.get('token')
    const userName = searchParams.get('userName')
    const email = searchParams.get('email') ?? undefined

    useEffect(() => {
        if (processedRef.current) return
        processedRef.current = true

        if (!token || !userName) {
            toast.error('소셜 로그인에 실패했습니다.')
            navigate('/login', { replace: true })
            return
        }

        void (async () => {
            try {
                completeOAuthLogin(token, userName, email)
                const profile = await getMyProfile()

                if (!profile.affiliationId) {
                    markProfileReady()
                    toast.success('로그인되었습니다.')
                    navigate('/signup/affiliation?intent=oauth-complete', {
                        replace: true,
                    })
                    return
                }

                refreshUser({
                    affiliationId: profile.affiliationId,
                    affiliationName: profile.affiliationName,
                    userType: profile.userType,
                    buildingId: profile.buildingId,
                    buildingName: profile.buildingName,
                })
                toast.success('로그인되었습니다.')
                navigate(getAppHomePath(getStoredUser()), { replace: true })
            } catch {
                toast.error('로그인 처리에 실패했습니다. 다시 시도해 주세요.')
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
    ])

    return (
        <div className="bg-background text-on-surface-variant flex min-h-screen items-center justify-center text-sm">
            로그인 처리 중...
        </div>
    )
}
