import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { User as UserIcon, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'
import { useAuth } from 'src/features/auth/AuthContext'
import { checkEmailAvailability } from 'src/globals/api/authApi'
import { getOAuthAuthorizationUrl } from 'src/globals/api/oauth'
import { EcoButton } from 'src/shared/ui/eco'
import { MascotImage } from 'src/shared/components/mascort'

function getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const serverMsg = (error.response?.data as { message?: string })
            ?.message
        return serverMsg || error.message || '서버와 통신할 수 없습니다.'
    }
    if (error instanceof Error) {
        return error.message || '요청 처리 중 오류가 발생했습니다.'
    }
    return '요청 처리 중 오류가 발생했습니다.'
}

export const Login = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { login } = useAuth()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (searchParams.get('error') === 'oauth') {
            toast.error('소셜 로그인에 실패했습니다. 다시 시도해 주세요.')
        }
    }, [searchParams])

    const startOAuth = (provider: 'google') => {
        try {
            window.location.href = getOAuthAuthorizationUrl(provider)
        } catch {
            toast.error('API 서버 주소(VITE_API_HOST)가 설정되지 않았습니다.')
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!userName.trim() || !password) {
            toast.error('아이디와 비밀번호를 입력해 주세요.')
            return
        }

        setLoading(true)
        try {
            await login({ userName: userName.trim(), password })
            toast.success('로그인되었습니다.')
            navigate('/')
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center p-5 font-sans">
            <div className="flex w-full max-w-[390px] flex-col gap-8">
                <header className="mt-8 flex flex-col items-center gap-2">
                    <MascotImage emotion="smile" size="lg" decorative />
                    <h1 className="text-primary text-3xl font-bold">
                        EcoReport
                    </h1>
                    <p className="text-on-surface-variant text-sm">
                        에너지 절약의 시작, 에코리포트
                    </p>
                </header>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            아이디
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            autoComplete="username"
                            className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            autoComplete="current-password"
                            className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="border-outline-variant text-primary-container focus:ring-primary-container rounded"
                            />
                            <span className="text-on-surface-variant">
                                로그인 유지
                            </span>
                        </label>
                        <a
                            href="#"
                            className="text-on-surface-variant hover:text-primary"
                        >
                            비밀번호 찾기
                        </a>
                    </div>
                    <EcoButton
                        className="mt-2 py-4 text-base font-bold"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </EcoButton>
                </form>

                <p className="text-center text-xs font-medium">
                    <span className="text-on-surface-variant">
                        계정이 없으신가요?
                    </span>
                    <Link
                        to="/signup"
                        className="text-primary ml-1 font-bold hover:underline"
                    >
                        회원가입
                    </Link>
                </p>

                <div className="flex items-center gap-3">
                    <div className="bg-surface-container-high h-px flex-1"></div>
                    <span className="text-on-surface-variant text-[10px] font-bold">
                        또는 간편하게 로그인
                    </span>
                    <div className="bg-surface-container-high h-px flex-1"></div>
                </div>

                <div className="flex flex-col gap-2">
                    <EcoButton
                        type="button"
                        variant="outline"
                        className="py-3"
                        onClick={() => startOAuth('google')}
                    >
                        <UserIcon className="h-5 w-5" /> Google로 시작하기
                    </EcoButton>
                </div>
            </div>
        </div>
    )
}

