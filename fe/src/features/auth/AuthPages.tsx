import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CheckCircle2, Mail, Phone } from 'lucide-react'
import { toast } from 'react-toastify'
import { getAffiliations } from 'src/globals/api/affiliationsApi'
import { assignAffiliation } from 'src/globals/api/memberProfileApi'
import { checkNicknameAvailability } from 'src/globals/api/authApi'
import type { Affiliation } from 'src/globals/api/types'
import { useAuth } from 'src/features/auth/AuthContext'
import { getAppHomePath, getStoredUser } from 'src/features/auth/authStorage'
import { setPendingAffiliation } from 'src/features/auth/signupBuildingStorage'
import { EcoButton } from 'src/shared/ui/eco'
import { MascotImage } from 'src/shared/components/mascort'
import { SearchableSelect } from 'src/shared/components/SearchableSelect'
import { getErrorMessage } from 'src/shared/lib/i18n/getErrorMessage'
import { isValidNicknameFormat } from 'src/shared/lib/nicknameUtils'

type SignupIntent = 'signup' | 'oauth-complete'

export function AffiliationSelection() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { refreshUser } = useAuth()
    const { t } = useTranslation('auth')
    const { t: tCommon } = useTranslation('common')
    const { t: tErrors } = useTranslation('errors')
    const intent = (searchParams.get('intent') as SignupIntent) || 'signup'
    const isOAuthComplete = intent === 'oauth-complete'

    const [affiliations, setAffiliations] = useState<Affiliation[]>([])
    const [affiliationId, setAffiliationId] = useState<number | ''>('')
    const [nickname, setNickname] = useState('')
    const [nicknameChecked, setNicknameChecked] = useState(false)
    const [nicknameAvailable, setNicknameAvailable] = useState(false)
    const [checkingNickname, setCheckingNickname] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        getAffiliations()
            .then((affiliationList) => {
                setAffiliations(affiliationList)
            })
            .catch(() => toast.error(tErrors('affiliationListLoadFailed')))
            .finally(() => setLoading(false))
    }, [tErrors])

    const selectedAffiliation = affiliations.find(
        (affiliation) => affiliation.affiliationId === affiliationId,
    )

    const affiliationOptions = useMemo(
        () =>
            affiliations.map((affiliation) => ({
                value: affiliation.affiliationId,
                label: affiliation.name,
            })),
        [affiliations],
    )

    const handleContinue = async (e: FormEvent) => {
        e.preventDefault()

        if (!affiliationId) {
            toast.error(tErrors('affiliationRequired'))
            return
        }

        if (isOAuthComplete) {
            const trimmedNickname = nickname.trim()
            if (!trimmedNickname) {
                toast.error(tErrors('nicknameRequired'))
                return
            }
            if (!isValidNicknameFormat(trimmedNickname)) {
                toast.error(tErrors('nicknameInvalidFormat'))
                return
            }
            if (!nicknameChecked || !nicknameAvailable) {
                toast.error(tErrors('nicknameCheckRequired'))
                return
            }

            setSubmitting(true)
            try {
                const profile = await assignAffiliation({
                    affiliationId: Number(affiliationId),
                    nickname: trimmedNickname,
                })
                refreshUser({
                    nickname: profile.nickname,
                    affiliationId: profile.affiliationId,
                    affiliationName: profile.affiliationName,
                    userType: profile.userType,
                    buildingId: profile.buildingId,
                    buildingName: profile.buildingName,
                })
                toast.success(t('affiliation.registerSuccess'))
                navigate(getAppHomePath(getStoredUser()), { replace: true })
            } catch (error) {
                toast.error(getErrorMessage(error))
            } finally {
                setSubmitting(false)
            }
            return
        }

        setPendingAffiliation(
            Number(affiliationId),
            selectedAffiliation?.name,
        )
        navigate('/signup')
    }

    const title = isOAuthComplete
        ? t('affiliation.titleOAuthComplete')
        : t('affiliation.titleSignup')
    const subtitle = isOAuthComplete
        ? t('affiliation.subtitleOAuthComplete')
        : t('affiliation.subtitleSignup')

    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                {!isOAuthComplete ? (
                    <Link to="/login" className="text-on-surface-variant -ml-2 p-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                ) : (
                    <div className="w-10" />
                )}
                <h1 className="text-primary text-lg font-bold">{title}</h1>
                <div className="w-10" />
            </header>

            <main className="flex flex-grow flex-col gap-8 p-5 pb-28">
                <div className="flex justify-center">
                    <MascotImage emotion="smile" size="md" decorative />
                </div>
                <div>
                    <h2 className="text-on-surface mb-1 text-xl font-bold">
                        {t('affiliation.sectionTitle')}
                    </h2>
                    <p className="text-on-surface-variant text-sm">{subtitle}</p>
                </div>

                {loading ? (
                    <p className="text-on-surface-variant text-sm">
                        {t('affiliation.loadingList')}
                    </p>
                ) : (
                    <form
                        id="affiliation-form"
                        className="flex flex-col gap-5"
                        onSubmit={handleContinue}
                    >
                        {affiliations.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    {t('affiliation.schoolLabel')}
                                </label>
                                <SearchableSelect
                                    options={affiliationOptions}
                                    value={affiliationId}
                                    onChange={setAffiliationId}
                                    placeholder={t('affiliation.schoolPlaceholder')}
                                    searchPlaceholder={t(
                                        'affiliation.schoolSearchPlaceholder',
                                    )}
                                />
                            </div>
                        ) : (
                            <p className="text-on-surface-variant text-sm">
                                {t('affiliation.emptyList')}
                            </p>
                        )}

                        {isOAuthComplete && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    {t('signup.nicknameLabel')}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => {
                                            setNickname(e.target.value)
                                            setNicknameChecked(false)
                                            setNicknameAvailable(false)
                                        }}
                                        placeholder={t(
                                            'signup.nicknamePlaceholder',
                                        )}
                                        autoComplete="nickname"
                                        className="border-outline-variant bg-surface focus:ring-primary-container flex-1 rounded-lg border p-3.5 outline-none focus:ring-2"
                                    />
                                    <EcoButton
                                        variant="outline"
                                        className="px-4 whitespace-nowrap"
                                        type="button"
                                        disabled={checkingNickname}
                                        onClick={async () => {
                                            const trimmed = nickname.trim()
                                            if (!trimmed) {
                                                toast.error(
                                                    tErrors('nicknameRequired'),
                                                )
                                                return
                                            }
                                            if (!isValidNicknameFormat(trimmed)) {
                                                toast.error(
                                                    tErrors(
                                                        'nicknameInvalidFormat',
                                                    ),
                                                )
                                                return
                                            }
                                            setCheckingNickname(true)
                                            try {
                                                const result =
                                                    await checkNicknameAvailability(
                                                        trimmed,
                                                    )
                                                setNicknameChecked(true)
                                                setNicknameAvailable(
                                                    result.available,
                                                )
                                                if (result.available) {
                                                    toast.success(
                                                        t(
                                                            'signup.nicknameAvailable',
                                                        ),
                                                    )
                                                } else {
                                                    toast.error(
                                                        t(
                                                            'signup.nicknameTaken',
                                                        ),
                                                    )
                                                }
                                            } catch (error) {
                                                toast.error(
                                                    getErrorMessage(error),
                                                )
                                            } finally {
                                                setCheckingNickname(false)
                                            }
                                        }}
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
                        )}
                    </form>
                )}
            </main>

            <div className="border-outline-variant bg-surface sticky bottom-0 border-t p-5">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    type="submit"
                    form="affiliation-form"
                    disabled={loading || submitting}
                >
                    {submitting
                        ? t('affiliation.submitSaving')
                        : isOAuthComplete
                          ? t('affiliation.submitOAuthComplete')
                          : t('affiliation.submitNext')}
                </EcoButton>
            </div>
        </div>
    )
}

