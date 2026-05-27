import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from 'src/features/auth/AuthContext'
import {
    checkEmailAvailability,
    checkNicknameAvailability,
    checkPhoneAvailability,
    checkUserNameAvailability,
} from 'src/globals/api/authApi'
import { EcoButton } from 'src/shared/ui/eco'
import { MascotImage } from 'src/shared/components/mascort'
import { SSwaveText } from 'src/shared/components/motion'
import { GoogleSignInButton } from 'src/features/auth/GoogleSignInButton'
import { SSfadeIn } from 'src/shared/components/motion'
import { getOAuthAuthorizationUrl } from 'src/globals/api/oauth'
import { SignupTermsAgreement } from 'src/features/auth/SignupTermsAgreement'
import {
    getPendingAffiliation,
    clearPendingAffiliation,
} from 'src/features/auth/signupBuildingStorage'
import { getAppHomePath, getStoredUser } from 'src/features/auth/authStorage'
import { getErrorMessage } from 'src/shared/lib/i18n/getErrorMessage'
import { isValidNicknameFormat } from 'src/shared/lib/nicknameUtils'

function isValidPhoneFormat(phone: string): boolean {
    const digits = phone.replace(/[^0-9]/g, '')
    return /^01[016789]\d{7,8}$/.test(digits)
}

export const Login = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { login } = useAuth()
    const { t } = useTranslation('auth')
    const { t: tNav } = useTranslation('nav')
    const { t: tErrors } = useTranslation('errors')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (searchParams.get('error') === 'oauth') {
            toast.error(t('login.oauthFailedRetry'))
        }
    }, [searchParams, t])

    const startOAuth = () => {
        try {
            window.location.href = getOAuthAuthorizationUrl('google')
        } catch {
            toast.error(tErrors('apiHostNotConfigured'))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!userName.trim() || !password) {
            toast.error(t('login.credentialsRequired'))
            return
        }

        setLoading(true)
        try {
            await login({ userName: userName.trim(), password })
            toast.success(t('login.success'))
            navigate(getAppHomePath(getStoredUser()))
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center p-5 font-sans">
            <SSfadeIn className="flex w-full max-w-[390px] flex-col gap-8">
                <header className="mt-8 flex flex-col items-center gap-2">
                    <MascotImage emotion="smile" size="lg" decorative />
                    <h1 className="text-primary text-3xl font-bold">
                        {t('login.title')}
                    </h1>
                    <p className="text-on-surface-variant text-sm">
                        {t('brand.tagline')}
                    </p>
                </header>

                <div className="flex flex-col gap-5">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-on-surface text-sm font-semibold">
                                {t('login.usernameLabel')}
                            </label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder={t('login.usernamePlaceholder')}
                                autoComplete="username"
                                className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-on-surface text-sm font-semibold">
                                {t('login.passwordLabel')}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('login.passwordPlaceholder')}
                                autoComplete="current-password"
                                className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                            />
                        </div>
                        <EcoButton
                            className="mt-2 py-4 text-base font-bold"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <SSwaveText
                                    text={t('login.submitting')}
                                    className="font-bold"
                                />
                            ) : (
                                t('login.submit')
                            )}
                        </EcoButton>
                    </form>

                    <div className="border-outline-variant/60 bg-surface-container-low flex flex-col items-center gap-2.5 rounded-xl border px-4 py-3.5">
                        <p className="text-sm">
                            <Link
                                to="/signup/affiliation?intent=signup"
                                className="text-primary font-semibold hover:underline"
                            >
                                {t('signup.link')}
                            </Link>
                        </p>
                        <div className="bg-outline-variant/30 h-px w-full max-w-[200px]" />
                        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
                            <Link
                                to="/find-account"
                                className="text-on-surface-variant hover:text-primary transition-colors hover:underline"
                            >
                                {tNav('findAccount')}
                            </Link>
                            <span
                                className="text-outline-variant"
                                aria-hidden
                            >
                                |
                            </span>
                            <Link
                                to="/signup/admin"
                                className="text-on-surface-variant hover:text-primary transition-colors hover:underline"
                            >
                                {tNav('adminSignup')}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-surface-container-high h-px flex-1"></div>
                    <span className="text-on-surface-variant text-[10px] font-bold">
                        {t('login.oauthDivider')}
                    </span>
                    <div className="bg-surface-container-high h-px flex-1"></div>
                </div>

                <GoogleSignInButton onClick={startOAuth} />
            </SSfadeIn>
        </div>
    )
}