export const Signup = () => {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [emailChecked, setEmailChecked] = useState(false)
    const [emailAvailable, setEmailAvailable] = useState(false)
    const [checkingEmail, setCheckingEmail] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleEmailChange = (value: string) => {
        setEmail(value)
        setEmailChecked(false)
        setEmailAvailable(false)
    }

    const handleCheckEmail = async () => {
        const trimmed = email.trim()
        if (!trimmed) {
            toast.error('이메일을 입력해 주세요.')
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            toast.error('올바른 이메일 형식을 입력해 주세요.')
            return
        }

        setCheckingEmail(true)
        try {
            const result = await checkEmailAvailability(trimmed)
            setEmailChecked(true)
            setEmailAvailable(result.available)
            if (result.available) {
                toast.success('사용 가능한 이메일입니다.')
            } else {
                toast.error('이미 사용 중인 이메일입니다.')
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setCheckingEmail(false)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!userName.trim() || !email.trim() || !password) {
            toast.error('필수 정보를 모두 입력해 주세요.')
            return
        }
        if (!emailChecked || !emailAvailable) {
            toast.error('이메일 중복 확인을 완료해 주세요.')
            return
        }
        if (password.length < 8) {
            toast.error('비밀번호는 8자 이상이어야 합니다.')
            return
        }
        if (password !== passwordConfirm) {
            toast.error('비밀번호가 일치하지 않습니다.')
            return
        }

        setLoading(true)
        try {
            await register({
                userName: userName.trim(),
                email: email.trim(),
                password,
            })
            toast.success('회원가입이 완료되었습니다.')
            navigate('/login')
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                <Link to="/login" className="text-on-surface-variant -ml-2 p-2">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-primary text-lg font-bold">회원가입</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex flex-grow flex-col gap-8 p-5">
                <div className="flex justify-center">
                    <MascotImage emotion="smile" size="md" decorative />
                </div>
                <div>
                    <h2 className="text-on-surface mb-1 text-xl font-bold">
                        기본 정보 입력
                    </h2>
                    <p className="text-on-surface-variant text-sm">
                        에코리포트 서비스 이용을 위해 정보를 입력해 주세요.
                    </p>
                </div>

                <form
                    id="signup-form"
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            아이디
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="로그인에 사용할 아이디"
                            autoComplete="username"
                            className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            이메일
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    handleEmailChange(e.target.value)
                                }
                                placeholder="example@email.com"
                                autoComplete="email"
                                className="border-outline-variant bg-surface focus:ring-primary-container flex-1 rounded-lg border p-3.5 outline-none focus:ring-2"
                            />
                            <EcoButton
                                variant="outline"
                                className="px-4 whitespace-nowrap"
                                type="button"
                                disabled={checkingEmail}
                                onClick={handleCheckEmail}
                            >
                                {checkingEmail ? '확인 중...' : '중복확인'}
                            </EcoButton>
                        </div>
                        {emailChecked && (
                            <p
                                className={`text-xs font-medium ${
                                    emailAvailable
                                        ? 'text-primary'
                                        : 'text-error'
                                }`}
                            >
                                {emailAvailable
                                    ? '사용 가능한 이메일입니다.'
                                    : '이미 사용 중인 이메일입니다.'}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력해주세요"
                            autoComplete="new-password"
                            className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            비밀번호 확인
                        </label>
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="비밀번호를 다시 입력해주세요"
                            autoComplete="new-password"
                            className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                        />
                    </div>

                    <div className="border-surface-container-high mt-2 flex flex-col gap-3 border-t pt-4">
                        <label className="flex cursor-pointer items-center gap-3 font-bold">
                            <input
                                type="checkbox"
                                className="border-outline-variant text-primary focus:ring-primary h-5 w-5 rounded"
                            />
                            <span>전체 약관 동의</span>
                        </label>
                        {[
                            '[필수] 서비스 이용약관 동의',
                            '[필수] 개인정보 수집 및 이용 동의',
                            '[선택] 마케팅 정보 수신 동의',
                        ].map((txt, i) => (
                            <label
                                key={i}
                                className="text-on-surface-variant flex cursor-pointer items-center gap-3 text-sm font-medium"
                            >
                                <input
                                    type="checkbox"
                                    className="border-outline-variant text-primary focus:ring-primary h-5 w-5 rounded"
                                />
                                <span>{txt}</span>
                            </label>
                        ))}
                    </div>
                </form>
            </main>

            <div className="border-outline-variant bg-surface sticky bottom-0 border-t p-5">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    type="submit"
                    form="signup-form"
                    disabled={loading || !emailChecked || !emailAvailable}
                >
                    {loading ? '가입 중...' : '가입하기'}
                </EcoButton>
            </div>
        </div>
    )
}
