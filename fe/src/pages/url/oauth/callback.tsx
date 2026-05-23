import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import { useAuth } from 'src/features/auth/AuthContext'
import { applyPendingAffiliationIfNeeded, getPendingAffiliation } from 'src/features/auth/signupBuildingStorage'
import { getAppHomePath, setAccessToken, getStoredUser } from 'src/features/auth/authStorage'

export default function OAuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { completeOAuthLogin } = useAuth()

    useEffect(() => {
        const token = searchParams.get('token')
        const userName = searchParams.get('userName')
        const email = searchParams.get('email') ?? undefined

        if (!token || !userName) {
            toast.error('소셜 로그인에 실패했습니다.')
            navigate('/login', { replace: true })
            return
        }

        setAccessToken(token)

        const pending = getPendingAffiliation()

        void (async () => {
            try {
                await applyPendingAffiliationIfNeeded()
                completeOAuthLogin(
                    token,
                    userName,
                    email,
                    pending?.buildingId,
                    pending?.buildingName,
                )
                toast.success('로그인되었습니다.')
                navigate(getAppHomePath(getStoredUser()), { replace: true })
            } catch {
                toast.error('소속 설정에 실패했습니다. 다시 시도해 주세요.')
                navigate('/signup/affiliation?intent=oauth', { replace: true })
            }
        })()
    }, [searchParams, completeOAuthLogin, navigate])

    return (
        <div className="bg-background text-on-surface-variant flex min-h-screen items-center justify-center text-sm">
            로그인 처리 중...
        </div>
    )
}
