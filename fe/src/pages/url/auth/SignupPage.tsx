import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Mail, Lock, UserPlus, Home, User } from 'lucide-react'
import { useState } from 'react'

const SignupPage = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement signup logic
        console.log('Signup attempt:', { name, email, password, passwordConfirm })
    }

    return (
        <div className="font-serif relative flex min-h-screen flex-col items-center justify-center p-4">
            {/* Background with Sepia Overlay */}
            <div className="sepia-overlay absolute inset-0 z-0 opacity-50" />

            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute left-6 top-6 z-50 group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary md:left-8 md:top-8"
            >
                <Home className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                <span className="font-sans text-sm tracking-wider uppercase">홈으로</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="border-border bg-card/90 relative rounded-2xl border p-8 shadow-2xl backdrop-blur-lg">
                    <div className="mb-8 text-center">
                        <h1 className="text-primary font-display mb-3 text-3xl font-semibold">
                            회원가입
                        </h1>
                        <p className="text-card-foreground text-sm font-light">
                            새로운 손님, 진심으로 환영합니다.
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="text-muted-foreground absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="이름을 입력해주세요"
                                    className="border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary font-sans w-full rounded-xl border-2 py-3 pl-12 pr-4 transition-all focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Mail className="text-muted-foreground absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="이메일을 입력해주세요"
                                    className="border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary font-sans w-full rounded-xl border-2 py-3 pl-12 pr-4 transition-all focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="text-muted-foreground absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호를 입력해주세요"
                                    className="border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary font-sans w-full rounded-xl border-2 py-3 pl-12 pr-4 transition-all focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="text-muted-foreground absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    placeholder="비밀번호를 다시 입력해주세요"
                                    className="border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary font-sans w-full rounded-xl border-2 py-3 pl-12 pr-4 transition-all focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-primary text-primary-foreground group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-sans font-semibold shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
                        >
                            <span>가입하기</span>
                            <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
                        </button>
                    </form>

                    <div className="mt-8 text-center font-sans text-sm">
                        <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
                        <Link
                            to="/auth/login"
                            className="text-primary font-semibold hover:underline"
                        >
                            로그인하기
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default SignupPage
