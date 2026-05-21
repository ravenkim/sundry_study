import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Leaf, MessageCircle, User as UserIcon, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'
import { useAuth } from 'src/features/auth/AuthContext'
import { EcoButton } from 'src/shared/ui/eco'

function getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const serverMsg = (error.response?.data as { message?: string })?.message
        return serverMsg || error.message || '서버와 통신할 수 없습니다.'
    }
    if (error instanceof Error) {
        return error.message || '요청 처리 중 오류가 발생했습니다.'
    }
    return '요청 처리 중 오류가 발생했습니다.'
}

export const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

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
        <div className="min-h-screen flex flex-col items-center justify-center p-5 font-sans bg-background">
            <div className="w-full max-w-[390px] flex flex-col gap-8">
                <header className="flex flex-col items-center gap-2 mt-8">
                    <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center shadow-sm">
                        <Leaf className="w-8 h-8 text-on-primary-container fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold text-primary">EcoReport</h1>
                    <p className="text-on-surface-variant text-sm">에너지 절약의 시작, 에코리포트</p>
                </header>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-on-surface">아이디</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            autoComplete="username"
                            className="p-3.5 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary-container outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-on-surface">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            autoComplete="current-password"
                            className="p-3.5 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary-container outline-none"
                        />
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded border-outline-variant text-primary-container focus:ring-primary-container"
                            />
                            <span className="text-on-surface-variant">로그인 유지</span>
                        </label>
                        <a href="#" className="text-on-surface-variant hover:text-primary">
                            비밀번호 찾기
                        </a>
                    </div>
                    <EcoButton
                        className="py-4 text-base font-bold mt-2"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </EcoButton>
                </form>

                <p className="text-center text-xs font-medium">
                    <span className="text-on-surface-variant">계정이 없으신가요?</span>
                    <Link to="/signup" className="ml-1 text-primary font-bold hover:underline">
                        회원가입
                    </Link>
                </p>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-surface-container-high"></div>
                    <span className="text-[10px] text-on-surface-variant font-bold">또는 간편하게 로그인</span>
                    <div className="flex-1 h-px bg-surface-container-high"></div>
                </div>

                <div className="flex flex-col gap-2">
                    <EcoButton
                        variant="outline"
                        className="py-3 bg-[#FEE500] border-none text-[#3C1E1E]"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" /> 카카오로 시작하기
                    </EcoButton>
                    <EcoButton variant="outline" className="py-3">
                        <UserIcon className="w-5 h-5" /> Google로 시작하기
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
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!userName.trim() || !email.trim() || !password) {
            toast.error('필수 정보를 모두 입력해 주세요.')
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
        <div className="min-h-screen flex flex-col bg-background md:max-w-[390px] md:mx-auto">
            <header className="px-5 h-14 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface z-10">
                <Link to="/login" className="p-2 -ml-2 text-on-surface-variant">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="font-bold text-lg text-primary">회원가입</h1>
                <div className="w-10"></div>
            </header>

            <main className="p-5 flex flex-col gap-8 flex-grow">
                <div>
                    <h2 className="text-xl font-bold text-on-surface mb-1">기본 정보 입력</h2>
                    <p className="text-on-surface-variant text-sm">
                        에코리포트 서비스 이용을 위해 정보를 입력해 주세요.
                    </p>
                </div>

                <form id="signup-form" className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-on-surface">이름</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="홍길동"
                            autoComplete="name"
                            className="p-3.5 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary-container outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-on-surface">이메일</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                autoComplete="email"
                                className="flex-1 p-3.5 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary-container outline-none"
                            />
                            <EcoButton variant="outline" className="whitespace-nowrap px-4" type="button">
                                인증하기
                            </EcoButton>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-on-surface">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력해주세요"
                            autoComplete="new-password"
                            className="p-3.5 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary-container outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-on-surface">비밀번호 확인</label>
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="비밀번호를 다시 입력해주세요"
                            autoComplete="new-password"
                            className="p-3.5 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary-container outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-surface-container-high mt-2">
                        <label className="flex items-center gap-3 cursor-pointer font-bold">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
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
                                className="flex items-center gap-3 cursor-pointer text-sm text-on-surface-variant font-medium"
                            >
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                                />
                                <span>{txt}</span>
                            </label>
                        ))}
                    </div>
                </form>
            </main>

            <div className="p-5 border-t border-outline-variant bg-surface sticky bottom-0">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    type="submit"
                    form="signup-form"
                    disabled={loading}
                >
                    {loading ? '가입 중...' : '가입하기'}
                </EcoButton>
            </div>
        </div>
    )
}