/** @deprecated use AffiliationSelection */
export const SchoolSelection = AffiliationSelection

interface SignupCompleteState {
    userName?: string
    affiliationName?: string
}

export function SignupComplete() {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation('auth')
    const state = (location.state as SignupCompleteState | null) ?? {}

    const handleContinue = () => {
        navigate('/login', { replace: true })
    }

    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                <div className="w-10" />
                <h1 className="text-primary text-lg font-bold">
                    {t('signup.complete.headerTitle')}
                </h1>
                <div className="w-10" />
            </header>

            <main className="flex flex-grow flex-col items-center justify-center gap-8 p-5 pb-28 text-center">
                <div className="bg-secondary-container/20 rounded-full p-8">
                    <CheckCircle2 className="text-secondary h-20 w-20" />
                </div>
                <div className="flex flex-col gap-2">
                    <MascotImage emotion="smile" size="md" decorative />
                    <h2 className="text-on-surface text-2xl font-black">
                        {t('signup.complete.title')}
                    </h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                        {t('signup.complete.welcome')}
                        <br />
                        {t('signup.complete.loginPrompt')}
                    </p>
                </div>

                {(state.userName || state.affiliationName) && (
                    <div className="border-outline-variant bg-surface w-full rounded-xl border p-5 text-left">
                        {state.userName && (
                            <div className="border-outline-variant/60 flex justify-between border-b py-2.5 text-sm">
                                <span className="text-on-surface-variant">
                                    {t('signup.complete.usernameLabel')}
                                </span>
                                <span className="font-semibold">
                                    {state.userName}
                                </span>
                            </div>
                        )}
                        {state.affiliationName && (
                            <div className="flex justify-between py-2.5 text-sm">
                                <span className="text-on-surface-variant">
                                    {t('signup.complete.affiliationLabel')}
                                </span>
                                <span className="font-semibold">
                                    {state.affiliationName}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <div className="border-outline-variant bg-surface sticky bottom-0 border-t p-5">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    onClick={handleContinue}
                >
                    {t('signup.complete.loginButton')}
                </EcoButton>
            </div>
        </div>
    )
}

interface AuthInquiryPageProps {
    title: string
    description: string
    phone: string
    email: string
}

export function AuthInquiryPage({
    title,
    description,
    phone,
    email,
}: AuthInquiryPageProps) {
    const { t } = useTranslation('auth')
    const { t: tCommon } = useTranslation('common')

    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                <Link to="/login" className="text-on-surface-variant -ml-2 p-2">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-primary text-lg font-bold">{title}</h1>
                <div className="w-10" />
            </header>

            <main className="flex flex-grow flex-col gap-6 p-5">
                <div className="flex justify-center pt-4">
                    <MascotImage emotion="sad" size="md" decorative />
                </div>

                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-on-surface text-xl font-bold">{title}</h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="border-outline-variant bg-surface flex flex-col gap-4 rounded-xl border p-5">
                    <a
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        className="text-on-surface hover:text-primary flex items-center gap-3 text-sm font-medium"
                    >
                        <Phone className="text-primary h-5 w-5 shrink-0" />
                        <span>{phone}</span>
                    </a>
                    <a
                        href={`mailto:${email}`}
                        className="text-on-surface hover:text-primary flex items-center gap-3 text-sm font-medium"
                    >
                        <Mail className="text-primary h-5 w-5 shrink-0" />
                        <span>{email}</span>
                    </a>
                </div>

                <p className="text-on-surface-variant text-center text-xs leading-relaxed">
                    {t('inquiry.hoursNotice')}
                </p>
            </main>

            <div className="border-outline-variant bg-surface border-t p-5">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    {tCommon('back')}
                </EcoButton>
            </div>
        </div>
    )
}

export function FindAccountInquiry() {
    const { t } = useTranslation('auth')

    return (
        <AuthInquiryPage
            title={t('findAccount.title')}
            description={t('findAccount.description')}
            phone={t('inquiry.contactPhone')}
            email={t('inquiry.contactEmail')}
        />
    )
}

export function AdminSignupInquiry() {
    const { t } = useTranslation('auth')

    return (
        <AuthInquiryPage
            title={t('adminSignup.title')}
            description={t('adminSignup.description')}
            phone={t('inquiry.contactPhone')}
            email={t('inquiry.contactEmail')}
        />
    )
}