export const Signup = () => {
    const navigate = useNavigate()
    const { register } = useAuth()
    const { t } = useTranslation('auth')
    const { t: tCommon } = useTranslation('common')
    const { t: tErrors } = useTranslation('errors')
    const pendingAffiliation = getPendingAffiliation()
    const [userName, setUserName] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [userNameChecked, setUserNameChecked] = useState(false)
    const [userNameAvailable, setUserNameAvailable] = useState(false)
    const [checkingUserName, setCheckingUserName] = useState(false)
    const [nicknameChecked, setNicknameChecked] = useState(false)
    const [nicknameAvailable, setNicknameAvailable] = useState(false)
    const [checkingNickname, setCheckingNickname] = useState(false)
    const [emailChecked, setEmailChecked] = useState(false)
    const [emailAvailable, setEmailAvailable] = useState(false)
    const [checkingEmail, setCheckingEmail] = useState(false)
    const [phoneChecked, setPhoneChecked] = useState(false)
    const [phoneAvailable, setPhoneAvailable] = useState(false)
    const [checkingPhone, setCheckingPhone] = useState(false)
    const [loading, setLoading] = useState(false)
    const [requiredTermsAgreed, setRequiredTermsAgreed] = useState(false)

    useEffect(() => {
        if (!pendingAffiliation) {
            navigate('/signup/affiliation?intent=signup', { replace: true })
        }
    }, [pendingAffiliation, navigate])

    const handleUserNameChange = (value: string) => {
        setUserName(value)
        setUserNameChecked(false)
        setUserNameAvailable(false)
    }

    const handleCheckUserName = async () => {
        const trimmed = userName.trim()
        if (!trimmed) {
            toast.error(tErrors('usernameRequired'))
            return
        }

        setCheckingUserName(true)
        try {
            const result = await checkUserNameAvailability(trimmed)
            setUserNameChecked(true)
            setUserNameAvailable(result.available)
            if (result.available) {
                toast.success(t('signup.usernameAvailable'))
            } else {
                toast.error(t('signup.usernameTaken'))
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setCheckingUserName(false)
        }
    }

    const handleNicknameChange = (value: string) => {
        setNickname(value)
        setNicknameChecked(false)
        setNicknameAvailable(false)
    }

    const handleCheckNickname = async () => {
        const trimmed = nickname.trim()
        if (!trimmed) {
            toast.error(tErrors('nicknameRequired'))
            return
        }
        if (!isValidNicknameFormat(trimmed)) {
            toast.error(tErrors('nicknameInvalidFormat'))
            return
        }

        setCheckingNickname(true)
        try {
            const result = await checkNicknameAvailability(trimmed)
            setNicknameChecked(true)
            setNicknameAvailable(result.available)
            if (result.available) {
                toast.success(t('signup.nicknameAvailable'))
            } else {
                toast.error(t('signup.nicknameTaken'))
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setCheckingNickname(false)
        }
    }

    const handleEmailChange = (value: string) => {
        setEmail(value)
        setEmailChecked(false)
        setEmailAvailable(false)
    }

    const handleCheckEmail = async () => {
        const trimmed = email.trim()
        if (!trimmed) {
            toast.error(tErrors('emailRequired'))
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            toast.error(tErrors('emailInvalidFormat'))
            return
        }

        setCheckingEmail(true)
        try {
            const result = await checkEmailAvailability(trimmed)
            setEmailChecked(true)
            setEmailAvailable(result.available)
            if (result.available) {
                toast.success(t('signup.emailAvailable'))
            } else {
                toast.error(t('signup.emailTaken'))
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setCheckingEmail(false)
        }
    }

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value)
        setPhoneChecked(false)
        setPhoneAvailable(false)
    }

    const handleCheckPhone = async () => {
        const trimmed = phoneNumber.trim()
        if (!trimmed) {
            toast.error(tErrors('phoneRequired'))
            return
        }
        if (!isValidPhoneFormat(trimmed)) {
            toast.error(tErrors('phoneInvalidFormat'))
            return
        }

        setCheckingPhone(true)
        try {
            const result = await checkPhoneAvailability(trimmed)
            setPhoneChecked(true)
            setPhoneAvailable(result.available)
            if (result.available) {
                toast.success(t('signup.phoneAvailable'))
            } else {
                toast.error(t('signup.phoneTaken'))
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setCheckingPhone(false)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!userName.trim() || !nickname.trim() || !email.trim() || !phoneNumber.trim() || !password) {
            toast.error(tErrors('requiredFieldsMissing'))
            return
        }
        if (!userNameChecked || !userNameAvailable) {
            toast.error(tErrors('usernameCheckRequired'))
            return
        }
        if (!nicknameChecked || !nicknameAvailable) {
            toast.error(tErrors('nicknameCheckRequired'))
            return
        }
        if (!isValidNicknameFormat(nickname.trim())) {
            toast.error(tErrors('nicknameInvalidFormat'))
            return
        }
        if (!emailChecked || !emailAvailable) {
            toast.error(tErrors('emailCheckRequired'))
            return
        }
        if (!phoneChecked || !phoneAvailable) {
            toast.error(tErrors('phoneCheckRequired'))
            return
        }
        if (password.length < 8) {
            toast.error(tErrors('passwordMinLength'))
            return
        }
        if (password !== passwordConfirm) {
            toast.error(tErrors('passwordMismatch'))
            return
        }
        if (!requiredTermsAgreed) {
            toast.error(tErrors('requiredTermsNotAgreed'))
            return
        }
        if (!pendingAffiliation) {
            toast.error(tErrors('affiliationRequired'))
            navigate('/signup/affiliation?intent=signup')
            return
        }

        setLoading(true)
        try {
            const trimmedUserName = userName.trim()
            const trimmedNickname = nickname.trim()
            const affiliationName = pendingAffiliation.affiliationName

            await register({
                userName: trimmedUserName,
                nickname: trimmedNickname,
                email: email.trim(),
                phoneNumber: phoneNumber.trim(),
                password,
                affiliation: pendingAffiliation.affiliationId,
            })
            clearPendingAffiliation()
            navigate('/signup/complete', {
                replace: true,
                state: {
                    userName: trimmedUserName,
                    nickname: trimmedNickname,
                    affiliationName,
                },
            })
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                <Link
                    to="/signup/affiliation?intent=signup"
                    className="text-on-surface-variant -ml-2 p-2"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-primary text-lg font-bold">
                    {t('signup.title')}
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="flex flex-grow flex-col gap-8 p-5">
                <div className="flex justify-center">
                    <MascotImage emotion="smile" size="md" decorative />
                </div>
                <div>
                    <h2 className="text-on-surface mb-1 text-xl font-bold">
                        {t('signup.basicInfoTitle')}
                    </h2>
                    <p className="text-on-surface-variant text-sm">
                        {t('signup.basicInfoDescription')}
                    </p>
                    {pendingAffiliation?.affiliationName && (
                        <p className="text-primary mt-2 text-sm font-semibold">
                            {t('signup.affiliationPrefix')}{' '}
                            {pendingAffiliation.affiliationName}
                        </p>
                    )}
                </div>

                <form
                    id="signup-form"
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            {t('signup.usernameLabel')}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) =>
                                    handleUserNameChange(e.target.value)
                                }
                                placeholder={t('signup.usernamePlaceholder')}
                                autoComplete="username"
                                className="border-outline-variant bg-surface focus:ring-primary-container flex-1 rounded-lg border p-3.5 outline-none focus:ring-2"
                            />
                            <EcoButton
                                variant="outline"
                                className="px-4 whitespace-nowrap"
                                type="button"
                                disabled={checkingUserName}
                                onClick={handleCheckUserName}
                            >
                                {checkingUserName
                                    ? tCommon('checking')
                                    : tCommon('duplicateCheck')}
                            </EcoButton>
                        </div>
                        {userNameChecked && (
                            <p
                                className={`text-xs font-medium ${
                                    userNameAvailable
                                        ? 'text-primary'
                                        : 'text-error'
                                }`}
                            >
                                {userNameAvailable
                                    ? t('signup.usernameAvailable')
                                    : t('signup.usernameTaken')}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            {t('signup.nicknameLabel')}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) =>
                                    handleNicknameChange(e.target.value)
                                }
                                placeholder={t('signup.nicknamePlaceholder')}
                                autoComplete="nickname"
                                className="border-outline-variant bg-surface focus:ring-primary-container flex-1 rounded-lg border p-3.5 outline-none focus:ring-2"
                            />
                            <EcoButton
                                variant="outline"
                                className="px-4 whitespace-nowrap"
                                type="button"
                                disabled={checkingNickname}
                                onClick={handleCheckNickname}
                            >
                                {checkingNickname
                                    ? tCommon('checking')
                                    : tCommon('duplicateCheck')}
                            </EcoButton>
                        </div>
                        {nicknameChecked && (
                            <p
                                className={`text-xs font-medium ${
                                    nicknameAvailable
                                        ? 'text-primary'
                                        : 'text-error'
                                }`}
                            >
                                {nicknameAvailable
                                    ? t('signup.nicknameAvailable')
                                    : t('signup.nicknameTaken')}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            {t('signup.emailLabel')}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    handleEmailChange(e.target.value)
                                }
                                placeholder={t('signup.emailPlaceholder')}
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
                                {checkingEmail
                                    ? tCommon('checking')
                                    : tCommon('duplicateCheck')}
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
                                    ? t('signup.emailAvailable')
                                    : t('signup.emailTaken')}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            {t('signup.phoneLabel')}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) =>
                                    handlePhoneChange(e.target.value)
                                }
                                placeholder={t('signup.phonePlaceholder')}
                                autoComplete="tel"
                                className="border-outline-variant bg-surface focus:ring-primary-container flex-1 rounded-lg border p-3.5 outline-none focus:ring-2"
                            />
                            <EcoButton
                                variant="outline"
                                className="px-4 whitespace-nowrap"
                                type="button"
                                disabled={checkingPhone}
                                onClick={handleCheckPhone}
                            >
                                {checkingPhone
                                    ? tCommon('checking')
                                    : tCommon('duplicateCheck')}
                            </EcoButton>
                        </div>
                        {phoneChecked && (
                            <p
                                className={`text-xs font-medium ${
                                    phoneAvailable
                                        ? 'text-primary'
                                        : 'text-error'
                                }`}
                            >
                                {phoneAvailable
                                    ? t('signup.phoneAvailable')
                                    : t('signup.phoneTaken')}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            {t('signup.passwordLabel')}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('signup.passwordPlaceholder')}
                            autoComplete="new-password"
                            className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-on-surface text-sm font-semibold">
                            {t('signup.passwordConfirmLabel')}
                        </label>
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder={t('signup.passwordConfirmPlaceholder')}
                            autoComplete="new-password"
                            className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                        />
                    </div>

                    <SignupTermsAgreement
                        onRequiredChange={setRequiredTermsAgreed}
                    />
                </form>
            </main>

            <div className="border-outline-variant bg-surface sticky bottom-0 border-t p-5">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    type="submit"
                    form="signup-form"
                    disabled={
                        loading ||
                        !userNameChecked ||
                        !userNameAvailable ||
                        !emailChecked ||
                        !emailAvailable ||
                        !phoneChecked ||
                        !phoneAvailable ||
                        !requiredTermsAgreed
                    }
                >
                    {loading ? (
                        <SSwaveText
                            text={t('signup.submitting')}
                            className="font-bold"
                        />
                    ) : (
                        t('signup.submit')
                    )}
                </EcoButton>
            </div>
        </div>
    )
}
